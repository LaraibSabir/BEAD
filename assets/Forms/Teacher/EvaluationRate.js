import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; 
import APIEndPoint from "../APIEndPoint";

const EvaluationRate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { TeacherID } = route.params || {};

  const [teacherData, setTeacherData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [studentScore, setStudentScore] = useState(0);
  const [peerScore, setPeerScore] = useState(0); // Ismein peer ka result store hoga
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const profRes = await fetch(`${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${TeacherID}`);
      const profJson = await profRes.json();
      setTeacherData(profJson);

      const sessionRes = await fetch(`${APIEndPoint}/Director/GetAllSessions`);
      const sessionJson = await sessionRes.json();
      setSessions(sessionJson);
      
      if (sessionJson.length > 0) {
        setSelectedSession(sessionJson[0]);
        fetchScores(sessionJson[0]);
      }
    } catch (error) {
      console.error("Initial Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScores = async (session) => {
    try {
      // Backend Fix: SOS2021F -> 2021F
      const apiSessionParam = session.startsWith("SOS") ? session.replace("SOS", "") : session;
      
      // --- 1. Student Feedback API Call ---
      const stdRes = await fetch(`${APIEndPoint}/Director/GetTeacherAverageRatings?session=${apiSessionParam}`);
      const stdList = await stdRes.json();

      const stdMatch = stdList.find(t => 
        String(t.TeacherID).toLowerCase().includes(String(TeacherID).toLowerCase())
      );

      if (stdMatch) {
        const ratingNum = parseFloat(stdMatch.AverageRating);
        setStudentScore(Math.round((ratingNum / 5) * 100));
      } else {
        setStudentScore(0);
      }

      // --- 2. Peer Evaluation API Call (NEW) ---
      // Humne wahi apiSessionParam bhejni hai jo year filter handle kare
      const peerRes = await fetch(`${APIEndPoint}/Director/GetPeerAverageRatings?session=${apiSessionParam}`);
      const peerList = await peerRes.json();

      const peerMatch = peerList.find(t => 
        String(t.TeacherID).toLowerCase().includes(String(TeacherID).toLowerCase())
      );

      if (peerMatch) {
        // Marks average table se milenge (Assuming scale 5 hai to % banayenge)
        const peerRatingNum = parseFloat(peerMatch.AverageRating);
        setPeerScore(Math.round((peerRatingNum / 5) * 100));
      } else {
        setPeerScore(0);
      }

    } catch (error) {
      console.error("Score fetch error:", error);
    }
  };

  if (loading && !teacherData) {
    return (
      <View style={ss.loaderContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ss.main} showsVerticalScrollIndicator={false}>
      <View style={ss.logoContainer}>
        <Image source={require("../../Images/Biit_Logo.png")} style={ss.logo} />
      </View>

      <View style={ss.profileCard}>
        <View style={ss.profileInfo}>
          <Text style={ss.pText}>Name: <Text style={ss.bold}>{teacherData?.Name || "N/A"}</Text></Text>
          <Text style={ss.pText}>Designation: <Text style={ss.bold}>{teacherData?.Designation || "Faculty"}</Text></Text>
          <Text style={ss.pSubText}>BIIT Academic Staff</Text>
        </View>
        <Image source={profileImage} style={ss.avatar} />
      </View>

      <View style={ss.dropdownCard}>
        <Text style={ss.dropdownLabel}>Select Session:</Text>
        <View style={ss.pickerWrapper}>
          <Picker
            selectedValue={selectedSession}
            onValueChange={(val) => {
              setSelectedSession(val);
              fetchScores(val);
            }}
            dropdownIconColor="#000"
            mode="dropdown"
            style={ss.picker}
          >
            {sessions.map((s, index) => (
              <Picker.Item key={index} label={s} value={s} color="#d1c6c6" />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={ss.sectionTitle}>EVALUATION SUMMARY</Text>

      <View style={ss.analyticsCard}>
        <View style={ss.statsRow}>
          {/* Student Circle */}
          <View style={ss.circleWrapper}>
            <View style={[ss.progressCircle, { borderColor: '#00c853' }]}>
              <Text style={ss.percentText}>{studentScore}%</Text>
            </View>
            <Text style={ss.circleLabel}>STUDENT FEEDBACK</Text>
          </View>

          {/* Peer Circle - Now dynamically updated! */}
          <View style={ss.circleWrapper}>
            <View style={[ss.progressCircle, { borderColor: '#2196F3' }]}>
              <Text style={ss.percentText}>{peerScore}%</Text>
            </View>
            <Text style={ss.circleLabel}>PEER EVALUATION</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={ss.backBtn} onPress={() => navigation.goBack()}>
        <Text style={ss.backBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: { flexGrow: 1, backgroundColor: "#0d2e27", alignItems: "center", padding: 20 },
  loaderContainer: { flex: 1, backgroundColor: "#0d2e27", justifyContent: 'center' },
  logoContainer: { marginVertical: 15, backgroundColor: '#fff', borderRadius: 50, padding: 10 },
  logo: { width: 70, height: 70, resizeMode: 'contain' },
  profileCard: { backgroundColor: "#fff", width: "100%", borderRadius: 20, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  profileInfo: { flex: 1 },
  pText: { fontSize: 16, color: "#333", marginBottom: 5 },
  bold: { fontWeight: "bold" },
  pSubText: { color: "#28a745", fontSize: 12, fontWeight: '600' },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  dropdownCard: { width: '100%', backgroundColor: '#1a4a3e', padding: 15, borderRadius: 15, marginBottom: 20 },
  dropdownLabel: { color: '#fff', fontSize: 13, marginBottom: 8, fontWeight: '600' },
  pickerWrapper: { backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', height: 50, justifyContent: 'center' },
  picker: { width: '100%', color: '#000' },
  sectionTitle: { color: "#28a745", fontSize: 15, fontWeight: "bold", marginBottom: 15, letterSpacing: 1 },
  analyticsCard: { backgroundColor: "#fff", width: "100%", borderRadius: 25, paddingVertical: 35, marginBottom: 25 },
  statsRow: { flexDirection: "row", justifyContent: "space-evenly" },
  circleWrapper: { alignItems: "center" },
  progressCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 8, justifyContent: "center", alignItems: "center", backgroundColor: "#fafafa", marginBottom: 12 },
  percentText: { fontSize: 18, fontWeight: "bold", color: "#222" },
  circleLabel: { fontSize: 11, fontWeight: "bold", color: "#666" },
  backBtn: { backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 60, borderRadius: 30, marginTop: 10, marginBottom: 20 },
  backBtnText: { color: "#0d2e27", fontSize: 16, fontWeight: "bold" },
});

export default EvaluationRate;