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

const API_BASE_URL = "http://192.168.1.8/FYP2";

const EvaluationRate = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 1. Get TeacherID from navigation params
  const { TeacherID } = route.params || {};

  const [teacherData, setTeacherData] = useState(null);
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (TeacherID) {
      fetchEvaluationData();
    } else {
      setLoading(false);
      Alert.alert("Error", "Teacher ID missing.");
    }
  }, [TeacherID]);

  const fetchEvaluationData = async () => {
    try {
      const [profileRes, evalRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/Teacher/GetTeacherProfile?TeacherID=${TeacherID}`),
        fetch(`${API_BASE_URL}/api/Teacher/GetEvaluationSummary?TeacherID=${TeacherID}`)
      ]);

      const profileJson = await profileRes.json();
      const evalJson = await evalRes.json();

      if (profileRes.ok) setTeacherData(profileJson);
      if (evalRes.ok) setEvalData(evalJson);

    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not fetch evaluation details.");
    } finally {
      setLoading(false);
    }
  };

  const renderCircle = (label, percent) => (
    <View style={ss.circleContainer}>
      <Text style={ss.circleLabel}>{label}</Text>
      <View style={ss.circle}>
        <Text style={ss.circleText}>{percent || "0"}%</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[ss.main, { justifyContent: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ss.main} showsVerticalScrollIndicator={false}>
      <Image
        source={require("../../Images/Biit_Logo.png")}
        style={ss.logo}
      />

      {/* Teacher Information Card */}
      <View style={ss.card}>
        <Text style={ss.title}>Teacher Information</Text>
        <View style={ss.row}>
          <View>
            <Text style={ss.txt}>Name: <Text style={{fontWeight:'bold'}}>{teacherData?.Name || "N/A"}</Text></Text>
            <Text style={ss.txt}>Designation: <Text style={{fontWeight:'bold'}}>{teacherData?.Designation || "N/A"}</Text></Text>
          </View>
          <Image
            source={require("../../Images/avatar.png")}
            style={ss.avatar}
          />
        </View>
      </View>

      {/* Evaluation Summary Card */}
      <View style={ss.evalCard}>
        <Text style={ss.evalTitle}>Evaluation Summary</Text>

        <View style={ss.evalRow}>
          {renderCircle("By Students", evalData?.StudentScore)}
          {renderCircle("By Admin", evalData?.AdminScore)}
          {renderCircle("By Peers", evalData?.PeerScore)}
        </View>

        <View style={ss.ratingRow}>
          <Text style={ss.rating}>{evalData?.StudentRating || "N/A"}</Text>
          <Text style={ss.rating}>{evalData?.AdminRating || "N/A"}</Text>
          <Text style={ss.rating}>{evalData?.PeerRating || "N/A"}</Text>
        </View>
      </View>

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={ss.homeBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={ss.homeText}>🏠 Back to Dashboard</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default EvaluationRate;

const ss = StyleSheet.create({
  main: {
    backgroundColor: "#0f3b35",
    alignItems: "center",
    padding: 20,
    flexGrow: 1,
  },
  logo: {
    width: 80,
    height: 90,
    resizeMode: "contain",
    marginBottom: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    color: "#0f3b35",
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txt: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#0f3b35",
  },
  evalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  evalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  evalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circleContainer: {
    alignItems: "center",
    width: "30%",
  },
  circleLabel: {
    color: "#fff",
    fontSize: 11,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  circle: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: 5,
    borderColor: "#9fe0c3",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f3b35",
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  rating: {
    color: "#c8f5dd",
    fontSize: 12,
    width: "30%",
    textAlign: "center",
    fontWeight: 'bold',
  },
  homeBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
  },
  homeText: {
    fontWeight: "bold",
    color: "#0f3b35",
    fontSize: 16,
  },
});