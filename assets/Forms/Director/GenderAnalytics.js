import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import APIEndPoint from "../APIEndPoint";

const GenderAnalytics = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Teachers");
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [dataList, setDataList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [stats, setStats] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState("Overall");
  const [selectedId, setSelectedId] = useState(null);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${APIEndPoint}/Director/GetAllSessions`);
      setSessions(response.data);
    } catch (error) {
      console.log("Error loading sessions:", error.message);
    }
  };

  const fetchTabData = async () => {
    if (!selectedSession || selectedSession === "placeholder") return;
    setLoading(true);
    setSearchQuery(""); 
    setStats(null);
    setSelectedId(null);
    try {
      let endpoint = activeTab === "Teachers" 
        ? `${APIEndPoint}/Director/GetAllocatedTeachers?session=${selectedSession}`
        : `${APIEndPoint}/Director/GetAllocatedCourses?session=${selectedSession}`;
      
      const response = await axios.get(endpoint);
      setDataList(response.data);
    } catch (error) {
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenderStats = async (id, name) => {
    setStatsLoading(true);
    setSelectedItemName(name);
    setSelectedId(id);
    try {
      const params = { session: selectedSession };
      if (activeTab === "Teachers") params.teacherId = id;
      else params.courseId = id;

      const response = await axios.get(`${APIEndPoint}/Director/GetGenderFeedbackStats`, { params });
      setStats(response.data);
    } catch (error) {
      console.log("Stats error:", error.message);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);
  useEffect(() => { fetchTabData(); }, [activeTab, selectedSession]);

  const filteredData = dataList.filter((item) => {
    const name = (item.TeacherName || item.CourseName || "").toLowerCase();
    const id = (item.TeacherID || item.CourseNo || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || id.includes(searchQuery.toLowerCase());
  });

  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Logo Section */}
        <View style={ss.logoContainer}>
          <Image style={ss.logo} source={require("../../Images/Biit_Logo.png")} />
        </View>

        {/* Director Info Card */}
        <View style={ss.profileCard}>
          <View style={ss.profileInfo}>
            <Text style={ss.pText}>Name: <Text style={ss.bold}>DR. MOHAMMAD JAMIL SAWAR</Text></Text>
            <Text style={ss.pText}>Role: <Text style={ss.bold}>Director</Text></Text>
            <Text style={ss.pSubText}>BIIT Administration</Text>
          </View>
          <Image style={ss.avatar} source={require("../../Images/male.png")} />
        </View>

        {/* Gender Analysis Title */}
        <Text style={ss.sectionTitle}>GENDER ANALYSIS</Text>

        {/* Session Picker Box */}
        <View style={ss.whiteBox}>
          <Text style={ss.boxLabel}>SELECT ACADEMIC SESSION</Text>
          <View style={ss.pickerWrapper}>
            <Picker
              selectedValue={selectedSession}
              onValueChange={(v) => setSelectedSession(v)}
              style={ss.picker}
              dropdownIconColor="#0f3b35"
            >
              <Picker.Item label="-- Choose Session --" value="placeholder" color="#bebaba" />
              {sessions.map((s, i) => (
                <Picker.Item key={i} label={s} value={s} color="#000" />
              ))}
            </Picker>
          </View>
        </View>

        {/* Unified Search & Tab Section */}
        <View style={ss.unifiedContainer}>
          <View style={ss.tabsContainer}>
            {["Teachers", "Courses"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[ss.tabBtn, activeTab === tab && ss.activeTabBtn]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[ss.tabBtnTxt, activeTab === tab && ss.activeTabBtnTxt]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={ss.searchWrapper}>
            <TextInput
              style={ss.searchBar}
              placeholder={`Search ${activeTab}...`}
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Card List Area */}
        <View style={ss.questionListBox}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', height: 180 }}>
                  <ActivityIndicator color="#0d2e27" size="large" />
                </View>
            ) : (
                <ScrollView nestedScrollEnabled={true} pagingEnabled={true} style={{ flex: 1 }}>
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => {
                            const id = item.TeacherID || item.CourseNo;
                            const name = item.TeacherName || item.CourseName;
                            const designation = item.Designation; // Extracting designation
                            const isSelected = selectedId === id;

                            return (
                                <View key={index} style={ss.singleQuestionItem}>
                                    <View style={ss.qHeader}>
                                        <Text style={ss.qIdText}>ID: {id}</Text>
                                        <Text style={ss.typeTag}>{activeTab === "Teachers" ? "Teacher" : "Course"}</Text>
                                    </View>
                                    <Text style={ss.qMainText}>{name}</Text>
                                    
                                    {/* Displaying Original Designation for Teachers */}
                                    {activeTab === "Teachers" && designation && (
                                      <Text style={ss.designationText}>{designation}</Text>
                                    )}

                                    <View style={ss.qActions}>
                                        <TouchableOpacity 
                                            style={[ss.actionBtn, {backgroundColor: isSelected ? '#0d2e27' : '#28a745'}]} 
                                            onPress={() => fetchGenderStats(id, name)}
                                        >
                                            <Text style={ss.actionBtnText}>{isSelected ? "Selected ✅" : "Analyze Feedback"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', height: 180 }}>
                           <Text style={ss.noDataText}>No data available.</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>

        {/* Results Section */}
        {stats && (
            <View style={ss.statsContainer}>
                <Text style={ss.analysisFor}>RESULTS FOR: <Text style={ss.analysisForI}>{selectedItemName}</Text></Text>
                <View style={ss.row}>
                    <View style={[ss.statCard, { borderColor: '#ff80ab' }]}>
                        <Text style={ss.emoji}>👩</Text>
                        <Text style={ss.statValue}>{stats.female}</Text>
                        <Text style={ss.statLabel}>Female</Text>
                    </View>
                    <View style={[ss.statCard, { borderColor: '#42a5f5' }]}>
                        <Text style={ss.emoji}>👨</Text>
                        <Text style={ss.statValue}>{stats.male}</Text>
                        <Text style={ss.statLabel}>Male</Text>
                    </View>
                </View>
                <View style={ss.overallCard}>
                    <Text style={ss.overallValue}>{stats.overall}</Text>
                    <Text style={ss.overallLabel}>Overall Satisfaction Score</Text>
                </View>
            </View>
        )}

        <TouchableOpacity style={ss.backBtn} onPress={() => navigation.goBack()}>
          <Text style={ss.backBtnTxt}>🏠 Return to Dashboard</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f3b35" },
  logoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 10 },
  logo: { width: 70, height: 70, backgroundColor: '#fff', borderRadius: 35 },
  profileCard: { backgroundColor: "#fff", borderRadius: 20, padding: 15, flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 15 },
  profileInfo: { flex: 1 },
  pText: { fontSize: 13, color: "#333" },
  bold: { fontWeight: "bold" },
  pSubText: { color: "#28a745", fontWeight: "bold", fontSize: 11 },
  avatar: { width: 55, height: 55, borderRadius: 27.5 },
  sectionTitle: { color: "#28a745", fontSize: 18, fontWeight: "bold", textAlign: 'center', marginBottom: 15 },
  whiteBox: { backgroundColor: '#fff', borderRadius: 15, padding: 12, marginHorizontal: 20, marginBottom: 20 },
  boxLabel: { fontSize: 10, fontWeight: 'bold', color: '#ae1818', textAlign: 'center', marginBottom: 8 },
  pickerWrapper: { backgroundColor: '#f2f2f2', borderRadius: 10, height: 50, justifyContent: 'center', borderWidth: 1, borderColor: '#ddd' },
  picker: { width: '100%' },
  unifiedContainer: { backgroundColor: '#fff', marginHorizontal: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 15, paddingBottom: 5 },
  tabsContainer: { flexDirection: "row", backgroundColor: "#f0f0f0", borderRadius: 12, padding: 5, marginBottom: 10 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  activeTabBtn: { backgroundColor: "#0f3b35" },
  tabBtnTxt: { color: "#777", fontWeight: "bold" },
  activeTabBtnTxt: { color: "#fff" },
  searchWrapper: { marginBottom: 5 },
  searchBar: { backgroundColor: "#f2f2f2", borderRadius: 10, height: 45, paddingHorizontal: 15, color: "#000", borderWidth: 1, borderColor: '#eee' },
  questionListBox: { backgroundColor: '#fff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, height: 200, overflow: 'hidden', marginHorizontal: 20, elevation: 4 },
  singleQuestionItem: { height: 200, padding: 25, justifyContent: 'center' },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  qIdText: { fontSize: 11, color: '#aaa', fontWeight: 'bold' },
  typeTag: { fontSize: 10, fontWeight: 'bold', color: '#28a745' },
  qMainText: { fontSize: 20, color: '#333', marginBottom: 5, textAlign: 'center', fontWeight: 'bold' },
  designationText: { fontSize: 13, color: '#28a745', textAlign: 'center', marginBottom: 15, fontStyle: 'italic', fontWeight: '600' },
  qActions: { flexDirection: 'row', justifyContent: 'center' },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 40, borderRadius: 25 },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  statsContainer: { marginTop: 25, alignItems: 'center', paddingHorizontal: 20 },
  analysisFor: { color: '#b3c82b', fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  analysisForI: { color: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  statCard: { backgroundColor: '#fff', width: '48%', borderRadius: 15, padding: 20, alignItems: 'center', borderWidth: 2 },
  emoji: { fontSize: 24, marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#777' },
  overallCard: { backgroundColor: '#fff', width: '100%', borderRadius: 15, padding: 20, alignItems: 'center', marginTop: 15, elevation: 2 },
  overallValue: { fontSize: 35, fontWeight: 'bold', color: '#0f3b35' },
  overallLabel: { color: '#666', fontSize: 13 },
  backBtn: { backgroundColor: "#fff", padding: 15, borderRadius: 30, alignItems: "center", marginTop: 30, marginHorizontal: 20 },
  backBtnTxt: { color: "#0f3b35", fontWeight: "bold" },
  noDataText: { textAlign: 'center', color: '#999' }
});

export default GenderAnalytics;