import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, 
  ScrollView, ActivityIndicator, Alert 
} from "react-native";
import { Button } from "react-native-paper";

import APIEndPoint from "../APIEndPoint";

const PeerEvalutors = ({ route, navigation }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // This grabs the 'TeacherID' passed from Login.js
  const { TeacherID } = route.params || {}; 

  useEffect(() => {
    if (TeacherID) {
      fetchTeacherProfile();
    } else {
      setLoading(false);
      Alert.alert("Error", "No Teacher ID found. Please login again.");
    }
  }, [TeacherID]);

  const fetchTeacherProfile = async () => {
    // Ensure APIEndPoint is a string
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
      // Fixed: changed API_BASE_URL to APIEndPoint to prevent crash
      Alert.alert("Network Error", "Cannot reach server at " + APIEndPoint);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Alert.alert(
      "Logout", 
      "Are You Sure You Want to Logout?", 
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            // Note: Ensure "Login" matches the name in your Stack.Navigator
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={[ss.main, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ss.main}>
      <Image style={ss.logo} source={require("../../Images/Biit_Logo.png")} />

      <View style={ss.mView}>
        <Text style={ss.mtxtHeader}>Teacher Information</Text>
        <View style={ss.row}>
          <View style={ss.infoContainer}>
            <Text style={ss.txt}>
              <Text style={ss.label}>Name: </Text>
              {teacherData?.Name || "N/A"}
            </Text>
            <Text style={ss.txt}>
              <Text style={ss.label}>Designation: </Text>
              {teacherData?.Designation || "N/A"}
            </Text>
          </View>
          <Image style={ss.avatar} source={require("../../Images/avatar.png")} />
        </View>
      </View>

      <View style={ss.HView}>
        <Text style={ss.Ftxt}>Faculty Dashboard</Text>
      </View>

      <View style={ss.BView}>
        <Button 
          mode="contained" 
          style={ss.btn} 
          labelStyle={ss.btnLabel} 
          onPress={() => navigation.navigate("CHR", { TeacherID })}
        >
          View CHR
        </Button>

        <Button 
          mode="contained" 
          style={ss.btn} 
          labelStyle={ss.btnLabel} 
          onPress={() => navigation.navigate("Attendance", { TeacherID })}
        >
          View Attendance
        </Button>

        <Button 
          mode="contained" 
          style={ss.btn} 
          labelStyle={ss.btnLabel} 
          onPress={() => navigation.navigate("EvaluationRates", { TeacherID })}
        >
          View Evaluation
        </Button>

        {/* <Button 
          mode="contained" 
          style={ss.btn} 
          labelStyle={ss.btnLabel} 
          onPress={() => navigation.navigate("PeerAssignment", { TeacherID })}
        >
          Peer Evaluation
        </Button> */}

        {/* <Button 
          mode="contained" 
          style={ss.btn} 
          labelStyle={ss.btnLabel} 
          onPress={() => navigation.navigate("CustomForm", { TeacherID })}
        >
          Custom Evaluation Form
        </Button> */}
         <Button 
                          mode="contained" 
                          style={ss.btn} 
                          labelStyle={ss.btnLabel} 
                          onPress={() => navigation.navigate("EvaluateTeachers", { TeacherID })}
                        >
                          Evaluate Teachers
                        </Button>
      </View>

      <Button 
        mode="contained" 
        style={ss.lgbtn} 
        labelStyle={ss.lgbtnLabel} 
        onPress={logout}
      >
        ↗️ Logout
      </Button>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: { 
    backgroundColor: "#0f3b35", 
    alignItems: "center", 
    padding: 20, 
    flexGrow: 1,
    paddingBottom: 50 // Added extra padding for scroll room
  },
  logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 10 },
  mView: { width: "100%", backgroundColor: "#fff", borderRadius: 10, padding: 20, marginBottom: 20 },
  mtxtHeader: { fontSize: 18, fontWeight: "bold", color: "#0f3b35", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoContainer: { flex: 1 },
  label: { fontWeight: "bold", color: "#0f3b35" },
  txt: { fontSize: 15, color: "#333", marginBottom: 5 },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  HView: { marginBottom: 15 },
  Ftxt: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  BView: { width: "100%", alignItems: "center" },
  btn: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    marginBottom: 12,
    height: 50,
    width: '90%',
    justifyContent: 'center',
  },
  btnLabel: {
    color: "#0f3b35",
    fontSize: 16,
    fontWeight: "bold",
  },
  lgbtn: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    width: '60%',
    marginTop: 20,
    marginBottom: 30,
  },
  lgbtnLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
});

export default PeerEvalutors;