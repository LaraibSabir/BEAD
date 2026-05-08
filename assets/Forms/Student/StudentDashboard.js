import React, { useEffect, useState, useCallback } from "react";
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

const StudentDashboard = () => {
  const nav = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const { AridNo } = route.params || {};
  const formattedArid = AridNo ? AridNo.trim().toUpperCase() : "";

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTopper, setIsTopper] = useState(false);
  const [isConfDone, setIsConfDone] = useState(false);

  const fetchData = useCallback(async () => {
    if (!formattedArid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // 1. Fetch Profile
      const profileUrl = `${APIEndPoint}/Student/GetStudentProfile?AridNo=${encodeURIComponent(formattedArid)}`;
      const profileResp = await fetch(profileUrl);

      if (profileResp.status === 200) {
       const profileData = await profileResp.json();
console.log("DEBUG - API Sex Value:", profileData.Sex); // Check this in your VS Code terminal
setProfile(profileData);

        // 2. Check Topper Status (CGPA >= 3.70)
        const confUrl = `${APIEndPoint}/Student/getConfidentialStudent?AridNo=${encodeURIComponent(formattedArid)}`;
        const confResp = await fetch(confUrl);
        
        if (confResp.ok) {
          const confData = await confResp.json();
          if (confData.CGPA >= 3.7) {
            setIsTopper(true);
            // Check if confidential eval already done (uses conEvals table in backend)
            try {
              const checkConfUrl = `${APIEndPoint}/Student/CheckIfAlreadyEvaluatedCon?AridNo=${formattedArid}&CourseCode=CONF`;
              const resConf = await fetch(checkConfUrl);
              if (resConf.ok) {
                const confStatus = await resConf.json();
                setIsConfDone(confStatus === true);
              }
            } catch (e) {
              // If check fails, default to allowing submission
              setIsConfDone(false);
            }
          }
        }

        // 3. Fetch Courses & Check Evaluation Status
        const courseUrl = `${APIEndPoint}/Student/GetStudentCourses?AridNo=${encodeURIComponent(formattedArid)}&semester=${profileData.Semester}&discipline=${encodeURIComponent(profileData.Course)}`;
        const courseResp = await fetch(courseUrl);

        if (courseResp.ok) {
          const courseData = await courseResp.json();
          if (Array.isArray(courseData)) {
            const uniqueCourses = courseData.filter(
              (course, index, self) =>
                index === self.findIndex((c) => c.CourseNo === course.CourseNo)
            );

            const coursesWithStatus = await Promise.all(
              uniqueCourses.map(async (course) => {
                try {
                  // Make sure this endpoint matches your C# Route
                  const checkUrl = `${APIEndPoint}/Student/CheckIfAlreadyEvaluated?AridNo=${formattedArid}&CourseCode=${course.CourseNo}`;
                  const checkResp = await fetch(checkUrl);
                  const isEvaluated = await checkResp.json();
                  return { ...course, isDone: isEvaluated === true };
                } catch (e) {
                  return { ...course, isDone: false };
                }
              })
            );

            // Sort: Pending evaluations first
            coursesWithStatus.sort((a, b) => (a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1));
            setCourses(coursesWithStatus);
          }
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [formattedArid]);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused, fetchData]);

  const logout = () => {
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
    <View style={{ flex: 1, backgroundColor: "rgb(15, 59, 53)" }}>
      <ScrollView contentContainerStyle={ss.main}>
        <Image style={ss.bimg} source={require("../../Images/Biit_Logo.png")} />

        {profile && (
          <View style={ss.mView}>
            <Text style={ss.mTxt}>Student Information</Text>
            <View style={ss.row}>
              <View style={{ flex: 1 }}>
                <Text style={ss.txt}><Text style={ss.bold}>Name:</Text> {profile.FullName}</Text>
                <Text style={ss.txt}><Text style={ss.bold}>Arid#:</Text> {profile.AridNo}</Text>
                <Text style={ss.txt}><Text style={ss.bold}>Section:</Text> {profile.Course} - {profile.Semester}{profile.Section} </Text>
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

        <View style={ss.allCourse}>
          <Text style={ss.cTitle}>Enrolled Courses</Text>
          {courses.map((course, index) => (
            <View key={index} style={ss.cRow}>
              <View style={ss.courseInfo}>
                <Text style={[ss.ctxt, course.isDone && { color: "#999" }]}>
                  {course.CourseName}
                </Text>
                <Text style={ss.teacherTxt}>{course.TeacherName}</Text>
              </View>

              <TouchableOpacity
                disabled={course.isDone}
                style={[
                    ss.statusBtn, 
                    course.isDone && ss.statusBtnDisabled // Yahan style change ho rahi hai
                ]}
                onPress={() => nav.navigate("StudentQuestionsDashboard", {
                  courseNo: course.CourseNo,
                  AridNo: formattedArid,
                  Name: course.TeacherName,
                  Course_desc: course.CourseName,
                  teacherId: course.Emp_no,
                  Qtype: "Teacher Evaluation",
                })}
              >
                <Text style={[ss.statusTxt, course.isDone && ss.statusTxtDisabled]}>
                  {course.isDone ? "Evaluated" : "Evaluate"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {isTopper && (
            <TouchableOpacity
              disabled={isConfDone}
              style={[ss.confBtn, isConfDone && ss.statusBtnDisabled]}
              onPress={() => nav.navigate("ConfidentalStudentEvaluationForm", { AridNo: formattedArid })}
            >
              <Text style={[ss.confTxt, isConfDone && ss.statusTxtDisabled]}>
                {isConfDone ? "✅ Confidential Done" : " Perform Confidential Evaluation"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={ss.logoutBtn} onPress={logout}>
          <Text style={ss.logoutTxt}>↗️ Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ss = StyleSheet.create({
  main: { backgroundColor: "rgb(15, 59, 53)", alignItems: "center", padding: 20, paddingBottom: 60, flexGrow: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgb(15, 59, 53)" },
  bold: { fontWeight: "bold" },
  bimg: { width: 120, height: 120, resizeMode: "contain", marginTop: 20, marginBottom: 25 },
  mView: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 20, elevation: 4 },
  mTxt: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 12, color: "rgb(15, 59, 53)" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txt: { fontSize: 14, marginBottom: 4, color: "#333" },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: "#ddd" },
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
    backgroundColor: "rgba(128, 128, 128, 0.2)", // Greyish and Transparent
    borderWidth: 1, 
    borderColor: "rgba(0,0,0,0.05)" 
  },
  statusTxtDisabled: { 
    color: "#888", // Faded text
    fontWeight: "normal" 
  },

  confBtn: { backgroundColor: "#b40f0f", padding: 15, borderRadius: 8, marginTop: 20, alignItems: "center", width: '100%' },
  confTxt: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  logoutBtn: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 50, borderRadius: 30, marginTop: 10 },
  logoutTxt: { color: "rgb(15, 59, 53)", fontSize: 16, fontWeight: "bold" },
});

export default StudentDashboard;