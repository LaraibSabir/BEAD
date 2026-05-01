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
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import APIEndPoint from "../../APIEndPoint";

const RCEvaluation = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Teachers");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // 1. Fetch Sessions Dropdown
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

  // 2. Main Logic to Fetch and Merge Data
  const fetchData = async () => {
    if (!selectedSession) return;
    setLoading(true);
    try {
      let endpoint = "";
      if (activeTab === "Teachers") {
        endpoint = `${APIEndPoint}/Director/GetAllocatedTeachers?session=${encodeURIComponent(selectedSession)}`;
      } else if (activeTab === "Courses") {
        endpoint = `${APIEndPoint}/Director/GetAllocatedCourses?session=${encodeURIComponent(selectedSession)}`;
      } else {
        setDataList([]);
        setLoading(false);
        return;
      }

      // Step A: Fetch Main List (Teachers or Courses)
      const response = await axios.get(endpoint);
      let fetchedData = response.data;

      // Step B: If Teachers Tab, fetch ratings and Merge
      if (activeTab === "Teachers") {
        try {
          const ratingRes = await axios.get(
            `${APIEndPoint}/Director/GetTeacherAverageRatings?session=${encodeURIComponent(selectedSession)}`
          );
          const ratingsMap = ratingRes.data;

          fetchedData = fetchedData.map((teacher) => {
            // Trim and Uppercase logic to prevent ID mismatch
            const ratingObj = ratingsMap.find(
              (r) => 
                String(r.TeacherID).trim().toUpperCase() === 
                String(teacher.TeacherID).trim().toUpperCase()
            );
            
            return {
              ...teacher,
              // Backend already provides rounded values
              AverageRating: ratingObj ? ratingObj.AverageRating.toFixed(1) : "N/A",
            };
          });
        } catch (e) {
          console.log("Ratings fetch failed, showing list without ratings.");
        }
      }

      setDataList(fetchedData);
    } catch (error) {
      setDataList([]);
      console.log("API Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle Hooks
  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedSession]);

  const toggleSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const renderItem = ({ item }) => {
    const id = item.TeacherID || item.CourseNo;
    const displayName = item.TeacherName || item.CourseName;
    const isSelected = selectedItems.includes(id);
    const isTeacherTab = activeTab === "Teachers";

    return (
      <View style={ss.listItem}>
        <View style={ss.itemLeft}>
          <TouchableOpacity
            style={[ss.checkbox, isSelected && ss.checkboxChecked]}
            onPress={() => toggleSelection(id)}
          >
            {isSelected && <Text style={ss.tickText}>✓</Text>}
          </TouchableOpacity>

          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={ss.itemText}>{displayName}</Text>
            {item.Designation && <Text style={ss.subText}>{item.Designation}</Text>}
            {/* <Text style={ss.subText}>ID: {id}</Text> */}
          </View>
        </View>

        {isTeacherTab ? (
          <View style={ss.ratingBox}>
            <Text style={ss.ratingLabel}>Avg Rating</Text>
            <Text style={ss.ratingValue}>
              {item.AverageRating === "N/A" ? "--" : item.AverageRating}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={ss.arrowContainer}
            onPress={() =>
              navigation.navigate("AllAssignedCourseTeachers", {
                courseId: item.CourseNo,
                courseName: item.CourseName,
                initialSession: selectedSession,
              })
            }
          >
            <Text style={ss.arrow}>➔</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={ss.container}>
      <View style={ss.headerCard}>
        <View>
          <Text style={ss.headerTitle}>Director Information</Text>
          <Text style={ss.headerSub}>Name: DR. MOHAMMAD JAMIL SAWAR</Text>
          <Text style={ss.headerSub}>Designation: Administrative Head</Text>
        </View>
        <Image style={ss.avatar} source={require("../../../Images/avatar.png")} />
      </View>

      <View style={ss.tabsContainer}>
        {["Teachers", "Courses"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[ss.tabBtn, activeTab === tab && ss.activeTabBtn]}
            onPress={() => {
              setActiveTab(tab);
              setSelectedItems([]);
            }}
          >
            <Text style={[ss.tabBtnTxt, activeTab === tab && ss.activeTabBtnTxt]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={ss.contentBody}>
        <View style={ss.pickerContainer}>
          <Picker
            selectedValue={selectedSession}
            onValueChange={(itemValue) => setSelectedSession(itemValue)}
            style={ss.picker}
            dropdownIconColor="#0f3b35"
          >
            <Picker.Item label="Select session" value={null} enabled={false} />
            {sessions.map((s, index) => (
              <Picker.Item key={index} label={s} value={s} />
            ))}
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator color="#fff" size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={dataList}
            renderItem={renderItem}
            keyExtractor={(item, index) => (item.TeacherID || item.CourseNo || index).toString()}
            ListEmptyComponent={<Text style={ss.emptyText}>No data available</Text>}
          />
        )}

        <TouchableOpacity
          style={[ss.compareBtn, selectedItems.length < 2 && { opacity: 0.6 }]}
          onPress={() => navigation.navigate("CompareScreenFrom_C_T", { selectedItems })}
          disabled={selectedItems.length < 2}
        >
          <Text style={ss.compareBtnTxt}>Compare Selected ({selectedItems.length})</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={ss.DBtn} onPress={() => navigation.goBack()}>
        <Text style={ss.DText}>🏠 Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles remain largely the same, optimized for readability
const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f3b35", padding: 15 },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  headerTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  headerSub: { fontSize: 13, color: "#555" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    marginBottom: 15,
    padding: 5,
  },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 8 },
  activeTabBtn: { backgroundColor: "#fff" },
  tabBtnTxt: { color: "#ccc", fontSize: 14, fontWeight: "500" },
  activeTabBtnTxt: { color: "#0f3b35", fontWeight: "bold" },
  contentBody: { flex: 1 },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    height: 45,
    justifyContent: "center",
  },
  picker: { width: "100%" },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  itemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  itemText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  subText: { fontSize: 11, color: "#666" },
  ratingBox: { backgroundColor: "#0f3b35", padding: 6, borderRadius: 6, alignItems: "center", minWidth: 60 },
  ratingLabel: { color: "#fff", fontSize: 8 },
  ratingValue: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#0f3b35",
    marginRight: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#0f3b35" },
  tickText: { color: "#fff", fontSize: 12 },
  compareBtn: { backgroundColor: "#b11e1e", padding: 15, borderRadius: 8, alignItems: "center", marginVertical: 10 },
  compareBtnTxt: { color: "#fff", fontWeight: "bold" },
  DBtn: { backgroundColor: "#fff", paddingVertical: 12, borderRadius: 30, alignItems: "center" },
  DText: { color: "#0f3b35", fontWeight: "bold" },
  emptyText: { color: "#fff", textAlign: "center", marginTop: 20 },
  arrow: { fontSize: 18, color: "#0f3b35" },
  arrowContainer: { padding: 5 },
});

export default RCEvaluation;