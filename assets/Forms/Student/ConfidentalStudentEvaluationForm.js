import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import APIEndPoint from "../APIEndPoint";

const ConfidentalStudentEvaluationForm = () => {
  const nav = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const { AridNo } = route.params;
  const formattedArid = AridNo ? AridNo.trim().toUpperCase() : "";

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfidentialData = async () => {
      if (!formattedArid) {
        Alert.alert("Error", "No Arid Number provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profileUrl = `${APIEndPoint}/Student/GetStudentProfile?AridNo=${encodeURIComponent(formattedArid)}`;
        const profileResp = await fetch(profileUrl);

        if (profileResp.status === 200) {
          const profileData = await profileResp.json();
          setProfile(profileData);

          const courseUrl = `${APIEndPoint}/Student/getStudentCourses?AridNo=${encodeURIComponent(formattedArid)}&semester=${profileData.Semester}&discipline=${encodeURIComponent(profileData.Course)}`;
          const courseResp = await fetch(courseUrl);

          if (courseResp.status === 200) {
            const courseData = await courseResp.json();
            
            if (Array.isArray(courseData)) {
              const uniqueCourses = courseData.filter((course, index, self) =>
                index === self.findIndex((c) => c.CourseNo === course.CourseNo)
              );

              const coursesWithStatus = await Promise.all(
                uniqueCourses.map(async (course) => {
                  try {
                    const checkUrl = `${APIEndPoint}/Student/CheckIfAlreadyEvaluatedCon?AridNo=${formattedArid}&CourseCode=${course.CourseNo}`;
                    const checkResp = await fetch(checkUrl);
                    const isDone = await checkResp.json();
                    return { ...course, isDone: isDone === true };
                  } catch (e) {
                    return { ...course, isDone: false };
                  }
                })
              );

              coursesWithStatus.sort((a, b) => (a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1));
              setCourses(coursesWithStatus);
            }
          }
        } else {
          Alert.alert("Error", "Profile not found.");
        }
      } catch (err) {
        Alert.alert("Connection Error", "Failed to load confidential data.");
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchConfidentialData();
    }
  }, [formattedArid, isFocused]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => nav.reset({ index: 0, routes: [{ name: "Login" }] }) },
    ]);
  };

  if (loading) {
    return (
      <View style={ss.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ss.main}>
      <Image style={ss.bimg} source={require("../../Images/Biit_Logo.png")} />

      {/* WEB VERSION KI HEADING STYLING */}
      <View style={ss.headingContainer}>
        <Text style={ss.mainHeading}>CONFIDENTIAL EVALUATION</Text>
      </View>

      {profile && (
        <View style={ss.mView}>
          <View style={ss.row}>
            <View style={{ flex: 1 }}>
              <Text style={ss.txt}><Text style={ss.bold}>Name:</Text> {profile.FullName}</Text>
              <Text style={ss.txt}><Text style={ss.bold}>Arid#:</Text> {profile.AridNo}</Text>
              <Text style={ss.txt}><Text style={ss.bold}>Section:</Text>{profile.Course}-{profile.Semester}{profile.Section} </Text>
             
            </View>
            <Image 
  style={ss.avatar} 
  source={
    profile?.Sex && profile.Sex.toString().trim().toUpperCase() === "M" 
      ? require("../../Images/male.png") 
      : require("../../Images/avatar.png")
  } 
/>
          </View>
        </View>
      )}

      <Text style={ss.sectionDivider}>Pending Evaluations</Text>

      <View style={ss.allCourse}>
        {courses.map((course, index) => (
          <View key={index} style={[ss.cRow, course.isDone && ss.completedCard]}>
            <View style={ss.courseInfo}>
              <Text style={ss.smallLabel}>Course Code: {course.CourseNo}</Text>
              <Text style={[ss.ctxt, course.isDone && { color: '#999' }]}>
                {course.CourseName}
              </Text>
              <Text style={ss.teacherTxt}>Teacher: {course.TeacherName}</Text>
            </View>

            <TouchableOpacity
              disabled={course.isDone}
              style={[
                ss.statusBtn,
                course.isDone && ss.statusBtnDisabled
              ]}
              onPress={() => {
  nav.navigate("ConfidentailQuestionsDashboard", { 
    courseNo: course.CourseNo,
    AridNo: formattedArid,
    Name: course.TeacherName,
    Course_desc: course.CourseName,
    teacherId: course.EmpNo, // Make sure this is EmpNo from your API
  });
}}
            >
              <Text style={[ss.statusTxt, course.isDone && ss.statusTxtDisabled]}>
                {course.isDone ? "✓ Done" : "Evaluate"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={ss.buttonRow}>
        <TouchableOpacity style={[ss.footerBtn, ss.backBtn]} onPress={() => nav.goBack()}>
          <Text style={ss.backTxt}>← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[ss.footerBtn, ss.logoutBtn]} onPress={handleLogout}>
          <Text style={ss.logoutTxt}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: { backgroundColor: "rgb(15, 59, 53)", alignItems: "center", padding: 20, paddingBottom: 60, flexGrow: 1 },
  loaderContainer: { flex: 1, backgroundColor: "rgb(15, 59, 53)", justifyContent: "center", alignItems: "center" },
  bold: { fontWeight: 'bold' },
  bimg: { width: 100, height: 100, resizeMode: "contain", marginTop: 10, marginBottom: 15 },
  
  headingContainer: { textAlign: 'center', marginBottom: 20 },
  mainHeading: {
    fontSize: 22,
    color: '#e9f1efff',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  mView: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 10, elevation: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
  txt: { fontSize: 14, marginBottom: 4, color: '#333' },
  semesterHighlight: { marginTop: 5, color: '#4CAF50', fontWeight: 'bold', fontSize: 12 },
  avatar: { width: 65, height: 65, borderRadius: 32, borderWidth: 1, borderColor: '#ddd' },
  
  sectionDivider: { color: '#fff', fontSize: 16, fontWeight: '600', marginVertical: 15, alignSelf: 'flex-start', opacity: 0.9 },
  
  allCourse: { width: "100%", marginBottom: 20 },
  cRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 10,
    elevation: 2 
  },
  completedCard: { opacity: 0.8, backgroundColor: '#f9f9f9' },
  courseInfo: { width: "65%" },
  smallLabel: { fontSize: 10, color: '#666', textTransform: 'uppercase', marginBottom: 2 },
  ctxt: { fontSize: 15, fontWeight: "bold", color: "#1a2e28" },
  teacherTxt: { fontSize: 12, color: "#d32f2f", marginTop: 3 },
  
  statusBtn: { backgroundColor: "rgb(15, 59, 53)", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 90, alignItems: 'center' },
  statusBtnDisabled: { backgroundColor: "#e0e0e0" }, 
  statusTxt: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  statusTxtDisabled: { color: "#888" },

  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
  footerBtn: { flex: 0.48, paddingVertical: 12, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  backBtn: { borderWidth: 1, borderColor: "#fff" },
  logoutBtn: { backgroundColor: "#fff" },
  backTxt: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  logoutTxt: { color: "rgb(15, 59, 53)", fontSize: 15, fontWeight: "bold" },
});

export default ConfidentalStudentEvaluationForm;