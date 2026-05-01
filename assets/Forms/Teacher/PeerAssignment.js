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
  const { TeacherID } = route.params || {}; // This is the ID of the logged-in HOD

  const [hodData, setHodData] = useState(null);
  const [teachers, setTeachers] = useState([]); 
  const [filteredTeachers, setFilteredTeachers] = useState([]); 
  const [selectedTeachers, setSelectedTeachers] = useState([]); // Will store Emp_no strings
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
      // Note: We use TeacherID for profile, but the list returns Emp_no
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

        // OPTIONAL: Pre-select teachers who already have EvalStatus = 1 in the DB
        const alreadySelected = teachersJson
          .filter(t => t.EvalStatus === 1 || t.EvalStatus === "1")
          .map(t => t.Emp_no);
        setSelectedTeachers(alreadySelected);
      }
    } catch (error) {
      // If you see this, check if APIEndPoint uses your PC's IP address, not 'localhost'
      Alert.alert("Error", "Failed to connect to server. Check your connection/IP.");
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

  // Changed to use Emp_no to match your API response
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
      // Sending the array of Emp_no strings to match your backend List<string>
      const response = await fetch(`${APIEndPoint}/Teacher/SavePeerAssignment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(selectedTeachers) 
      });

      if (response.ok) {
        Alert.alert("Success", "Peer evaluation status updated successfully!");
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

  const logout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => navigation.reset({ index: 0, routes: [{ name: "Login" }] }) }
    ]);
  };

  if (loading) {
    return (
      <View style={[ss.main, { justifyContent: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ss.main} showsVerticalScrollIndicator={false}>
      
      <Image source={require("../../Images/Biit_Logo.png")} style={ss.logo} />

      <View style={ss.card}>
        <Text style={ss.title}>HOD Information</Text>
        <View style={ss.row}>
          <View>
            <Text style={ss.txt}>Name: <Text style={{fontWeight:'bold'}}>{hodData?.Name}</Text></Text>
            <Text style={ss.txt}>Designation: <Text style={{fontWeight:'bold'}}>{hodData?.Designation}</Text></Text>
          </View>
          <Image source={require("../../Images/avatar.png")} style={ss.avatar} />
        </View>
      </View>

      <View style={[ss.styledCard, ss.shadow]}>
        <Text style={ss.sectionTitle}>Peer Assignment</Text>

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

        <View style={ss.tableHeader}>
          <Text style={ss.th}>TEACHER NAME</Text>
          <Text style={ss.th}>SELECT</Text>
        </View>

        {filteredTeachers.map((teacher) => {
          // Using teacher.Emp_no because that is what your API returns
          const isSelected = selectedTeachers.includes(teacher.Emp_no);
          return (
            <TouchableOpacity
              key={teacher.Emp_no}
              activeOpacity={0.7}
              style={[ss.tableRow, isSelected && ss.rowActive]}
              onPress={() => toggleSelection(teacher.Emp_no)}
            >
              <Text style={[ss.td, isSelected && ss.tdActive]}>{teacher.Name}</Text>
              <View style={[ss.checkboxOuter, isSelected && ss.checkboxOuterActive]}>
                {isSelected && <Text style={ss.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={[ss.submitBtn, ss.shadow]} onPress={submitAssignment}>
        <Text style={ss.submitBtnText}>Select ({selectedTeachers.length})</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ss.logout} onPress={logout}>
        <Text style={ss.logoutText}>↗️ Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ss.homeBtn} onPress={() => navigation.goBack()}>
        <Text style={ss.homeBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PeerAssignment;

const ss = StyleSheet.create({
  main: { backgroundColor: "#0f3b35", alignItems: "center", padding: 20, flexGrow: 1 },
  logo: { width: 80, height: 80, marginBottom: 20, resizeMode: 'contain' },
  card: { backgroundColor: "#ffffff", width: "100%", borderRadius: 12, padding: 15, marginBottom: 20, elevation: 4 },
  title: { fontWeight: "bold", textAlign: "center", marginBottom: 10, fontSize: 16, color: '#0f3b35' },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txt: { fontSize: 14, color: '#444' },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  styledCard: { backgroundColor: "#ffffff", width: "100%", borderRadius: 20, padding: 20, marginBottom: 25 },
  shadow: { elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 20, textAlign: "center" },
  searchWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#f1f5f9", borderRadius: 12, paddingHorizontal: 12, marginBottom: 20, borderWidth: 1, borderColor: "#e2e8f0" },
  searchIcon: { marginRight: 8 },
  searchInput: { height: 45, flex: 1, color: "#1e293b", fontSize: 14 },
  tableHeader: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  th: { fontSize: 11, fontWeight: "bold", color: "#64748b" },
  tableRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, paddingHorizontal: 10, borderRadius: 10, marginTop: 4 },
  rowActive: { backgroundColor: "#f0fdf4" },
  td: { fontSize: 15, color: "#334155", fontWeight: "500" },
  tdActive: { color: "#059669", fontWeight: "700" },
  checkboxOuter: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: "#cbd5e1", justifyContent: "center", alignItems: "center" },
  checkboxOuterActive: { backgroundColor: "#10b981", borderColor: "#10b981" },
  checkMark: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  submitBtn: { backgroundColor: "#10b981", width: "100%", padding: 16, borderRadius: 12, alignItems: "center" },
  submitBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
  logout: { backgroundColor: "#ffffff", paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, marginTop: 15 },
  logoutText: { fontWeight: "bold", color: '#0f3b35' },
  homeBtn: { backgroundColor: "#FFF", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20, marginTop: 10 },
  homeBtnText: { color: "#0f3b35", fontWeight: "bold" },
});