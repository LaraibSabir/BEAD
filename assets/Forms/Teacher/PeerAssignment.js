import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import APIEndPoint from "../APIEndPoint";

const PeerAssignment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { TeacherID } = route.params || {};

  const [hodData, setHodData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (TeacherID) {
      fetchInitialData();
    } else {
      setLoading(false);
      Alert.alert("Error", "Session expired. Please login again.");
    }
  }, [TeacherID]);

  const fetchInitialData = async () => {
    try {
      const [profileRes, teachersRes] = await Promise.all([
        fetch(`${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${TeacherID}`),
        fetch(`${APIEndPoint}/Teacher/GetAllTeachers`)
      ]);

      const profileJson = await profileRes.json();
      const teachersJson = await teachersRes.json();

      if (profileRes.ok) setHodData(profileJson);

      if (teachersRes.ok) {
        setTeachers(teachersJson);
        setFilteredTeachers(teachersJson);

        const alreadySelected = teachersJson
          .filter(t => t.EvalStatus === 1 || t.EvalStatus === "1")
          .map(t => t.Emp_no);
        setSelectedTeachers(alreadySelected);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(t =>
        t.Name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  };

  const avatarIDs = [
    "BIIT167", "BIIT189", "BIIT212", "BIIT213", "BIIT346", "BIIT359",
    "BIIT365", "BIIT368", "BIIT222", "BIIT202", "BIIT386", "BIIT422",
    "BIIT394", "BIIT397", "BIIT395", "BIIT393", "BIIT400", "BIIT402",
    "BIIT403", "BIIT404", "BIIT407", "BIIT409", "BIIT411", "BIIT412",
    "BIIT416", "BIIT417", "BIIT418", "BIIT421", "BIIT424", "BIIT425",
    "BIIT427", "BIIT429"
  ];

  const profileImage = avatarIDs.includes(TeacherID)
    ? require("../../Images/avatar.png")
    : require("../../Images/male.png");

  const toggleSelection = (empNo) => {
    if (selectedTeachers.includes(empNo)) {
      setSelectedTeachers(selectedTeachers.filter(id => id !== empNo));
    } else {
      setSelectedTeachers([...selectedTeachers, empNo]);
    }
  };

  const submitAssignment = async () => {
    if (selectedTeachers.length === 0) {
      Alert.alert("Wait", "Please select at least one teacher.");
      return;
    }

    setLoading(true);
    try {
      // PeerAssignment.js mein is line ko change karkay dekhein:
const response = await fetch(`${APIEndPoint}/Teacher/SavePeerAssignment`, { 
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(selectedTeachers)
});

      if (response.ok) {
        Alert.alert("Success", "Peer evaluation status updated successfully!", [
          { text: "OK", onPress: () => fetchInitialData() }
        ]);
      } else {
        const errorData = await response.text();
        Alert.alert("Error", `Server returned: ${errorData}`);
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[ss.main, { justifyContent: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={ss.main}>
      <Image source={require("../../Images/Biit_Logo.png")} style={ss.logo} />

      {/* HOD Card */}
      <View style={ss.card}>
        <Text style={ss.title}>HOD Information</Text>
        <View style={ss.row}>
          <View>
            <Text style={ss.txt}><Text style={{fontWeight:'bold'}}>Name: </Text>{hodData?.Name}</Text>
            <Text style={ss.txt}><Text style={{fontWeight:'bold'}}>Designation: </Text>{hodData?.Designation}</Text>
          </View>
          <Image source={profileImage} style={ss.avatar} />
        </View>
      </View>

      <View style={[ss.styledCard, ss.shadow]}>
        <View style={ss.headerRow}>
           <Text style={ss.sectionTitle}>Peer Assignment</Text>
           <Text style={ss.totalBadge}>Total: {teachers.length}</Text>
        </View>

        <View style={ss.searchWrapper}>
          <Text style={ss.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search Teacher Name..."
            placeholderTextColor="#94a3b8"
            style={ss.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Scrollable Teacher List Container */}
        <View style={ss.listContainer}>
          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
            {filteredTeachers.map((teacher) => {
              const isSelected = selectedTeachers.includes(teacher.Emp_no);
              return (
                <TouchableOpacity
                  key={teacher.Emp_no}
                  activeOpacity={0.7}
                  style={[ss.tableRow, isSelected && ss.rowActive]}
                  onPress={() => toggleSelection(teacher.Emp_no)}
                >
                  <View style={ss.teacherInfo}>
                    <Text style={[ss.tdName, isSelected && ss.tdActive]}>{teacher.Name}</Text>
                    <Text style={ss.tdDesig}>{teacher.Designation}</Text>
                  </View>
                  <View style={[ss.checkboxOuter, isSelected && ss.checkboxOuterActive]}>
                    {isSelected && <Text style={ss.checkMark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity style={[ss.submitBtn, ss.shadow]} onPress={submitAssignment}>
        <Text style={ss.submitBtnText}>Select ({selectedTeachers.length})</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[ss.homeBtn, ss.shadow]} onPress={() => navigation.goBack()}>
        <Text style={ss.homeBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PeerAssignment;

const ss = StyleSheet.create({
  main: { backgroundColor: "#0f3b35", alignItems: "center", padding: 20, flex: 1 },
  logo: { width: 80, height: 80, marginBottom: 15, resizeMode: 'contain' },
  card: { backgroundColor: "#ffffff", width: "100%", borderRadius: 12, padding: 15, marginBottom: 15, elevation: 4 },
  title: { fontWeight: "bold", textAlign: "center", marginBottom: 10, fontSize: 16, color: '#0f3b35' },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txt: { fontSize: 14, color: '#444' },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  styledCard: { backgroundColor: "#ffffff", width: "100%", borderRadius: 20, padding: 20, marginBottom: 15, maxHeight: '52%' },
  shadow: { elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111827" },
  
  // Total Badge (Back to original style)
  totalBadge: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#10b981', 
    backgroundColor: '#f0fdf4', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 10 
  },
  
  searchWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 12, paddingHorizontal: 12, marginBottom: 15, borderWidth: 1, borderColor: "#e2e8f0" },
  searchIcon: { marginRight: 8 },
  searchInput: { height: 45, flex: 1, color: "#1e293b", fontSize: 14 },
  
  // List Styling
  listContainer: { height: 210 }, 
  tableRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingVertical: 12, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9',
    marginBottom: 5
  },
  rowActive: { backgroundColor: "#f0fdf4" },
  teacherInfo: { flex: 1 },
  tdName: { fontSize: 15, color: "#334155", fontWeight: "700" },
  tdDesig: { fontSize: 12, color: "#10b981", fontWeight: "600", marginTop: 2 }, 
  tdActive: { color: "#059669" },
  checkboxOuter: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: "#cbd5e1", justifyContent: "center", alignItems: "center" },
  checkboxOuterActive: { backgroundColor: "#10b981", borderColor: "#10b981" },
  checkMark: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },

  submitBtn: { backgroundColor: "#10b981", width: "100%", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 10 },
  submitBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
  
  // Updated Home Button
  homeBtn: { 
    backgroundColor: "#ffffff", 
    width: "100%", 
    padding: 12, 
    borderRadius: 12, 
    alignItems: "center",
  },
  homeBtnText: { color: "#0f3b35", fontWeight: "bold", fontSize: 15 },
});