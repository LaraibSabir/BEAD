import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  SafeAreaView
} from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import APIEndPoint from "../APIEndPoint";

const EvaluateTeachers = () => {
  const nav = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const { TeacherID } = route.params || {};
  const formattedID = TeacherID ? String(TeacherID).trim() : "";

  const [profile, setProfile] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const avatarIDs = [
    "BIIT167", "BIIT189", "BIIT212", "BIIT213", "BIIT346", "BIIT359", 
    "BIIT365", "BIIT368", "BIIT222", "BIIT202", "BIIT386", "BIIT422", 
    "BIIT394", "BIIT397", "BIIT395", "BIIT393", "BIIT400", "BIIT402", 
    "BIIT403", "BIIT404", "BIIT407", "BIIT409", "BIIT411", "BIIT412", 
    "BIIT416", "BIIT417", "BIIT418", "BIIT421", "BIIT424", "BIIT425", 
    "BIIT427", "BIIT429"
  ];

  const profileImage = avatarIDs.includes(formattedID)
    ? require("../../Images/avatar.png")
    : require("../../Images/male.png");

  const fetchData = useCallback(async () => {
    if (!formattedID) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // 1. Fetch Profile
      const profileUrl = `${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${encodeURIComponent(formattedID)}`;
      const profileResp = await fetch(profileUrl);
      
      if (profileResp.status === 200) {
        const profileData = await profileResp.json();
        setProfile(profileData);

        // 2. Fetch All Faculty
        const facultyUrl = `${APIEndPoint}/Teacher/GetAllFaculty`;
        const facultyResp = await fetch(facultyUrl);

        if (facultyResp.ok) {
          const facultyData = await facultyResp.json();

          // --- Custom Filtering Logic Based on Designation ---
          const myDesignation = profileData.Designation ? profileData.Designation.trim().toLowerCase() : "";

          const filteredByDesignation = facultyData.filter((t) => {
            const targetID = String(t.Emp_no).trim();
            const targetDesg = t.Designation ? t.Designation.trim().toLowerCase() : "";

            // Apne aap ko nikal dena
            if (targetID === formattedID) return false;

            // Rule 1: Lecturer -> Sirf Lecturers dikhayen
            if (myDesignation === "lecturer") {
              return targetDesg === "lecturer";
            }

            // Rule 2: Associate Professor -> Sab dikhayen magar Director nahi
            if (myDesignation === "associate professor") {
              return targetDesg !== "director";
            }

            // Rule 3: Assistant Professor -> Sab magar Associate Professor aur Director na hon
            if (myDesignation === "assistant professor") {
              return targetDesg !== "associate professor" && targetDesg !== "director";
            }

            // Default: Agar koi aur designation hai to sab show hon
            return true;
          });

          // 3. Status check logic
          const facultyWithStatus = await Promise.all(
            filteredByDesignation.map(async (teacher) => {
              try {
                const checkUrl = `${APIEndPoint}/Teacher/CheckIfAlreadyEvaluated?evaluatorId=${formattedID}&targetId=${teacher.Emp_no.trim()}`;
                const checkResp = await fetch(checkUrl);
                const isEvaluated = await checkResp.json();
                return { ...teacher, isDone: isEvaluated === true };
              } catch (e) {
                return { ...teacher, isDone: false };
              }
            })
          );

          facultyWithStatus.sort((a, b) => (a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1));
          setFacultyList(facultyWithStatus);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      Alert.alert("Connection Error", "Check your API connection.");
    } finally {
      setLoading(false);
    }
  }, [formattedID]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const filteredData = useMemo(() => {
    return facultyList.filter((item) =>
      item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, facultyList]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(15, 59, 53)" }}>
      {loading ? (
        <View style={ss.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Updating Faculty List...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={ss.main}> 
          <Image style={ss.bimg} source={require("../../Images/Biit_Logo.png")} />

          {profile && (
            <View style={ss.mView}>
              <Text style={ss.mTxt}>Evaluator Profile</Text>
              <View style={ss.divider} />
              <View style={ss.row}>
                <View style={{ flex: 1 }}>
                  <Text style={ss.txt}><Text style={ss.bold}>Name:</Text> {profile.Name}</Text>
                  <Text style={ss.txt}><Text style={ss.bold}>Designation:</Text> {profile.Designation}</Text>
                </View>
                <Image style={ss.avatar} source={profileImage} />
              </View>
            </View>
          )}

          <View style={ss.searchContainer}>
            <TextInput
              style={ss.searchInput}
              placeholder="🔎 Search faculty by name..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={ss.allCourse}>
            <Text style={ss.cTitle}>Faculty Evaluation List</Text>
            
            <View style={ss.scrollContainer}>
              <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {filteredData.length > 0 ? (
                  filteredData.map((teacher, index) => (
                    <View key={index} style={ss.cRow}>
                      <View style={ss.courseInfo}>
                        <Text style={[ss.ctxt, teacher.isDone && { color: "#999" }]}>
                          {teacher.Name}
                        </Text>
                        <Text style={ss.teacherTxt}>{teacher.Designation}</Text>
                      </View>

                      <TouchableOpacity
                        disabled={teacher.isDone}
                        style={[
                          ss.statusBtn,
                          teacher.isDone && ss.statusBtnDisabled
                        ]}
                        onPress={() => nav.navigate("TeacherEvalutionQuestions", {
                          TargetID: teacher.Emp_no,
                          EvaluatorID: formattedID,
                          TargetName: teacher.Name,
                          Qtype: "Peer Evaluation",
                          Designation: teacher.Designation 
                        })}
                      >
                        <Text style={[ss.statusTxt, teacher.isDone && ss.statusTxtDisabled]}>
                          {teacher.isDone ? "Evaluated" : "Evaluate"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={{ textAlign: 'center', color: '#666', padding: 20 }}>
                    {facultyList.length === 0 ? "No faculty members found for your level." : "No results match your search."}
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity 
            style={ss.logoutBtn} 
            onPress={() => nav.goBack()}
          >
            <Text style={ss.logoutTxt}>🏠 Back to Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const ss = StyleSheet.create({
  main: { backgroundColor: "rgb(15, 59, 53)", alignItems: "center", padding: 20, paddingBottom: 60, flexGrow: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(15, 59, 53)" },
  bold: { fontWeight: "bold" },
  bimg: { width: 95, height: 95, resizeMode: "contain", marginTop: 10, marginBottom: 15 },
  mView: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 15, elevation: 4 },
  mTxt: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 12, color: "rgb(15, 59, 53)" },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txt: { fontSize: 14, marginBottom: 4, color: "#333" },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: "#ddd" },
  searchContainer: { width: "100%", backgroundColor: "#fff", borderRadius: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginBottom: 20, elevation: 3 },
  searchInput: { flex: 1, height: 50, color: "#333", fontSize: 16 },
  allCourse: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 20, elevation: 4 },
  cTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 15, color: "rgb(15, 59, 53)" },
  scrollContainer: { maxHeight: 250 },
  cRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  courseInfo: { width: "60%" },
  ctxt: { fontSize: 15, fontWeight: "600", color: "#222" },
  teacherTxt: { fontSize: 13, color: "green", marginTop: 2, fontStyle: "italic", fontWeight: '500' },
  statusBtn: { backgroundColor: "rgb(15, 59, 53)", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 95, alignItems: "center" },
  statusTxt: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  statusBtnDisabled: { backgroundColor: "#e0e0e0", borderWidth: 1, borderColor: "#ccc" },
  statusTxtDisabled: { color: "#888", fontWeight: "normal" },
  logoutBtn: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, marginTop: 10 },
  logoutTxt: { color: "rgb(15, 59, 53)", fontSize: 16, fontWeight: "bold" },
});

export default EvaluateTeachers;