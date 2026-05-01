import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import APIEndPoint from "../APIEndPoint";

const StudentQuestionsDashboard = () => {
  const route = useRoute();
  const nav = useNavigation();

  const { AridNo, teacherId, Name, Course_desc, courseNo, Qtype } = route.params || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [count, setCount] = useState(1);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [suggestion, setSuggestion] = useState("");

  const ratingMap = { "Excellent": 5, "Good": 4, "Satisfactory": 3, "Below Average": 2, "Poor": 1 };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const profileResp = await fetch(`${APIEndPoint}/Student/GetStudentProfile?AridNo=${AridNo}`);
      const profileData = await profileResp.json();
      setProfile(profileData);
     const qResp = await fetch(`${APIEndPoint}/Student/GetQuestions`);
      if (qResp.status === 200) {
        const qData = await qResp.json();
        // 1. Determine which "Description" to look for in the database
        // This handles "Supervisor Evaluation" -> "S"
      const targetType = Qtype?.includes("Teacher Evaluation") ? "T" : "C";

// Use RawType because that's what the C# API returns
const filtered = qData.filter(q => q.RawType === targetType);
        setQuestions(filtered);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [AridNo, Qtype]); // Qtype is now a dependency

  const handleSelectOption = (opt) => {
    const currentQId = questions[count - 1].Question_Id;
    setSelectedRatings({ ...selectedRatings, [currentQId]: ratingMap[opt] });
  };

  const handleSkipToEnd = () => {
    const updatedRatings = { ...selectedRatings };
    questions.forEach((q) => { 
        if (!updatedRatings[q.Question_Id]) updatedRatings[q.Question_Id] = 2; 
    });
    setSelectedRatings(updatedRatings);
    setCount(questions.length);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedRatings).length < questions.length) {
      Alert.alert("Alert", "Please answer all questions.");
      return;
    }

    const payload = {
      Emp_no: teacherId,
      Reg_no: AridNo,
      Course_no: courseNo,
      Discipline: profile?.Course,
      Suggestion: suggestion,
      Answers: Object.entries(selectedRatings).map(([id, rating]) => ({
        Question_ID: parseInt(id),
        Rating: rating
      }))
    };

    try {
      setLoading(true);
      const response = await fetch(`${APIEndPoint}/Student/SubmitEvaluation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Success", "Feedback Submitted Successfully!", [
          { text: "OK", onPress: () => nav.goBack() } 
        ]);
      } else {
        const result = await response.json();
        Alert.alert("Error", result.ExceptionMessage || "Submission failed.");
      }
    } catch (e) {
      Alert.alert("Error", "Server Connection Error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={ss.loaderContainer}><ActivityIndicator size="large" color="#fff" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(15, 59, 53)" }}>
      <ScrollView contentContainerStyle={ss.main}>
        
        {/* HEADER AREA - Centered Logo */}
        <View style={ss.headerRow}>
          {/* Left spacer */}
          <View style={ss.headerSideContainer} />

          <View style={ss.logoContainer}>
            <Image style={ss.bimg} source={require("../../Images/Biit_Logo.png")} />
          </View>

          {/* Right spacer (Replaces the Home button to maintain balance) */}
          <View style={ss.headerSideContainer} />
        </View>

        {/* STUDENT INFORMATION */}
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

        {/* TEACHER CARD */}
        <View style={ss.teacherCard}>
          <View style={ss.cardHeader}>
            <View style={ss.iconCircle}><Text style={{ fontSize: 24 }}>👨‍🏫</Text></View>
            <View style={ss.headerTextContainer}>
              <Text style={ss.teacherLabel}>Instructor</Text>
              <Text style={ss.teacherName}>{Name}</Text>
            </View>
          </View>
          <View style={ss.divider} />
          <View style={ss.courseContainer}>
            <Text style={ss.courseSubLabel}>COURSE</Text>
            <Text style={ss.courseSubText}>{Course_desc}</Text>
          </View>
        </View>

        <Text style={ss.count}>Question {count} of {questions.length}</Text>
<View style={ss.ratingContainer}>
  <View style={ss.ratingItem}>
    <Text style={ss.ratingNumber}>5</Text>
    <Text style={ss.ratingLabel}>Excellent</Text>
  </View>

  <View style={ss.ratingItem}>
    <Text style={ss.ratingNumber}>4</Text>
    <Text style={ss.ratingLabel}>Good</Text>
  </View>

  <View style={ss.ratingItem}>
    <Text style={ss.ratingNumber}>3</Text>
    <Text style={ss.ratingLabel}>Satisfactory</Text>
  </View>

  <View style={ss.ratingItem}>
    <Text style={ss.ratingNumber}>2</Text>
    <Text style={ss.ratingLabel}>Needs Improvement</Text>
  </View>

  <View style={ss.ratingItem}>
    <Text style={ss.ratingNumber}>1</Text>
    <Text style={ss.ratingLabel}>Poor</Text>
  </View>
</View>
        {/* QUESTIONS BOX */}
        <View style={ss.QView}>
          <Text style={ss.Qtext}>{questions[count - 1]?.Question1}</Text>
          {Object.keys(ratingMap).map((opt) => (
            <TouchableOpacity key={opt} style={ss.radioRow} onPress={() => handleSelectOption(opt)}>
              <View style={ss.radioOuter}>
                {selectedRatings[questions[count - 1]?.Question_Id] === ratingMap[opt] && <View style={ss.radioInner} />}
              </View>
              <Text style={ss.radioText}>{opt}</Text>
            </TouchableOpacity>
          ))}

          {count === questions.length && (
            <TextInput style={ss.input} placeholder="Comments..." value={suggestion} onChangeText={setSuggestion} multiline />
          )}

          <View style={ss.btnContainer}>
            {count > 1 && <TouchableOpacity style={ss.Btn} onPress={() => setCount(count - 1)}><Text style={ss.btnTxt}>Back</Text></TouchableOpacity>}
            {count < questions.length ? (
              <>
                <TouchableOpacity style={ss.Btn} onPress={() => selectedRatings[questions[count - 1].Question_Id] ? setCount(count + 1) : Alert.alert("Select an option")}><Text style={ss.btnTxt}>Next</Text></TouchableOpacity>
                {/* <TouchableOpacity style={[ss.Btn, { borderColor: "#ff6b6b" }]} onPress={handleSkipToEnd}><Text style={[ss.btnTxt, { color: "#ff6b6b" }]}>Skip</Text></TouchableOpacity> */}
              </>
            ) : (
              <TouchableOpacity style={[ss.Btn, { backgroundColor: "#063109", borderColor: "#063109" }]} onPress={handleSubmit}><Text style={{ color: "white", fontWeight: 'bold' }}>Submit</Text></TouchableOpacity>
            )}
          </View>
        </View>
          <TouchableOpacity style={ss.homeBtn} onPress={() => nav.goBack()}>
                <Text style={ss.homeBtnTxt}>🏠 Home</Text>
             </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const ss = StyleSheet.create({
  main: { backgroundColor: "rgb(15, 59, 53)", alignItems: "center", padding: 20, flexGrow: 1 },
  loaderContainer: { flex: 1, backgroundColor: "rgb(15, 59, 53)", justifyContent: "center", alignItems: "center" },
  
  headerRow: { 
    flexDirection: 'row', 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 20,
    marginTop: 10,
  },
  headerSideContainer: {
    flex: 1, // Empty side containers ensure the center column is perfectly centered
  },
  logoContainer: {
    flex: 2, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  bimg: { 
    width: 90, 
    height: 90, 
    resizeMode: "contain",
  },

  mView: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 20, elevation: 4 },
  mTxt: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 12, color: "rgb(15, 59, 53)" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
  txt: { fontSize: 14, marginBottom: 4, color: '#333' },
  bold: { fontWeight: 'bold' },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: '#ddd' },

  teacherCard: { width: "100%", backgroundColor: "rgba(255, 255, 255, 0.12)", padding: 18, borderRadius: 20, marginBottom: 20 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginRight: 12 },
  headerTextContainer: { flex: 1 },
  teacherLabel: { fontSize: 13, color: "#cec79c", fontWeight: "bold" },
  teacherName: { fontSize: 17, color: "#FFFFFF", fontWeight: "800" },
  divider: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.15)", marginVertical: 10 },
  courseSubLabel: { fontSize: 11, color: "#bdc3c7", fontWeight: "bold" },
  courseSubText: { fontSize: 15, color: "#f8f7f5", fontStyle: "italic" },

  count: { color: "white", marginBottom: 10 },
  QView: { width: "100%", backgroundColor: "white", borderRadius: 20, padding: 20 },
  Qtext: { fontSize: 17, textAlign: "center", fontWeight: "700", marginBottom: 20 },
  radioRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "rgb(14, 59, 45)", marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "rgb(14, 59, 45)" },
  radioText: { fontSize: 15, color: "#444" },
  btnContainer: { flexDirection: "row", marginTop: 20, justifyContent: 'center' },
  Btn: { padding: 12, borderRadius: 12, marginHorizontal: 5, borderWidth: 1.5, borderColor: "rgb(14, 59, 45)" },
  btnTxt: { color: "rgb(14, 59, 45)", fontWeight: "bold" },
  input: { width: "100%", backgroundColor: "#f2f2f2", padding: 10, borderRadius: 10, marginTop: 20, minHeight: 80 },

   homeBtn: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20,marginTop: 10 },
  homeBtnTxt: { color: 'rgb(15, 59, 53)', fontWeight: 'bold', fontSize: 16 },
  ratingContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  backgroundColor: "#fff",
  paddingVertical: 10,
  paddingHorizontal: 5,
  borderRadius: 12,
  marginBottom: 15
},

ratingItem: {
  alignItems: "center",
  flex: 1
},

ratingNumber: {
  fontSize: 16,
  fontWeight: "bold",
  color: "rgb(15, 59, 53)"
},

ratingLabel: {
  fontSize: 10,
  textAlign: "center",
  color: "#555"
}
});

export default StudentQuestionsDashboard;