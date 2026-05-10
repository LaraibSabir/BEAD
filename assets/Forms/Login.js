import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import APIEndPoint from "./APIEndPoint";

const Login = () => {
  // 1. Hooks (Must always be in this order and at the top)
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const nav = useNavigation();

  // 2. Logic Functions
  const login = async () => {
    if (!user || !pass) {
      return Alert.alert("Error", "Please fill all fields");
    }
    try {
      const resp = await fetch(
        `${APIEndPoint}User/LoginUser?user=${encodeURIComponent(
          user
        )}&pass=${encodeURIComponent(pass)}`
      );

      const d = await resp.json();

      if (resp.status === 200) {
        Alert.alert("Success", d.message);

        const userType = d.userType || d.user_type;
        const sem = parseInt(d.semester, 10);

        if (userType.toLowerCase() === "student") {
          if (sem >= 1 && sem <= 6) {
            nav.replace("StudentDashboard", { AridNo: user });
          } else if (sem >= 7 && sem <= 8) {
            nav.replace("LastSemStudentDashboard", { AridNo: user });
          } else {
            Alert.alert("Error", "Invalid semester. Enter 1-8.");
          }
        } else if (userType.toLowerCase() === "teacher") {

  const evalValue = parseInt(d.eval, 10); // ✅ IMPORTANT

  if (user === "BIIT156" || user === "biit156" || user === "Biit156") {
    nav.replace("DirectorStack", {
      screen: "DirectorDashboard",
      params: { TeacherID: user },
    });
  }

  else if (evalValue === 1) {
    // ✅ NEW CONDITION ADDED HERE
    nav.replace("PeerEvalutors", { TeacherID: user });
  }
  else if(d.designation=== "Admin"){
    nav.replace("AdminDashboard", { TeacherID: user });
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
} else {
          Alert.alert("Error", "Unknown user type");
        }
      } else if (resp.status === 401) {
        Alert.alert("Login Failed", "Invalid username or password");
      } else {
        Alert.alert("Debug Error", JSON.stringify(d));
      }
    } catch (error) {
      console.log("Fetch error:", error);
      Alert.alert("Error", "Unable to connect to server. Check your network.");
    }
  };

  // 3. Render
  return (
    <KeyboardAvoidingView
      style={ss.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={ss.mView}>
        <Image
          style={ss.bimg}
          source={require("../../assets/Images/Biit_Logo.png")}
        />
        <Text style={ss.t}>BIIT</Text>
        <Text style={ss.st}>TEACHER EVALUATION SYSTEM</Text>

        {/* User Input */}
        <View style={ss.inputContainer}>
          <Icon name="person" size={22} color="#555" style={ss.icon} />
          <TextInput
            style={ss.inputField}
            placeholder="User ID"
            placeholderTextColor="gray"
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />
        </View>

        {/* Password Input with Eye Toggle */}
        <View style={ss.inputContainer}>
          <Icon name="lock" size={22} color="#555" style={ss.icon} />
          <TextInput
            style={ss.inputField}
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={!showPass}
            value={pass}
            onChangeText={setPass}
          />
          <TouchableOpacity 
            onPress={() => setShowPass(!showPass)}
            style={ss.eyeButton}
          >
            <Icon 
              name={showPass ? "visibility" : "visibility-off"} 
              size={22} 
              color="#555" 
            />
          </TouchableOpacity>
        </View>

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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3ecec",
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 15,
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "black",
  },
  eyeButton: {
    padding: 5,
  },
  btn: {
    backgroundColor: "#e9f3e9ac",
    width: 140,
    borderRadius: 25,
    marginTop: 25,
  },
});

export default Login;