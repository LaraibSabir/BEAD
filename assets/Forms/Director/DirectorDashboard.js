import React from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const DirectorDashboard = ({ navigation }) => {
  const nav = useNavigation();

  const logout = () => {
    Alert.alert("Logout", "Are You Sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => nav.reset({ index: 0, routes: [{ name: "Login" }] }) },
    ]);
  };

  // Helper to render the menu rows seen in the image
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

  return (
    <ScrollView contentContainerStyle={ss.main}>
      {/* Top Logo */}
      <View style={ss.logoContainer}>
        <Image style={ss.logo} source={require("../../Images/Biit_Logo.png")} />
      </View>

      {/* Profile Card */}
      <View style={ss.profileCard}>
        <View style={ss.profileInfo}>
          <Text style={ss.pText}>Name: <Text style={ss.bold}>DR. MOHAMMAD JAMIL SAWAR</Text></Text>
          <Text style={ss.pText}>Role: <Text style={ss.bold}>Director</Text></Text>
          <Text style={ss.pSubText}>BIIT Administration</Text>
        </View>
        <Image style={ss.avatar} source={require("../../Images/male.png")} />
      </View>

      <Text style={ss.dashboardTitle}>DIRECTOR DASHBOARD</Text>

      {/* Menu Items */}
      <DashboardItem 
        label="ANALYTICS & FEEDBACK" 
        title="Teacher Performance" 
        buttonText="View" 
        onPress={() => navigation.navigate('RCEvaluation')}
      />
      
      <DashboardItem 
        label="EVALUATION SETUP" 
        title="Manage Questions" 
        buttonText="Manage" 
      />

      <DashboardItem 
        label="PARTICIPATION RATIO" 
        title="Gender Analytics" 
        buttonText="Analytics" 
      />

      <DashboardItem 
        label="ENCRYPTED RESULTS" 
        title="Confidential File Decryptor" 
        buttonText="Open" 
        onPress={() => navigation.navigate('ConfidentialDecryptor')}
      />

      {/* Logout Button */}
      <TouchableOpacity style={ss.logoutBtn} onPress={logout}>
        <Text style={ss.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DirectorDashboard;

const ss = StyleSheet.create({
  main: {
    flexGrow: 1,
    backgroundColor: "#0d2e27", // Dark green background from image
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 5
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  profileCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 25,
    padding: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  profileInfo: {
    flex: 1,
  },
  pText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  pSubText: {
    color: "#28a745", // Green subtext
    fontWeight: "600",
    marginTop: 5,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee'
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
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },
  actionBtn: {
    backgroundColor: "#00c853", // Vibrant green button
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "bold",
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