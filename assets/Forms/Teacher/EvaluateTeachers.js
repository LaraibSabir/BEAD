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

          // Apne aap ko list se nikalne ke liye filter
          const filteredFaculty = facultyData.filter(
            (t) => String(t.Emp_no).trim() !== formattedID
          );

          // 3. Check Peer Status for each teacher (Like Student Dashboard)
          const facultyWithStatus = await Promise.all(
            filteredFaculty.map(async (teacher) => {
              try {
                const checkUrl = `${APIEndPoint}/Evaluation/CheckPeerStatus?evaluatorId=${formattedID}&targetId=${teacher.Emp_no}`;
                const checkResp = await fetch(checkUrl);
                const isEvaluated = await checkResp.json();
                return { ...teacher, isDone: isEvaluated === true };
              } catch (e) {
                return { ...teacher, isDone: false };
              }
            })
          );

          // Pending pehle aur Done baad mein (Sorting)
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

  // Search Filter
  const filteredData = useMemo(() => {
    return facultyList.filter((item) =>
      item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Designation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, facultyList]);

  return (
    <View style={{ flex: 1, backgroundColor: "rgb(15, 59, 53)" }}>
      {loading ? (
        <View style={ss.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Loading Faculty...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={ss.main}> 
          
          <Image style={ss.bimg} source={require("../../Images/Biit_Logo.png")} />

          {/* Profile Section */}
          {profile && (
            <View style={ss.mView}>
              <Text style={ss.mTxt}>Evaluator Profile</Text>
              <View style={ss.divider} />
              <View style={ss.row}>
                <View style={{ flex: 1 }}>
                  <Text style={ss.txt}><Text style={ss.bold}>Name:</Text> {profile.Name}</Text>
                  <Text style={ss.txt}><Text style={ss.bold}>Dept:</Text> {profile.Designation}</Text>
                </View>
                <Image style={ss.avatar} source={require("../../Images/avatar.png")} />
              </View>
            </View>
          )}

          {/* Search Bar */}
          <View style={ss.searchContainer}>
            <TextInput
              style={ss.searchInput}
              placeholder="🔎 Search faculty by name..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={ss.clearBtn}>
                <Text style={{color: '#999', fontWeight: 'bold'}}>X</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Faculty List Section */}
          <View style={ss.allCourse}>
            <Text style={ss.cTitle}>Faculty Evaluation List</Text>
            {filteredData.length > 0 ? (
              filteredData.map((teacher, index) => (
                <View key={index} style={ss.cRow}>
                  <View style={ss.courseInfo}>
                    <Text style={[ss.ctxt, teacher.isDone && { color: "#999" }]}>
                      {teacher.Name}
                    </Text>
                    <Text style={ss.teacherTxt}>{teacher.Designation}</Text>
                  </View>

                  {/* Dynamic Button (Evaluated vs Evaluate) */}
                  <TouchableOpacity
                    disabled={teacher.isDone}
                    style={[
                      ss.statusBtn,
                      teacher.isDone && ss.statusBtnDisabled // Yahan style change ho raha hai
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
                {facultyList.length === 0 ? "No faculty members found." : "No results match your search."}
              </Text>
            )}
          </View>

          <TouchableOpacity 
            style={ss.logoutBtn} 
            onPress={() => nav.goBack()}
          >
            <Text style={ss.logoutTxt}>⬅️ Back to Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const ss = StyleSheet.create({
  main: { backgroundColor: "rgb(15, 59, 53)", alignItems: "center", padding: 20, paddingBottom: 60, flexGrow: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(15, 59, 53)" },
  bold: { fontWeight: "bold" },
  bimg: { width: 100, height: 100, resizeMode: "contain", marginTop: 10, marginBottom: 15 },
  mView: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 15, elevation: 4 },
  mTxt: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 12, color: "rgb(15, 59, 53)" },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txt: { fontSize: 14, marginBottom: 4, color: "#333" },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: "#ddd" },
  
  // Search Styles
  searchContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 3,
  },
  searchInput: { flex: 1, height: 50, color: "#333", fontSize: 16 },
  clearBtn: { padding: 10 },

  allCourse: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 20, elevation: 4 },
  cTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 15, color: "rgb(15, 59, 53)" },
  cRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  courseInfo: { width: "60%" },
  ctxt: { fontSize: 15, fontWeight: "600", color: "#222" },
  teacherTxt: { fontSize: 13, color: "#666", marginTop: 2, fontStyle: "italic" },
  
  // Active Button Style
  statusBtn: { backgroundColor: "rgb(15, 59, 53)", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 95, alignItems: "center" },
  statusTxt: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  // Evaluated (Disabled/Transparent) Style
  statusBtnDisabled: { 
    backgroundColor: "rgba(128, 128, 128, 0.2)", // Student Dashboard wala transparent grey
    borderWidth: 1, 
    borderColor: "rgba(0,0,0,0.05)" 
  },
  statusTxtDisabled: { 
    color: "#888", // Faded text
    fontWeight: "normal" 
  },

  logoutBtn: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, marginTop: 10 },
  logoutTxt: { color: "rgb(15, 59, 53)", fontSize: 16, fontWeight: "bold" },
});

export default EvaluateTeachers;