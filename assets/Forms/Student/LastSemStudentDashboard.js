import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator
} from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import APIEndPoint from "../APIEndPoint";

const LastSemStudentDashboard = () => {
  const nav = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused(); 
  
  const { AridNo } = route.params; 
  const formattedArid = AridNo ? AridNo.trim().toUpperCase() : "";

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTopper, setIsTopper] = useState(false); 
  const [supervisor, setSupervisor] = useState("Not Assigned");

  useEffect(() => {
    const fetchData = async () => {
      if (!formattedArid) {
        Alert.alert("Error", "No Arid Number provided.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch Supervisor Name
        try {
            const supResp = await fetch(`${APIEndPoint}/Student/GetSupervisorName?AridNo=${encodeURIComponent(formattedArid)}`);
            if (supResp.status === 200) {
              const supName = await supResp.json();
              setSupervisor(supName || "Not Assigned");
            }
        } catch (supErr) { console.error(supErr); }

        // 2. Fetch Student Profile
        const profileResp = await fetch(`${APIEndPoint}/Student/GetStudentProfile?AridNo=${encodeURIComponent(formattedArid)}`);

        if (profileResp.status === 200) {
          const profileData = await profileResp.json();
          setProfile(profileData);

          // 3. Topper Check
          const confUrl = `${APIEndPoint}/api/Student/getConfidentialStudent?AridNo=${encodeURIComponent(formattedArid)}`;
          const confResp = await fetch(confUrl);
          if (confResp.ok) {
            const confData = await confResp.json();
            setIsTopper(confData.CGPA >= 3.70);
          }

          // 4. Fetch Enrolled Courses
          const courseResp = await fetch(
            `${APIEndPoint}/Student/getStudentCourses?AridNo=${encodeURIComponent(formattedArid)}&semester=${encodeURIComponent(profileData.Semester)}&discipline=${encodeURIComponent(profileData.Course)}`
          );

          if (courseResp.status === 200) {
            const courseData = await courseResp.json();
            if (Array.isArray(courseData)) {
              // Remove duplicates
              const uniqueCourses = courseData.filter((course, index, self) =>
                index === self.findIndex((c) => (c.CourseNo || c.Course_no) === (course.CourseNo || course.Course_no))
              );

              // 5. Check Evaluation Status & Apply Sorting
              const coursesWithStatus = await Promise.all(
                uniqueCourses.map(async (course) => {
                  try {
                    const cNo = course.CourseNo || course.Course_no;
                    const checkUrl = `${APIEndPoint}/Student/CheckIfAlreadyEvaluated?AridNo=${formattedArid}&CourseCode=${cNo}`;
                    const checkResp = await fetch(checkUrl);
                    const isEvaluated = await checkResp.json(); 
                    return { ...course, isDone: isEvaluated === true };
                  } catch (e) {
                    return { ...course, isDone: false };
                  }
                })
              );

              // SORT: Completed (isDone: true) move to bottom
              coursesWithStatus.sort((a, b) => (a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1));
              setCourses(coursesWithStatus);
            }
          }
        }
      } catch (err) {
        Alert.alert("Error", "Unable to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) { fetchData(); }
  }, [formattedArid, isFocused]);

  const logout = () => {
    Alert.alert("Logout", "Are You Sure?", [
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
      <Image style={ss.logo} source={require("../../Images/Biit_Logo.png")} />

      {profile && (
        <View style={ss.mView}>
          <Text style={ss.mTxt}>Student Information</Text>
          <View style={ss.row}>
            <View style={{ flex: 1 }}>
              <Text style={ss.txt}><Text style={ss.bold}>Name:</Text> {profile.FullName}</Text>
              <Text style={ss.txt}><Text style={ss.bold}>Arid#:</Text> {profile.AridNo}</Text>
              <Text style={ss.txt}><Text style={ss.bold}>Section:</Text> {profile.Course}-{profile.Section}{profile.Semester}</Text>
            </View>
            <Image style={ss.avatar} source={require("../../Images/avatar.png")} />
          </View>
        </View>
      )}

      <View style={ss.allcourses}>
        <Text style={ss.cTitle}>Enrolled Courses</Text>
        {courses.map((course, index) => (
          <View key={index} style={ss.cRow}>
            <View style={ss.courseInfo}>
              <Text style={[ss.cName, course.isDone && { color: '#999' }]}>
                {course.CourseName || course.Course_des}
              </Text>
              <Text style={ss.teacherTxt}>👨‍🏫 {course.TeacherName || course.StaffName}</Text>
            </View>
            
            <TouchableOpacity 
              disabled={course.isDone}
              style={[ss.statusBtn, course.isDone && ss.statusBtnDisabled]}
              onPress={() => {
                 const cNo = course.CourseNo || course.Course_no;
                 nav.navigate("StudentQuestionsDashboard", {
                   courseNo: cNo,
                   AridNo: formattedArid,
                   Name: course.TeacherName || course.StaffName,
                   Course_desc: course.CourseName || course.Course_des,
                   teacherId: course.Emp_no || course.StaffNo,
                   Qtype: "Teacher Evaluation"
                 });
              }}
            >
              <Text style={[ss.statusTxt, course.isDone && ss.statusTxtDisabled]}>
                {course.isDone ? "Done" : "Evaluate"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={ss.allcourses}>
        <Text style={ss.cTitle}>Final Year Project</Text>
        <View style={ss.cRow}>
          <View style={ss.courseInfo}>
            <Text style={ss.bold}>Supervisor Evaluation</Text>
            <Text style={ss.teacherTxt}>👤 {supervisor}</Text>
          </View>
          <TouchableOpacity 
            style={ss.statusBtn}
            onPress={() => nav.navigate("StudentQuestionsDashboard", {
                courseNo: "FYP-Supervisor",
                AridNo: formattedArid,
                Name: supervisor,
                Qtype: "Supervisor Evaluation"
            })}
          >
            <Text style={ss.statusTxt}>Evaluate</Text>
          </TouchableOpacity>
        </View>

        {isTopper && (
          <TouchableOpacity 
            style={ss.confBtn} 
            onPress={() => nav.navigate("ConfidentialForm", { AridNo: formattedArid })}
          >
            <Text style={ss.confTxt}>Perform Confidential Evaluation</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={ss.logoutBtn} onPress={logout}>
        <Text style={ss.logoutTxt}>↗️ Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: { backgroundColor: "rgb(14, 59, 45)", alignItems: "center", padding: 20, paddingBottom: 60, flexGrow: 1 },
  loaderContainer: { flex: 1, backgroundColor: "rgb(14, 59, 45)", justifyContent: "center", alignItems: "center" },
  logo: { width: 120, height: 120, resizeMode: "contain", marginTop: 20, marginBottom: 25 },
  bold: { fontWeight: 'bold' },
  mView: { width: "100%", backgroundColor: "#fff", borderRadius: 8, padding: 15, marginBottom: 20, elevation: 3 },
  mTxt: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#0f3b35" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
  txt: { fontSize: 14, marginBottom: 4, color: '#333' },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#eee' },
  allcourses: { width: "100%", backgroundColor: "#fff", borderRadius: 8, padding: 15, marginBottom: 20, elevation: 3 },
  courseInfo: { width: "65%" },
  cTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 15, color: "#0f3b35" },
  cRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  cName: { fontSize: 15, fontWeight: "600", color: "#222" },
  teacherTxt: { fontSize: 13, color: "#666", fontStyle: 'italic', marginTop: 2 },
  
  // Status Button Styles
  statusBtn: { backgroundColor: "#0f3b35", paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, minWidth: 85, alignItems: 'center' },
  statusBtnDisabled: { backgroundColor: "rgba(128, 128, 128, 0.2)", borderWidth: 1, borderColor: "#ccc" },
  statusTxt: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  statusTxtDisabled: { color: "#888" },

  confBtn: { backgroundColor: "#b40f0f", padding: 12, borderRadius: 8, marginTop: 15, alignItems: "center", elevation: 3 },
  confTxt: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  logoutBtn: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 50, borderRadius: 25, marginTop: 10, elevation: 2 },
  logoutTxt: { color: "rgb(15, 59, 53)", fontSize: 16, fontWeight: "bold" },
});

export default LastSemStudentDashboard;