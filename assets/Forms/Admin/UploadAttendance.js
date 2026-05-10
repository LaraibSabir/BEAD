import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, 
  ScrollView, Alert, ActivityIndicator 
} from "react-native";
// Updated Import
import { pick, types, isCancel } from '@react-native-documents/picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import APIEndPoint from "../APIEndPoint";

const UploadAttendance = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { TeacherID } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (TeacherID) {
      fetchAdminProfile();
    }
  }, [TeacherID]);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch(`${APIEndPoint}/Teacher/GetTeacherProfile?TeacherID=${TeacherID}`);
      const data = await response.json();
      if (response.ok) {
        setAdminData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const pickFile = async () => {
    try {
      // Updated pick logic
      const res = await pick({
        type: [types.xls, types.xlsx],
      });
      setSelectedFile(res[0]);
    } catch (err) {
      if (!isCancel(err)) {
        Alert.alert("Selection Error", err.message);
      }
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      Alert.alert("Selection Required", "Please select the updated attendance Excel file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    });

    try {
      const response = await fetch(`${APIEndPoint}/Admin/SaveAttendance`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.ok) {
        Alert.alert("Success", "Attendance records saved successfully!");
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        Alert.alert("Upload Failed", errorData.Message || "Data mismatch in Excel.");
      }
    } catch (error) {
      Alert.alert("Error", "Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={ss.main}>
      <Image style={ss.logo} source={require("../../Images/Biit_Logo.png")} />
      <View style={ss.profileContainer}>
        {profileLoading ? (
          <ActivityIndicator color="#28a745" />
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={ss.itemLabel}>Admin Information</Text>
                                  <Text style={ss.pText}>Name: <Text style={ss.bold}>{adminData?.Name || "N/A"}</Text></Text>
                                  <Text style={ss.pText}>Designation: <Text style={ss.bold}>{adminData?.Designation || "N/A"}</Text></Text>
                                  <Text style={ss.pSubText}>BIIT Administration Staff</Text>
          </View>
        )}
        <Image style={ss.avatar} source={require("../../Images/male.png")} />
      </View>

      <View style={ss.uploadBox}>
        <Text style={ss.sectionTitle}>BULK ATTENDANCE UPLOAD</Text>
        <TouchableOpacity style={ss.pickBtn} onPress={pickFile}>
          <Text style={ss.btnText}>
            {selectedFile ? `📄 ${selectedFile.name}` : "📁 Select attendance.xlsx"}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color="#28a745" size="large" style={{ marginVertical: 20 }} />
        ) : (
          <TouchableOpacity 
            style={[ss.actionBtn, !selectedFile && { opacity: 0.5 }]} 
            onPress={uploadFile}
            disabled={!selectedFile}
          >
            <Text style={ss.btnText}>➕ Save Records to SQL</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={ss.backBtn} onPress={() => navigation.goBack()}>
          <Text style={ss.btnTexts}>⬅️ Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: { flexGrow: 1, backgroundColor: "#0f3b35", alignItems: "center", padding: 20 },
  logo: { width: 80, height: 80, resizeMode: 'contain', marginVertical: 20 },
  profileContainer: { flexDirection: 'row', backgroundColor: '#fff', width: '100%', padding: 20, borderRadius: 15, justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  adminTitle: { fontSize: 11, fontWeight: 'bold', color: '#28a745', textTransform: 'uppercase', marginBottom: 5 },
  infoText: { fontSize: 14, color: '#333' },
  bold: { fontWeight: "bold" },
  avatar: { width: 55, height: 55, borderRadius: 27.5 },
  uploadBox: { width: '100%', alignItems: 'center' },
   itemLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
    textTransform: 'uppercase',
    marginBottom: 2,
    textAlign:'center'
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
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  pickBtn: { backgroundColor: 'rgba(255,255,255,0.1)', width: '100%', padding: 25, borderRadius: 12, borderWidth: 1.5, borderColor: '#28a745', borderStyle: 'dashed', alignItems: 'center', marginBottom: 20 },
  actionBtn: { backgroundColor: "#28a745", width: '100%', padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  backBtn: { backgroundColor: "#f1e9e9", width: '100%', padding: 16, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  btnTexts: { color: "#0f0f0f", fontSize: 16, fontWeight: "bold" },

});

export default UploadAttendance;