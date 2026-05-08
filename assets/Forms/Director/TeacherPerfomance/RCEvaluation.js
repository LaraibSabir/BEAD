import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import APIEndPoint from "../../APIEndPoint";

const { height } = Dimensions.get('window');

const RCEvaluation = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Teachers");
  const [evalType, setEvalType] = useState("Student"); // "Student" or "Peer"
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedSession, evalType]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${APIEndPoint}/Director/GetAllSessions`);
      setSessions(response.data);
      if (response.data.length > 0) {
        setSelectedSession(response.data[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load sessions.");
    }
  };

  const fetchData = async () => {
    if (!selectedSession) return;
    setLoading(true);
    try {
      let endpoint = "";
      if (activeTab === "Teachers") {
        endpoint = `${APIEndPoint}/Director/GetAllocatedTeachers?session=${encodeURIComponent(selectedSession)}`;
      } else if (activeTab === "Courses") {
        endpoint = `${APIEndPoint}/Director/GetAllocatedCourses?session=${encodeURIComponent(selectedSession)}`;
      }

      const response = await axios.get(endpoint);
      let fetchedData = response.data;

      if (activeTab === "Teachers") {
        try {
          // Dynamic API selection based on evalType
          const ratingEndpoint = evalType === "Student" 
            ? `${APIEndPoint}/Director/GetTeacherAverageRatings` 
            : `${APIEndPoint}/Director/GetPeerAverageRatings`;

          const ratingRes = await axios.get(
            `${ratingEndpoint}?session=${encodeURIComponent(selectedSession)}`
          );
          const ratingsMap = ratingRes.data;

          fetchedData = fetchedData.map((teacher) => {
            const ratingObj = ratingsMap.find(
              (r) => String(r.TeacherID).trim().toUpperCase() === String(teacher.TeacherID).trim().toUpperCase()
            );
            return {
              ...teacher,
              AverageRating: ratingObj ? ratingObj.AverageRating.toFixed(1) : "N/A",
            };
          });
        } catch (e) {
          console.log(`${evalType} Ratings fetch failed.`);
        }
      }
      setDataList(fetchedData);
    } catch (error) {
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Logic for Compare Button Navigation
  const handleCompare = () => {
    navigation.navigate("CompareResults", {
      selectedIds: selectedItems,
      type: evalType, // Passing "Student" or "Peer"
      session: selectedSession
    });
  };

  const renderItem = ({ item, index }) => {
    const id = item.TeacherID || item.CourseNo;
    const displayName = item.TeacherName || item.CourseName;
    const isSelected = selectedItems.includes(id);
    const isTeacherTab = activeTab === "Teachers";

    return (
      <View style={[ss.listItem, index !== dataList.length - 1 && ss.borderBottom]}>
        <View style={ss.itemLeft}>
          <TouchableOpacity
            style={[ss.checkbox, isSelected && ss.checkboxChecked]}
            onPress={() => toggleSelection(id)}
          >
            {isSelected && <Text style={ss.tickText}>✓</Text>}
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={ss.itemTitle}>{displayName}</Text>
            {/* UPDATED: Designation color changed to #28a745 */}
            {item.Designation && <Text style={ss.subTextGreen}>{item.Designation}</Text>}
          </View>
        </View>

        {isTeacherTab ? (
          <View style={ss.ratingBox}>
            <Text style={ss.ratingLabel}>{evalType.toUpperCase()}</Text>
            <Text style={ss.ratingValue}>{item.AverageRating === "N/A" ? "--" : item.AverageRating}</Text>
          </View>
        ) : (
          <TouchableOpacity style={ss.actionBtnSmall}>
            <Text style={ss.actionBtnTextSmall}>➔</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={ss.main}>
      {/* ... Header and Profile Card remain same ... */}
      <View style={ss.topWrapper}>
        <View style={ss.logoContainer}>
          <Image style={ss.logo} source={require("../../../Images/Biit_Logo.png")} />
        </View>
        <View style={ss.profileCard}>
          <View style={ss.profileInfo}>
            <Text style={ss.pText}>Name: <Text style={ss.bold}>DR. JAMIL SAWAR</Text></Text>
            <Text style={ss.pText}>Role: <Text style={ss.bold}>Director</Text></Text>
            <Text style={ss.pSubText}>BIIT Administration</Text>
            
          </View>
          <Image style={ss.avatar} source={require("../../../Images/male.png")} />
        </View>
      </View>

      <Text style={ss.dashboardTitle}>ANALYTICS & FEEDBACK</Text>

      <View style={ss.tabsContainer}>
        {["Teachers", "Courses"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[ss.tabBtn, activeTab === tab && ss.activeTabBtn]}
            onPress={() => { setActiveTab(tab); setSelectedItems([]); }}
          >
            <Text style={[ss.tabBtnTxt, activeTab === tab && ss.activeTabBtnTxt]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={ss.pickerContainer}>
        <Picker
          selectedValue={selectedSession}
          onValueChange={(val) => setSelectedSession(val)}
          style={ss.picker}
          dropdownIconColor="#0d2e27"
        >
          {sessions.map((s, i) => (
            <Picker.Item key={i} label={s} value={s} color="#000" />
          ))}
        </Picker>
      </View>

      {activeTab === "Teachers" && (
        <View style={ss.subTabContainer}>
          <TouchableOpacity 
            style={[ss.subTabBtn, evalType === "Student" && ss.activeSubTabBtn]}
            onPress={() => setEvalType("Student")}
          >
            <Text style={[ss.subTabBtnTxt, evalType === "Student" && ss.activeSubTabBtnTxt]}>Student Eval</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[ss.subTabBtn, evalType === "Peer" && ss.activeSubTabBtn]}
            onPress={() => setEvalType("Peer")}
          >
            <Text style={[ss.subTabBtnTxt, evalType === "Peer" && ss.activeSubTabBtnTxt]}>Peer Eval</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color="#28a745" size="large" style={{ marginTop: 20 }} />
      ) : (
        <View style={ss.listWrapper}>
          <FlatList
            data={dataList}
            renderItem={renderItem}
            keyExtractor={(item, index) => (item.TeacherID || item.CourseNo || index).toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={ss.emptyText}>No records found</Text>}
          />
        </View>
      )}

      <View style={ss.footer}>
        <TouchableOpacity
          style={[ss.compareBtn, selectedItems.length < 2 && { opacity: 0.5 }]}
          disabled={selectedItems.length < 2}
          onPress={handleCompare}
        >
          <Text style={ss.compareBtnTxt}>Compare Selected ({selectedItems.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ss.homeBtn} onPress={() => navigation.goBack()}>
          <Text style={ss.homeBtnText}>🏠 Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ss = StyleSheet.create({
  // ... (keep previous styles)
  main: { flex: 1, backgroundColor: "#0d2e27", paddingHorizontal: 20 },
  topWrapper: { marginTop: 30 },
  logoContainer: { alignSelf: 'center', backgroundColor: '#fff', borderRadius: 50, padding: 5 },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  profileCard: { backgroundColor: "#fff", borderRadius: 15, padding: 12, flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 },
  profileInfo: { flex: 1 },
  pText: { fontWeight: "600", color: "#333" },
  bold: { fontWeight: "bold" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  dashboardTitle: { color: "#28a745", fontSize: 16, fontWeight: "bold", textAlign: 'center', marginBottom: 10 },
  tabsContainer: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 4, marginBottom: 10 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  activeTabBtn: { backgroundColor: "#fff" },
  tabBtnTxt: { color: "#fff", fontWeight: "600" },
  activeTabBtnTxt: { color: "#0d2e27" },
  subTabContainer: { flexDirection: 'row', backgroundColor: 'rgb(251, 251, 251)', borderRadius: 25, padding: 4, marginBottom: 12, alignSelf: 'center', width: '80%' },
  subTabBtn: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 20 },
  activeSubTabBtn: { backgroundColor: '#062e0f' },
  subTabBtnTxt: { color: '#28a745', fontSize: 12, fontWeight: 'bold' },
  activeSubTabBtnTxt: { color: '#fff' },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 10, height: 45, justifyContent: "center" },
  picker: { width: "100%", color: '#000' },
  listWrapper: { flex: 1, backgroundColor: "#fff", borderRadius: 15, overflow: 'hidden', marginBottom: 10 },
  listItem: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: '#fff' },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: "#0d2e27", borderRadius: 4, marginRight: 12, justifyContent: "center", alignItems: "center" },
  checkboxChecked: { backgroundColor: "#0d2e27" },
  tickText: { color: "#fff", fontSize: 12 },
  itemTitle: { fontSize: 13, fontWeight: "bold", color: "#000" },
  
  // NEW STYLE FOR DESIGNATION
  subTextGreen: { fontSize: 11, color: "#28a745", fontWeight: '500' },

  ratingBox: { alignItems: "center", backgroundColor: "#0d2e27", padding: 6, borderRadius: 10, minWidth: 65 },
  ratingLabel: { fontSize: 7, color: "#fff", fontWeight: "bold", opacity: 0.8 },
  ratingValue: { fontSize: 13, fontWeight: "bold", color: "#fff" },
  actionBtnSmall: { backgroundColor: "#0d2e27", padding: 8, borderRadius: 8 },
  actionBtnTextSmall: { color: "#fff", fontWeight: 'bold' },
  footer: { paddingBottom: 20 },
  compareBtn: { backgroundColor: "#d32f2f", paddingVertical: 12, borderRadius: 15, alignItems: "center", marginBottom: 8 },
  compareBtnTxt: { color: "#fff", fontWeight: "bold" },
  homeBtn: { backgroundColor: "#fff", paddingVertical: 10, borderRadius: 20, alignItems: "center" },
  homeBtnText: { color: "#0d2e27", fontWeight: "bold" },
  emptyText: { color: "#000", textAlign: "center", marginTop: 20 },
  pSubText: {
    color: "#28a745", // Green subtext
    fontWeight: "600",
    marginTop: 5,
  },
});

export default RCEvaluation;