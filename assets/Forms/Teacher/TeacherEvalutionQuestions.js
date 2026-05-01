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

  const ratingMap = {
    "Excellent": 5,
    "Good": 4,
    "Satisfactory": 3,
    "Below Average": 2,
    "Poor": 1
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ================= PROFILE =================
        if (formattedID) {
          const profileUrl = `${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${encodeURIComponent(formattedID)}`;
          const profileResp = await fetch(profileUrl);

          if (profileResp.ok) {
            const profileData = await profileResp.json();
            setProfile(profileData);
          }
        }

        // ================= QUESTIONS =================
        const qResp = await fetch(`${APIEndPoint}/Student/GetQuestions`);

        if (qResp.ok) {
          const qData = await qResp.json();

          console.log("FULL QUESTIONS DATA:", qData);

          let targetType = "";

          const cleanDesignation = Designation ? Designation.trim().toLowerCase() : "";
          const qtypeLower = Qtype ? Qtype.toLowerCase() : "";

          console.log("Designation:", cleanDesignation);
          console.log("Qtype:", qtypeLower);

          // 🔥 FIXED LOGIC
          if (qtypeLower.includes("peer")) {
            if (
              cleanDesignation.includes("junior") ||
              cleanDesignation.includes("jr")
            ) {
              targetType = "PTJ"; // Peer Teacher Junior
            } else {
              targetType = "PTS"; // Peer Teacher Senior
            }
          } else {
            targetType = "C"; // Common
          }

          console.log("Final Filter Type:", targetType);

          const filtered = qData.filter(q => q.RawType === targetType);

          console.log("Filtered Questions:", filtered);

          // ⚠️ FALLBACK (agar empty aaye)
          if (filtered.length === 0) {
            console.warn("No questions found for type:", targetType);
            Alert.alert("Warning", "No specific questions found, loading default.");
            setQuestions(qData); // fallback all
          } else {
            setQuestions(filtered);
          }
        }

      } catch (error) {
        console.error("ERROR:", error);
        Alert.alert("Error", "Check server connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formattedID, Qtype, Designation]);

  // ================= SELECT OPTION =================
  const handleSelectOption = (opt) => {
    const currentQId = questions[count - 1]?.Question_Id;

    if (!currentQId) return;

    setSelectedRatings({
      ...selectedRatings,
      [currentQId]: ratingMap[opt]
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (Object.keys(selectedRatings).length < questions.length) {
        Alert.alert("Alert", "Please answer all questions.");
        return;
    }

    // Payload keys ko Backend ki 'PeerEvaluationRequest' class se match hona chahiye
    const payload = {
        Evaluator_Emp_no: formattedID, // Backend expects Evaluator_Emp_no
        Target_Emp_no: TargetID,       // Backend expects Target_Emp_no
        Suggestion: suggestion,
        Answers: Object.entries(selectedRatings).map(([id, rating]) => ({
            Question_ID: parseInt(id),
            Rating: rating
        }))
    };

    try {
        setLoading(true); // Loading start karein
        const response = await fetch(`${APIEndPoint}/Evaluation/SubmitPeer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            Alert.alert("Success", "Evaluation submitted Successfully..!");
            nav.goBack();
        } else {
            Alert.alert("Error", result.message || "Failed to save data.");
        }
    } catch (error) {
        console.error("Submit Error:", error);
        Alert.alert("Error", "Network error or Server down.");
    } finally {
        setLoading(false);
    }
};

  // ================= LOADING =================
  if (loading) {
    return (
      <View style={ss.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // ================= UI =================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgb(15, 59, 53)" }}>
      <ScrollView contentContainerStyle={ss.main}>

        <Image style={ss.bimg} source={require("../../Images/Biit_Logo.png")} />

        {/* PROFILE */}
        {profile && (
          <View style={ss.mView}>
            <Text style={ss.mTxt}>Evaluator Profile</Text>

            <View style={ss.row}>
              <View style={{ flex: 1 }}>
                <Text style={ss.txt}><Text style={ss.bold}>Name:</Text> {profile.Name}</Text>
                <Text style={ss.txt}><Text style={ss.bold}>Dept:</Text> {profile.Designation}</Text>
              </View>

              <Image style={ss.avatar} source={require("../../Images/avatar.png")} />
            </View>
          </View>
        )}

        {/* TARGET */}
        <View style={ss.teacherCard}>
          <View style={ss.cardHeader}>
            <View style={ss.iconCircle}>
              <Text style={{ fontSize: 24 }}>👨‍🏫</Text>
            </View>

            <View style={ss.headerTextContainer}>
              <Text style={ss.teacherLabel}>Evaluating:</Text>
              <Text style={ss.teacherName}>{TargetName}</Text>
              <Text style={ss.teacherLabel}>{Designation}</Text>
            </View>
          </View>
        </View>

        {/* QUESTIONS */}
        {questions.length > 0 ? (
          <>
            <Text style={ss.count}>
              Question {count} of {questions.length}
            </Text>
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
            <View style={ss.QView}>
              <Text style={ss.Qtext}>
                {questions[count - 1]?.Question1}
              </Text>

              {Object.keys(ratingMap).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={ss.radioRow}
                  onPress={() => handleSelectOption(opt)}
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
                  placeholder="Any suggestions? (Optional)"
                  value={suggestion}
                  onChangeText={setSuggestion}
                  multiline
                />
              )}

                            <View style={ss.btnContainer}>
                {count > 1 && (
                  <TouchableOpacity
                    style={ss.Btn}
                    onPress={() => setCount(count - 1)}
                  >
                    <Text style={ss.btnTxt}>Back</Text>
                  </TouchableOpacity>
                )}

                <View style={{ flex: 1, alignItems: "center" }}>
                  {count < questions.length ? (
                    <TouchableOpacity
                      style={ss.Btn}
                      onPress={() => {
                        const currentQId = questions[count - 1]?.Question_Id;

                        if (selectedRatings[currentQId]) {
                          setCount(count + 1);
                        } else {
                          Alert.alert("Select an option");
                        }
                      }}
                    >
                      <Text style={ss.btnTxt}>Next</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[ss.Btn, { backgroundColor: "#063109" }]}
                      onPress={handleSubmit}
                    >
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Submit Feedback
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </>
        ) : (
          <Text style={{ color: "white" }}>
            No questions found for this category.
          </Text>
        )}

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={ss.logoutBtn}
          onPress={() => nav.goBack()}
        >
          <Text style={ss.logoutTxt}>⬅️ Back</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// ================= STYLES =================
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

  teacherCard: { width: "100%", backgroundColor: "rgba(255,255,255,0.15)", padding: 15, borderRadius: 15 },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginRight: 12 },
  teacherName: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  teacherLabel:{
color: "#fff"
  },
  count: { color: "white", marginVertical: 10 },

  QView: { width: "100%", backgroundColor: "white", borderRadius: 20, padding: 20 },
  Qtext: { fontSize: 16, textAlign: "center", fontWeight: "700", marginBottom: 20 },

  radioRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "black" },

 btnContainer: {
  flexDirection: "row",
  marginTop: 20,
  justifyContent: "center",
  width: "100%"
},
  Btn: { padding: 10, borderWidth: 1, marginHorizontal: 5 ,alignItems:"center"},
  btnTxt: { color: "rgb(14, 59, 45)", fontWeight: "bold" },
  input: { width: "100%", backgroundColor: "#f9f9f9", padding: 10, marginTop: 10 },

  logoutBtn: { backgroundColor: "#fff", padding: 10, marginTop: 10 },
  logoutTxt: { fontWeight: "bold" },
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

export default TeacherEvalutionQuestions;