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
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import APIEndPoint from "../APIEndPoint";

const Attendance = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { TeacherID } = route.params || {};

  const [teacherData, setTeacherData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date states managed by Database fetch
  const [dbRange, setDbRange] = useState({ start: "", end: "" });
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Call the actual function name defined below
      initialDataFetch(); 
    } else {
      setLoading(false);
      Alert.alert("Error", "No Teacher ID found. Please login again.");
    }
  }, [TeacherID]);
  

  const initialDataFetch = async () => {
    setLoading(true);
    try {
      // 1. Fetch the Date Range first
      const rangeRes = await fetch(`${APIEndPoint}/Teacher/GetTeacherDateRange?teacherId=${TeacherID}`);
      const rangeJson = await rangeRes.json();

      let startDate = "";
      let endDate = "";

      if (rangeRes.ok) {
        startDate = rangeJson.Start;
        endDate = rangeJson.End;
        setDbRange({ start: startDate, end: endDate });
      }

      // 2. Fetch Profile and Attendance using those dates
      const [profileRes, attendanceRes] = await Promise.all([
        fetch(`${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${TeacherID}`),
        fetch(`${APIEndPoint}/Teacher/GetTeacherAttendanceRange?teacherId=${TeacherID}&start=${startDate}&end=${endDate}`)
      ]);

      const profileJson = await profileRes.json();
      const attendanceJson = await attendanceRes.json();

      if (profileRes.ok) setTeacherData(profileJson);
      
      if (attendanceRes.ok) {
        // Sort ascending by Date just in case
        const sorted = attendanceJson.sort((a, b) => new Date(a.AttendanceDate) - new Date(b.AttendanceDate));
        setAttendanceData(sorted);
      }

    } catch (error) {
      Alert.alert("Network Error", "Failed to sync with server.");
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return Alert.alert("Required", "Please enter a comment.");
    
    // Using first record ID as reference
    const refId = attendanceData.length > 0 ? attendanceData[0].RecordID : 0;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${APIEndPoint}/Teacher/AddAttendanceComments?attendanceId=${refId}&teacherId=${TeacherID}&comments=${encodeURIComponent(commentText)}`,
        { method: "POST" }
      );

      if (response.ok) {
        Alert.alert("Success", "Comment saved.");
        setCommentText("");
      }
    } catch (e) {
      Alert.alert("Error", "Submission failed.");
    } finally { setIsSubmitting(false); }
  };

  if (loading) {
    return (
      <View style={[ss.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={ss.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f3b35" />
      <ScrollView contentContainerStyle={ss.main} showsVerticalScrollIndicator={false}>

        <Image source={require("../../Images/Biit_Logo.png")} style={ss.logo} />

        <View style={ss.whiteCard}>
          <Text style={ss.cardTitle}>Teacher Information</Text>
          <View style={ss.row}>
            <View style={{ flex: 1 }}>
              <Text style={ss.infoText}>Name: <Text style={ss.bold}>{teacherData?.Name || "N/A"}</Text></Text>
              <Text style={ss.infoText}>Designation: <Text style={ss.bold}>{teacherData?.Designation || "N/A"}</Text></Text>
              <Text style={ss.infoText}>Range: <Text style={ss.bold}>{dbRange.start} to {dbRange.end}</Text></Text>
            </View>
           <Image source={profileImage} style={ss.avatar} />
          </View>
        </View>

        <View style={ss.whiteCard}>
          <Text style={ss.cardTitle}>Attendance</Text>
          <ScrollView horizontal>
            <View style={ss.tableMinWidth}>
              <View style={ss.tableHeader}>
                {["Date", "Day", "In", "Out", "Status", "Hours"].map((h, i) => (
                  <Text key={i} style={[ss.th, i === 0 && {textAlign: 'left', paddingLeft: 10}]}>{h}</Text>
                ))}
              </View>

              {attendanceData.map((item, index) => (
                <View key={index} style={[ss.tableRow, index % 2 !== 0 && ss.zebraRow]}>
                  <Text style={[ss.td, {textAlign: 'left', paddingLeft: 10}]}>{item.AttendanceDate?.split('T')[0]}</Text>
                  <Text style={ss.td}>{item.DayOfWeek}</Text>
                  <Text style={ss.td}>{item.TimeIn}</Text>
                  <Text style={ss.td}>{item.TimeOut}</Text>
                  <View style={ss.badgeWrapper}>
                    <View style={[ss.statusBadge, { backgroundColor: item.Status === 'Present' ? '#e6f4ea' : '#fdecea' }]}>
                      <Text style={[ss.statusText, { color: item.Status === 'Present' ? '#1e7e34' : '#d93025' }]}>{item.Status}</Text>
                    </View>
                  </View>
                  <Text style={ss.tdBold}>{item.WorkHours}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={ss.commentSection}>
          <TextInput
            style={ss.textInput}
            placeholder="Type attendance comment..."
            multiline
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity style={ss.submitBtn} onPress={submitComment} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#0f3b35" /> : <Text style={ss.submitBtnText}>Submit Comment</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={ss.homeBtn} onPress={() => navigation.goBack()}>
          <Text style={ss.homeBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Attendance;

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f3b35" },
  main: { paddingHorizontal: 15, paddingVertical: 20, alignItems: "center" },
  logo: { width: 70, height: 70, resizeMode: "contain", marginBottom: 15 },
  whiteCard: { backgroundColor: "#FFF", width: "100%", borderRadius: 12, padding: 15, marginBottom: 15, elevation: 4 },
  cardTitle: { fontSize: 12, fontWeight: "800", color: "#0f3b35", textAlign: 'center', marginBottom: 10, textTransform: 'uppercase' },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoText: { fontSize: 13, color: "#555" },
  bold: { fontWeight: "bold", color: "#000" },
  avatar: { width: 45, height: 45, borderRadius: 22 },
  tableMinWidth: { minWidth: 420 },
  tableHeader: { flexDirection: "row", backgroundColor: "#0f3b35", paddingVertical: 8, borderRadius: 5 },
  th: { width: 70, textAlign: "center", color: "#fff", fontSize: 10, fontWeight: "bold" },
  tableRow: { flexDirection: "row", paddingVertical: 10, alignItems: 'center' },
  zebraRow: { backgroundColor: '#f2f2f2' },
  td: { width: 70, textAlign: "center", fontSize: 10, color: "#333" },
  tdBold: { width: 70, textAlign: "center", fontSize: 10, fontWeight: "bold" },
  badgeWrapper: { width: 70, alignItems: 'center' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 9, fontWeight: "bold" },
  commentSection: { width: '100%', marginBottom: 20 },
  textInput: { backgroundColor: '#706969', borderRadius: 8, padding: 12, height: 60, textAlignVertical: 'top' ,color:'#0c0c0c',backgroundtext:'#1c1d1d'},
  submitBtn: { backgroundColor: '#218564', marginTop: 10, padding: 12, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { fontWeight: 'bold', color: '#f3fbfb' },
  homeBtn: { backgroundColor: "#FFF", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20 },
  homeBtnText: { color: "#0f3b35", fontWeight: "bold" },
});