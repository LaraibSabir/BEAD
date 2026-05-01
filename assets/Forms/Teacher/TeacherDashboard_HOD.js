import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, StyleSheet, ScrollView, Alert, ActivityIndicator 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "react-native-paper";

import APIEndPoint from "../APIEndPoint";


const TeacherDashboard_HOD = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Getting TeacherID from navigation params (passed from Login)
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
      Alert.alert("Network Error", "Cannot reach server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Alert.alert("Logout", "Are You Sure You Want to Logout?", [
      { text: "cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[ss.mView, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ss.mView}>
      {/* Logo Section */}
      <View style={ss.h}>
        <Image source={require("../../Images/Biit_Logo.png")} style={ss.bimg} />
      </View>

      {/* Teacher Info Card */}
      <View style={ss.vc}>
        <View style={{ flex: 1 }}>
          <Text style={ss.mtxt}>Teacher Information</Text>
          <Text style={ss.txt}>
            <Text style={{ fontWeight: 'bold' }}>Name: </Text>
            {teacherData?.Name || "Dr Munir Ahmed"}
          </Text>
          <Text style={ss.txt}>
            <Text style={{ fontWeight: 'bold' }}>Designation: </Text>
            {teacherData?.Designation || "HOD"}
          </Text>
        </View>
        <Image source={require("../../Images/avatar.png")} style={ss.avatar} />
      </View>

      <Text style={ss.dt}>Faculty Dashboard</Text>
      
      {/* Dashboard Action Buttons */}
      <View style={ss.btng}>
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

        <Button 
          mode="contained" 
          style={ss.btn} 
          labelStyle={ss.btnLabel} 
          onPress={() => navigation.navigate("EvaluateTeachers", { TeacherID })}
        >
         Evaluate Teachers
        </Button>

        <Button 
          mode="contained" 
          style={ss.btn} 
          labelStyle={ss.btnLabel} 
          onPress={() => navigation.navigate("PeerAssignment", { TeacherID })}
        >
          Assign Peer
        </Button>
         {/* <Button 
                  mode="contained" 
                  style={ss.btn} 
                  labelStyle={ss.btnLabel} 
                  onPress={() => navigation.navigate("CustomForm", { TeacherID })}
                >
                  Custom Evaluation Form
                </Button> */}
              
      </View>

      {/* Logout Button */}
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
  mView: {
    flexGrow: 1,
    backgroundColor: "rgb(15, 59, 53)",
    padding: 20,
    alignItems: "center",
  },
  h: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  bimg: {
    width: 100,
    height: 110,
    resizeMode: "contain",
  },
  mtxt: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(15, 59, 53)",
    marginBottom: 10,
  },
  vc: {
    width: "100%",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  txt: {
    fontSize: 15,
    marginBottom: 5,
    color: "rgb(51, 51, 51)",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  dt: {
    color: "rgb(255, 255, 255)",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  btng: {
    width: "100%",
    marginBottom: 30,
  },
  btn: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 25,
    marginBottom: 12,
    height: 50,
    justifyContent: 'center',
  },
  btnLabel: {
    color: "rgb(15, 59, 53)",
    fontSize: 16,
    fontWeight: "bold",
  },
  lgbtn: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 25,
    width: '60%',
    marginBottom: 30,
  },
  lgbtnLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgb(0, 0, 0)",
  },
});

export default TeacherDashboard_HOD;