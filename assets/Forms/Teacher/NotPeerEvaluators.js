import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, 
  ScrollView, ActivityIndicator, Alert 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import APIEndPoint from "../APIEndPoint";

const NotPeerEvaluators = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { TeacherID } = route.params || {};

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
    if (TeacherID) {
      fetchTeacherProfile();
    } else {
      setLoading(false);
      Alert.alert("Error", "No Teacher ID found. Please login again.");
    }
  }, [TeacherID]);

  const fetchTeacherProfile = async () => {
    const url = `${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${TeacherID}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setTeacherData(data);
      } else {
        Alert.alert("Error", data.Message || "Profile not found");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Cannot reach server. Check your IP/Connection.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Alert.alert("Logout", "Are You Sure You Want to Logout?", [
      { text: "cancel", style: "cancel" },
      { text: "Yes", onPress: () => navigation.reset({ index: 0, routes: [{ name: "Login" }] }) },
    ]);
  };

  // Helper to render consistent dashboard items
  const DashboardItem = ({ label, title, buttonText, onPress }) => (
    <View style={ss.card}>
      <View style={ss.cardContent}>
        <Text style={ss.itemLabel}>{label}</Text>
        <Text style={ss.itemTitle}>{title}</Text>
      </View>
      <TouchableOpacity style={ss.actionBtn} onPress={onPress}>
        <Text style={ss.actionBtnText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[ss.main, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ss.main}>
      {/* Top Logo Container */}
      <View style={ss.logoContainer}>
        <Image style={ss.logo} source={require("../../Images/Biit_Logo.png")} />
      </View>

      {/* Profile Card */}
      <View style={ss.profileCard}>
        <View style={ss.profileInfo}>
          <Text style={ss.itemLabel}>Teacher Information</Text>
          <Text style={ss.pText}>Name: <Text style={ss.bold}>{teacherData?.Name || "N/A"}</Text></Text>
          <Text style={ss.pText}>Designation: <Text style={ss.bold}>{teacherData?.Designation || "N/A"}</Text></Text>
          <Text style={ss.pSubText}>BIIT Academic Staff</Text>
        </View>
        <Image style={ss.avatar} source={profileImage} />
      </View>

      <Text style={ss.dashboardTitle}>FACULTY DASHBOARD</Text>

      {/* Action Cards */}
      <DashboardItem 
        label="COURSE HISTORY" 
        title="View CHR" 
        buttonText="View" 
        onPress={() => navigation.navigate("CHR", { TeacherID })}
      />

      <DashboardItem 
        label="RECORDS" 
        title="View Attendance" 
        buttonText="Check" 
        onPress={() => navigation.navigate("Attendance", { TeacherID })}
      />

      <DashboardItem 
        label="PERFORMANCE" 
        title="View Evaluation" 
        buttonText="Rates" 
        onPress={() => navigation.navigate("EvaluationRates", { TeacherID })}
      />

      {/* Logout Button */}
      <TouchableOpacity style={ss.logoutBtn} onPress={logout}>
        <Text style={ss.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: {
    flexGrow: 1,
    backgroundColor: "#0d2e27", // Aapka specific dark green
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 10,
  },
  logo: {
    width: 90,
    height: 100,
    resizeMode: 'contain',
  },
  profileCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  profileInfo: {
    flex: 1,
  },
  pText: {
    fontSize: 15,
    color: "#333",
    marginTop: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  pSubText: {
    color: "#28a745",
    fontWeight: "600",
    marginTop: 5,
    fontSize: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
  },
  dashboardTitle: {
    color: "#28a745",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  actionBtn: {
    backgroundColor: "#00c853",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotPeerEvaluators;