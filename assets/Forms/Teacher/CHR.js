import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import APIEndPoint from "../APIEndPoint";

const CHR = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { TeacherID } = route.params || {};

  const [teacherData, setTeacherData] = useState(null);
  const [chrData, setChrData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manual date set to match your SQL records
  const [manualDate, setManualDate] = useState("2026-03-05");

  const avatarIDs = [

    "BIIT167", "BIIT189", "BIIT212", "BIIT213", "BIIT346", "BIIT359", 

    "BIIT365", "BIIT368", "BIIT222", "BIIT202", "BIIT386", "BIIT422", 

    "BIIT394", "BIIT397", "BIIT395", "BIIT393", "BIIT400", "BIIT402", 

    "BIIT403", "BIIT404", "BIIT407", "BIIT409", "BIIT411", "BIIT412", 

    "BIIT416", "BIIT417", "BIIT418", "BIIT421", "BIIT424", "BIIT425", 

    "BIIT427", "BIIT429"

  ];



  // Determine the image source based on TeacherID

  const profileImage = avatarIDs.includes(TeacherID)

    ? require("../../Images/avatar.png")

    : require("../../Images/male.png");



  useEffect(() => {

    if (TeacherID) {

     fetchInitialData();
    } else {

      setLoading(false);

      Alert.alert("Error", "No Teacher ID found. Please login again.");

    }

  }, [TeacherID]);
  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Teacher Profile
      const profileRes = await fetch(`${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${TeacherID}`);
      const profileJson = await profileRes.json();

      if (profileRes.ok) {
        setTeacherData(profileJson);
        
        // 2. Fetch Class Held Report
        // Note: Ensure your C# API returns .ToList() to send multiple records
        const chrRes = await fetch(
          `${APIEndPoint}/Teacher/GetTeacherCHR?tId=${encodeURIComponent(TeacherID)}&date=${manualDate}`
        );
        
        if (chrRes.ok) {
          const chrJson = await chrRes.json();
          // Force into array so .map() can render multiple rows
          setChrData(Array.isArray(chrJson) ? chrJson : [chrJson]);
        } else if (chrRes.status === 404) {
          setChrData([]); 
        }
      } else {
        Alert.alert("Error", "Could not load teacher profile.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Check your server connection.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[ss.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 10 }}>Fetching Report...</Text>
      </View>
    );
  }

  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f3b35" />
      
      <ScrollView contentContainerStyle={ss.main} showsVerticalScrollIndicator={false}>
        <Image source={require("../../Images/Biit_Logo.png")} style={ss.logo} />

        {/* Teacher Information Card */}
        <View style={ss.whiteCard}>
          <View style={ss.cardHeader}>
             <Text style={ss.cardTitle}>Teacher Information</Text>
          </View>
          <View style={ss.row}>
            <View style={{ flex: 1 }}>
              <Text style={ss.bold}>Name: 
                <Text style={ss.infoText}> {teacherData?.Name || "N/A"}</Text>
              </Text>
              <Text style={ss.bold}>Designation: 
                <Text style={ss.infoText}> {teacherData?.Designation || "N/A"}</Text>
              </Text>
            </View>
            <Image source={profileImage} style={ss.avatar} />
          </View>
        </View>

        {/* Class Held Report Table - Styled to fit screen */}
        <View style={ss.whiteCard}>
          <View style={ss.cardHeader}>
             <Text style={ss.cardTitle}>Class Held Report</Text>
             <Text style={ss.dateTag}>{manualDate}</Text>
          </View>

          <View style={ss.tableContainer}>
            {/* Table Header */}
            <View style={ss.tableHeader}>
              <Text style={[ss.th, { flex: 0.5 }]}>Sr</Text>
              <Text style={[ss.th, { flex: 1.5 }]}>Course</Text>
              <Text style={[ss.th, { flex: 2 }]}>Teacher</Text>
              <Text style={[ss.th, { flex: 1 }]}>Sec</Text>
              <Text style={[ss.th, { flex: 1 }]}>Venue</Text>
              <Text style={[ss.th, { flex: 1.2 }]}>Status</Text>
            </View>

            {/* Table Body - Renders multiple rows if chrData contains them */}
            {chrData.length > 0 ? chrData.map((item, index) => (
              <View key={index} style={ss.tableRow}>
                <Text style={[ss.td, { flex: 0.5 }]}>{item.SrNo || index + 1}</Text>
                <Text style={[ss.tdBold, { flex: 1.5 }]}>{item.Course_desc || "N/A"}</Text>
                <Text style={[ss.td, { flex: 2 }]}>{item.Teacher || "N/A"}</Text>
                <Text style={[ss.td, { flex: 1 }]}>{item.Discipline_Section || "N/A"}</Text>
                <Text style={[ss.td, { flex: 1 }]}>{item.Venue || "N/A"}</Text>
                <View style={[item.Status === "Late" ? ss.statusBadgeLate : ss.statusBadgeOnTime, { flex: 1.2 }]}>
                    <Text style={item.Status === "Late" ? ss.statusTextLate : ss.statusTextOnTime}>
                      {item.Status || "Held"}
                    </Text>
                </View>
              </View>
            )) : (
              <View style={ss.noDataContainer}>
                <Text style={ss.noData}>No records found for {manualDate}.</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={ss.homeBtn} 
          onPress={() => navigation.goBack()}
        >
          <Text style={ss.homeBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default CHR;

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f3b35" },
  main: { paddingHorizontal: 10, paddingTop: 20, paddingBottom: 40, alignItems: "center" },
  logo: { width: 70, height: 70, resizeMode: "contain", marginBottom: 20 },
  whiteCard: {
    backgroundColor: "#FFFFFF", width: "100%", borderRadius: 12, padding: 10, marginBottom: 20, elevation: 4,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: "#F0F0F0", 
    paddingBottom: 8, 
    marginBottom: 10 
  },
  cardTitle: { fontSize: 11, fontWeight: "800", color: "#0f3b35", textTransform: 'uppercase' },
  dateTag: { fontSize: 9, color: '#888' },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoText: { fontSize: 13, color: "#555", marginBottom: 4 },
  bold: { fontWeight: "bold", color: "#0f3b35" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  
  tableContainer: { width: '100%' },
  tableHeader: { 
    flexDirection: "row", 
    backgroundColor: "#f4f7f6", 
    paddingVertical: 8, 
    borderRadius: 5 
  },
  th: { textAlign: "center", fontWeight: "bold", fontSize: 9, color: "#0f3b35" },
  tableRow: { 
    flexDirection: "row", 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#f1f1f1", 
    alignItems: 'center' 
  },
  td: { textAlign: "center", fontSize: 8.5, color: "#444" },
  tdBold: { textAlign: "center", fontSize: 8.5, fontWeight: "bold", color: "#333" },
  statusBadgeOnTime: { alignItems: 'center', backgroundColor: '#e6f4ea', paddingVertical: 2, borderRadius: 8 },
  statusTextOnTime: { color: "#1e7e34", fontSize: 8, fontWeight: "bold" },
  statusBadgeLate: { alignItems: 'center', backgroundColor: '#fdecea', paddingVertical: 2, borderRadius: 8 },
  statusTextLate: { color: "#d93025", fontSize: 8, fontWeight: "bold" },
  
  homeBtn: { backgroundColor: "#FFFFFF", width: "100%", paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  homeBtnText: { color: "#0f3b35", fontWeight: "bold", fontSize: 16 },
  noDataContainer: { padding: 20, alignItems: 'center' },
  noData: { color: "#888", textAlign: 'center', fontSize: 12 }
});