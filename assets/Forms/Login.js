import React, { useState } from "react";
import { View, Text, TextInput, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import APIEndPoint from "./APIEndPoint";

const Login = () => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigation();

  const login = async () => {
    if (!user || !pass) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      const resp = await fetch(`${APIEndPoint}/User/LoginUser?user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`);
      const d = await resp.json();
      if (resp.status === 200) {
        Alert.alert("Success", d.message);

        const userType = d.userType || d.user_type; 
        const sem = parseInt(d.semester, 10);
        const userid=d.userId || d.User_id;
        if (userType.toLowerCase() === "student") {
          if (sem >= 1 && sem <= 6) {
            nav.replace("StudentDashboard", { AridNo: user });
          } else if (sem >= 7 && sem <= 8) {
            nav.replace("LastSemStudentDashboard", { AridNo: user });
          } else {
            Alert.alert("Error", "Invalid semester. Enter 1-8.");
          }
        } else if (userType.toLowerCase() === "teacher") {
          if (user === "BIIT156") {
            nav.replace("DirectorStack", { screen: "DirectorDashboard", params: { TeacherID: user } });
          } 
          else if (d.designation === "Lecturer") {
            nav.replace("NotPeerEvaluators", { TeacherID: user });
          } 
          else if (d.designation === "Associate Professor") {
            nav.replace("TeacherDashboard_HOD", { TeacherID: user });
          } 
          else if (d.designation === "Assistant Professor") {
            nav.replace("PeerEvalutors", { TeacherID: user });
          } 
          else {
            nav.replace("NotPeerEvaluators", { TeacherID: user });
          }
        }
                else {
          Alert.alert("Error", "Unknown user type");
        }
      } else if (resp.status === 401) {
        Alert.alert("Login Failed", "Invalid username or password");
      } else {
        Alert.alert("Error", d.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Fetch error:", error);
      Alert.alert("Error", "Unable to connect to server. Check your network.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={ss.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={ss.mView}>
        <Image
          style={ss.bimg}
          source={require("../../assets/Images/Biit_Logo.png")}/>
        <Text style={ss.t}>BIIT</Text>
        <Text style={ss.st}>TEACHER EVALUATION SYSTEM</Text>

        <TextInput
          style={ss.input}
          placeholder="User ID"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"/>

        <TextInput
          style={ss.input}
          placeholder="Password"
          secureTextEntry
          value={pass}
          onChangeText={setPass}/>

        <Button mode="contained" style={ss.btn} onPress={login}>
          Login
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const ss = StyleSheet.create({
  container: {
    flex: 1,
  },
  mView: {
    flex: 1,
    backgroundColor: "rgb(15, 59, 53)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  bimg: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  t: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  st: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 25,
    marginVertical: 8,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#8b8282",
    width: 140,
    borderRadius: 25,
    marginTop: 25,
  },
});

export default Login;
