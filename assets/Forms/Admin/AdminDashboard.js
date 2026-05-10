import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, 
  ScrollView, ActivityIndicator, Alert 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import APIEndPoint from "../APIEndPoint";

const AdminDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Using TeacherID from route params exactly like the other file
  const { TeacherID } = route.params || {};

  useEffect(() => {
    if (TeacherID) {
      fetchAdminProfile();
    } else {
      setLoading(false);
      Alert.alert("Error", "No ID found. Please login again.");
    }
  }, [TeacherID]);

  const fetchAdminProfile = async () => {
    // Calling the same endpoint structure as NotPeerEvaluators
    const url = `${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${TeacherID}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setAdminData(data);
      } else {
        Alert.alert("Error", data.Message || "Profile not found");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Cannot reach server. Check your connection.");
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
      <View style={ss.logoContainer}>
        <Image style={ss.logo} source={require("../../Images/Biit_Logo.png")} />
      </View>

      {/* Profile Card matched to your template */}
      <View style={ss.profileCard}>
        <View style={ss.profileInfo}>
          <Text style={ss.itemLabels}>Admin Information</Text>
          <Text style={ss.pText}>Name: <Text style={ss.bold}>{adminData?.Name || "N/A"}</Text></Text>
          <Text style={ss.pText}>Designation: <Text style={ss.bold}>{adminData?.Designation || "N/A"}</Text></Text>
          <Text style={ss.pSubText}>BIIT Administration Staff</Text>
        </View>
        <Image style={ss.avatar} source={require("../../Images/male.png")} />
      </View>

      <Text style={ss.dashboardTitle}>ADMIN DASHBOARD</Text>

      {/* Upload Attendance Button */}
      <DashboardItem 
        label="RECORDS" 
        title="Upload Attendance" 
        buttonText="Upload" 
        onPress={() => navigation.navigate("UploadAttendance", { TeacherID })}
      />

      {/* Upload CHR Button */}
      <DashboardItem 
        label="COURSE HISTORY" 
        title="Upload CHR" 
        buttonText="Upload" 
        onPress={() => navigation.navigate("UploadCHR", { TeacherID })}
      />

      <TouchableOpacity style={ss.logoutBtn} onPress={logout}>
        <Text style={ss.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: {
    flexGrow: 1,
    backgroundColor: "#0d2e27", 
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
    fontWeight: "bold",
    textTransform: 'uppercase',
    marginBottom: 2,
    
  },
  itemLabels: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
    textTransform: 'uppercase',
    marginBottom: 2,
    textAlign:'center'
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

export default AdminDashboard;