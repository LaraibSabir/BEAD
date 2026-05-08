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

const TeacherEvalutionQuestions = () => {
  const route = useRoute();
  const nav = useNavigation();

  const { EvaluatorID, TargetID, TargetName, Qtype, Designation } = route.params || {};
  const formattedID = EvaluatorID ? String(EvaluatorID).trim() : "";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [count, setCount] = useState(1);
  const [selectedRatings, setSelectedRatings] = useState({});
  const [suggestion, setSuggestion] = useState("");
  
  const [isFinished, setIsFinished] = useState(false);
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

  const ratingMap = {
    "Excellent": 5,
    "Good": 4,
    "Satisfactory": 3,
    "Below Average": 2,
    "Poor": 1
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const checkUrl = `${APIEndPoint}/Teacher/CheckIfAlreadyEvaluated?evaluatorId=${encodeURIComponent(formattedID)}&targetId=${encodeURIComponent(TargetID)}`;
        const checkResp = await fetch(checkUrl);
        const hasEvaluated = await checkResp.json();

        if (hasEvaluated === true) {
          setAlreadyEvaluated(true);
        }

        if (formattedID) {
          const profileUrl = `${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${encodeURIComponent(formattedID)}`;
          const profileResp = await fetch(profileUrl);
          if (profileResp.ok) {
            const profileData = await profileResp.json();
            setProfile(profileData);
          }
        }

        if (!hasEvaluated) {
            const qResp = await fetch(`${APIEndPoint}/Student/GetQuestions`);
            if (qResp.ok) {
              const qData = await qResp.json();
              let targetType = "";
              const cleanDesignation = Designation ? Designation.trim().toLowerCase() : "";
              const qtypeLower = Qtype ? Qtype.toLowerCase() : "";
    
              if (qtypeLower.includes("peer")) {
                targetType = (cleanDesignation.includes("junior") || cleanDesignation.includes("jr")) ? "PTJ" : "PTS";
              } else {
                targetType = "C"; 
              }
    
              const filtered = qData.filter(q => q.RawType === targetType);
              setQuestions(filtered.length === 0 ? qData : filtered);
            }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        Alert.alert("Error", "Check server connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formattedID, TargetID, Qtype, Designation]);

  const handleSubmit = async () => {
    if (Object.keys(selectedRatings).length < questions.length) {
        Alert.alert("Alert", "Please answer all questions.");
        return;
    }

    const payload = {
        Evaluator_Emp_no: formattedID, 
        Target_Emp_no: TargetID,       
        Suggestion: suggestion,
        Answers: Object.entries(selectedRatings).map(([id, rating]) => ({
            Question_ID: parseInt(id),
            Rating: rating
        }))
    };

    try {
        setLoading(true);
        const response = await fetch(`${APIEndPoint}/Teacher/SubmitPeer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            setIsFinished(true);
        } else {
            const result = await response.json();
            Alert.alert("Error", result.Message || "Failed to save data.");
        }
    } catch (error) {
        Alert.alert("Error", "Network error.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={ss.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(15, 59, 53)" }}>
      <ScrollView contentContainerStyle={ss.main}>
        <Image style={ss.bimg} source={require("../../Images/Biit_Logo.png")} />

        {profile && (
          <View style={ss.mView}>
            <Text style={ss.mTxt}>Evaluator Profile</Text>
            <View style={ss.row}>
              <View style={{ flex: 1 }}>
                <Text style={ss.txt}><Text style={ss.bold}>Name:</Text> {profile.Name}</Text>
                <Text style={ss.txt}><Text style={ss.bold}>Dept:</Text> {profile.Designation}</Text>
              </View>
              <Image style={ss.avatar} source={profileImage} />
            </View>
          </View>
        )}

        <View style={ss.teacherCard}>
          <View style={ss.cardHeader}>
            <View style={ss.iconCircle}><Text style={{ fontSize: 24 }}>👨‍🏫</Text></View>
            <View style={ss.headerTextContainer}>
              <Text style={ss.teacherLabel}>Target Teacher:</Text>
              <Text style={ss.teacherName}>{TargetName}</Text>
              <Text style={ss.teacherLabel}>{Designation}</Text>
            </View>
            {(alreadyEvaluated || isFinished) && (
              <View style={ss.statusBadge}>
                <Text style={ss.statusBadgeText}>Evaluated</Text>
              </View>
            )}
          </View>
        </View>

        {(alreadyEvaluated || isFinished) ? (
          <View style={ss.successCard}>
            <Text style={ss.successTitle}>
              {alreadyEvaluated ? "Already Evaluated" : "Submitted Successfully!"}
            </Text>
            <Text style={ss.successSub}>
              You have completed the peer evaluation for this colleague.
            </Text>
            
            <TouchableOpacity style={ss.finishBtn} onPress={() => nav.goBack()}>
              <Text style={ss.finishBtnText}>Return to List</Text>
            </TouchableOpacity>

            {/* BACK TO DASHBOARD ADDED HERE */}
            <TouchableOpacity 
              style={[ss.finishBtn, { backgroundColor: '#fff', marginTop: 10, borderWidth: 1, borderColor: 'rgb(15, 59, 53)' }]} 
              onPress={() => nav.navigate("TeacherDashboard")}
            >
              <Text style={[ss.finishBtnText, { color: 'rgb(15, 59, 53)' }]}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          questions.length > 0 && (
            <>
              <Text style={ss.count}>Question {count} of {questions.length}</Text>
              <View style={ss.ratingContainer}>
                  {["5", "4", "3", "2", "1"].map((num, i) => (
                      <View key={num} style={ss.ratingItem}>
                          <Text style={ss.ratingNumber}>{num}</Text>
                          <Text style={ss.ratingLabel}>{Object.keys(ratingMap)[i]}</Text>
                      </View>
                  ))}
              </View>

              <View style={ss.QView}>
                <Text style={ss.Qtext}>{questions[count - 1]?.Question1}</Text>
                {Object.keys(ratingMap).map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={ss.radioRow}
                    onPress={() => setSelectedRatings({...selectedRatings, [questions[count - 1]?.Question_Id]: ratingMap[opt]})}
                  >
                    <View style={ss.radioOuter}>
                      {selectedRatings[questions[count - 1]?.Question_Id] === ratingMap[opt] && (
                        <View style={ss.radioInner} />
                      )}
                    </View>
                    <Text style={ss.radioText}>{opt}</Text>
                  </TouchableOpacity>
                ))}

                {count === questions.length && (
                  <TextInput
                    style={ss.input}
                    placeholder="Any suggestions?"
                    value={suggestion}
                    onChangeText={setSuggestion}
                    multiline
                  />
                )}

                <View style={ss.btnContainer}>
                  {count > 1 && (
                    <TouchableOpacity style={ss.Btn} onPress={() => setCount(count - 1)}>
                      <Text style={ss.btnTxt}>Back</Text>
                    </TouchableOpacity>
                  )}
                  <View style={{ flex: 1, alignItems: "center" }}>
                    {count < questions.length ? (
                      <TouchableOpacity
                        style={ss.Btn}
                        onPress={() => selectedRatings[questions[count - 1]?.Question_Id] ? setCount(count + 1) : Alert.alert("Select an option")}
                      >
                        <Text style={ss.btnTxt}>Next</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={[ss.Btn, { backgroundColor: "#063109" }]} onPress={handleSubmit}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>Submit Feedback</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              {/* DASHBOARD BUTTON AT THE END OF QUESTIONS TOO */}
              <TouchableOpacity 
                style={ss.dashboardBtn} 
                onPress={() => nav.goBack()}
              >
                <Text style={ss.dashboardBtnTxt}>🏠 Back to Dashboard</Text>
              </TouchableOpacity>
            </>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ss = StyleSheet.create({
  main: { backgroundColor: "rgb(15, 59, 53)", alignItems: "center", padding: 20, flexGrow: 1 },
  loaderContainer: { flex: 1, backgroundColor: "rgb(15, 59, 53)", justifyContent: "center", alignItems: "center" },
  bimg: { width: 80, height: 80, resizeMode: "contain", marginBottom: 15 },
  mView: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 15 },
  mTxt: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center' },
  txt: { fontSize: 13 },
  bold: { fontWeight: 'bold' },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  teacherCard: { width: "100%", backgroundColor: "rgba(255,255,255,0.15)", padding: 15, borderRadius: 15, marginBottom: 10 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginRight: 12 },
  headerTextContainer: { flex: 1 },
  teacherName: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  teacherLabel:{ color: "#fff", fontSize: 12 },
  count: { color: "white", marginVertical: 10 },
  QView: { width: "100%", backgroundColor: "white", borderRadius: 20, padding: 20 },
  Qtext: { fontSize: 16, textAlign: "center", fontWeight: "700", marginBottom: 20 },
  radioRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "black" },
  radioText: { fontSize: 15 },
  btnContainer: { flexDirection: "row", marginTop: 20, justifyContent: "center", width: "100%" },
  Btn: { padding: 10, borderWidth: 1, marginHorizontal: 5 , minWidth: 80, alignItems:"center", borderRadius: 5 },
  btnTxt: { color: "rgb(14, 59, 45)", fontWeight: "bold" },
  input: { width: "100%", backgroundColor: "#f9f9f9", padding: 10, marginTop: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
  ratingContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 5, borderRadius: 12, marginBottom: 15 },
  ratingItem: { alignItems: "center", flex: 1 },
  ratingNumber: { fontSize: 16, fontWeight: "bold", color: "rgb(15, 59, 53)" },
  ratingLabel: { fontSize: 9, textAlign: "center", color: "#555" },
  statusBadge: { backgroundColor: '#2ecc71', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  successCard: { backgroundColor: '#fff', borderRadius: 20, padding: 25, width: '100%', alignItems: 'center', marginTop: 10 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 10 },
  successSub: { fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 20 },
  finishBtn: { backgroundColor: 'rgb(15, 59, 53)', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  finishBtnText: { color: '#fff', fontWeight: 'bold' },

  // DASHBOARD BUTTON STYLES
  dashboardBtn: { backgroundColor: '#fff', padding: 15, borderRadius: 30, marginTop: 30, width: '80%', alignItems: 'center' },
  dashboardBtnTxt: { color: 'rgb(15, 59, 53)', fontWeight: 'bold', fontSize: 16 }
});

export default TeacherEvalutionQuestions;