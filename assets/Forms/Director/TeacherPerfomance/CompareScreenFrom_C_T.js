import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
  Image,
  TextInput
} from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import APIEndPoint from "../../APIEndPoint";

const { width } = Dimensions.get("window");

const CompareScreenForm_C_T = ({ route, navigation }) => {
  const { courseId, courseName, session } = route.params || {};

  // 1. All Hooks must be at the very top, before any return statements or conditionals
  const [loading, setLoading] = useState(false);
  const [teacherList, setTeacherList] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  // 2. Use useMemo for filtering to prevent unnecessary re-renders during typing
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => 
      q.Question_ID.toString().includes(searchQuery) || 
      q.Question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allQuestions, searchQuery]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const resT = await axios.get(`${APIEndPoint}/Director/GetTeachersByCourse?courseId=${courseId}&session=${session}`);
      const uniqueTeachers = Array.from(new Map(resT.data.map(item => [String(item.TeacherID), item])).values());
      setTeacherList(uniqueTeachers);

      const resQ = await axios.get(`${APIEndPoint}/Director/GetQuestionsList`);
      const uniqueQuestions = Array.from(new Map(resQ.data.map(item => [String(item.Question_ID), item])).values());
      setAllQuestions(uniqueQuestions);
      setSelectedQuestions(uniqueQuestions.map(q => q.Question_ID));
      
    } catch (e) {
      Alert.alert("Data Error", "Failed to load teachers or questions.");
    } finally {
      setLoading(false);
    }
  };

  const getTeacherColor = (index) => {
    const palette = [`#FFD700`, `#FF8C00`, `#AF52DE`, `#FF2D55`, `#5856D6`, `#34C759` ];
    return palette[index % palette.length];
  };

  const handleShowEvaluation = async () => {
    if (selectedTeachers.length === 0) {
      Alert.alert("Selection Missing", "Please select at least one teacher.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${APIEndPoint}/Director/GetComparisonData`, {
        TeacherIds: selectedTeachers,
        QuestionIds: selectedQuestions,
        CourseId: courseId,
        Session: session
      });
      formatGraphData(response.data);
    } catch (e) {
      Alert.alert("Error", "Could not fetch evaluation data.");
    } finally {
      setLoading(false);
    }
  };

  const formatGraphData = (apiData) => {
    const sortedQIds = [...selectedQuestions].sort((a, b) => a - b);
    const labels = sortedQIds.map(q => `Q${q}`);

    const datasets = selectedTeachers.map((tId, idx) => {
      const ratings = sortedQIds.map(qId => {
        const match = apiData.find(d => 
          String(d.TeacherID) === String(tId) && 
          parseInt(d.QuestionNo) === parseInt(qId)
        );
        return match ? match.AverageRating : 0;
      });

      return {
        data: ratings,
        color: (opacity = 1) => getTeacherColor(idx),
        strokeWidth: 3,
      };
    });

    datasets.push({ data: sortedQIds.map(() => 5), color: () => `transparent`, strokeWidth: 0, withDots: false });
    setGraphData({ labels, datasets });
  };

  const renderLegend = () => (
    <View style={ss.legendContainer}>
      {selectedTeachers.map((tId, index) => {
        const teacher = teacherList.find(t => String(t.TeacherID) === String(tId));
        return (
          <View key={tId} style={ss.legendItem}>
            <View style={[ss.legendDot, { backgroundColor: getTeacherColor(index) }]} />
            <Text style={ss.legendText}>{teacher?.TeacherName?.toUpperCase() || "TEACHER"}</Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <ScrollView style={ss.main} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={ss.topWrapper}>
        <View style={ss.logoContainer}>
          <Image style={ss.logo} source={require("../../../Images/Biit_Logo.png")} />
        </View>

        <View style={ss.profileCard}>
          <View style={ss.profileInfo}>
            <Text style={ss.pText}>Name: <Text style={ss.bold}>DR. MOHAMMAD JAMIL SAWAR</Text></Text>
            <Text style={ss.pText}>Role: <Text style={ss.bold}>Director</Text></Text>
            <Text style={ss.pSubText}>BIIT Administration</Text>
          </View>
          <Image style={ss.avatar} source={require("../../../Images/male.png")} />
        </View>
      </View>

      <View style={ss.combinedInfoCard}>
        <View style={ss.infoRow}>
          <Text style={ss.labelBold}>COURSE: </Text>
          <Text style={ss.valueNormal}>{courseName}</Text>
        </View>
        <View style={ss.divider} />
        <View style={ss.infoRow}>
          <Text style={ss.labelBold}>SESSION: </Text>
          <Text style={ss.valueNormal}>{session}</Text>
        </View>
      </View>

      <Text style={ss.sectionTitle}>Select Teachers to Compare:</Text>
      
      <View style={ss.listWrapper}>
        {teacherList.map((t) => {
          const isSelected = selectedTeachers.includes(t.TeacherID);
          return (
            <TouchableOpacity 
              key={`t-${t.TeacherID}`} 
              style={ss.listItem} 
              onPress={() => setSelectedTeachers(prev => 
                prev.includes(t.TeacherID) ? prev.filter(x => x !== t.TeacherID) : [...prev, t.TeacherID]
              )}
            >
              <View style={[ss.checkbox, isSelected && ss.checkboxChecked]}>
                {isSelected && <Text style={ss.tickText}>✓</Text>}
              </View>
              <Image source={require("../../../Images/male.png")} style={ss.listAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={ss.itemLabel}>TEACHER</Text>
                <Text style={ss.itemTitle}>{t.TeacherName}</Text>
                <Text style={ss.subText}>{t.Designation || "Lecturer"}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={ss.evalBtn} onPress={handleShowEvaluation}>
        <Text style={ss.evalBtnTxt}>Show Evaluation</Text>
      </TouchableOpacity>

      {graphData && (
        <View style={ss.graphCard}>
          <Text style={ss.graphHeader}>Performance Comparison</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={graphData}
              width={Math.max(width - 40, graphData.labels.length * 60)}
              height={260}
              fromZero={true}
              segments={5}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
                propsForDots: { r: "4", strokeWidth: "2" },
                fillShadowGradientOpacity: 0,
                propsForBackgroundLines: { stroke: "#e3e3e3", strokeDasharray: "" }, 
              }}
              bezier
              style={{ borderRadius: 10, marginVertical: 10 }}
            />
          </ScrollView>

          {renderLegend()}

          <TouchableOpacity style={ss.editBtn} onPress={() => setShowEditModal(true)}>
            <Text style={ss.editBtnTxt}>⚙️ Edit Questions</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 20 }} />}

      <TouchableOpacity style={ss.backBtn} onPress={() => navigation.goBack()}>
        <Text style={ss.backBtnTxt}>🏠 Back to Dashboard</Text>
      </TouchableOpacity>

      <Modal visible={showEditModal} animationType="slide">
        <View style={ss.modalBody}>
          <View style={ss.modalHeaderRow}>
            <Text style={ss.modalHeader}>Select Questions</Text>
            <Text style={ss.totalCount}>Total: {allQuestions.length}</Text>
          </View>

          <View style={ss.searchContainer}>
            <Text style={{ marginRight: 8 }}>🔍</Text>
            <TextInput
              style={ss.searchInput}
              placeholder="Search Question No. or Text"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={ss.controlRow}>
            <TouchableOpacity style={ss.deselectBtn} onPress={() => setSelectedQuestions([])}>
              <Text style={ss.deselectBtnTxt}>❌ Deselect All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[ss.deselectBtn, {backgroundColor: '#e8f5e9', borderColor: '#81c784'}]} 
              onPress={() => setSelectedQuestions(allQuestions.map(q => q.Question_ID))}
            >
              <Text style={[ss.deselectBtnTxt, {color: '#2e7d32'}]}>✅ Select All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredQuestions}
            keyExtractor={(item) => item.Question_ID.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedQuestions.includes(item.Question_ID);
              return (
                <TouchableOpacity 
                  style={ss.modalItem} 
                  onPress={() => setSelectedQuestions(prev => 
                    prev.includes(item.Question_ID) ? prev.filter(x => x !== item.Question_ID) : [...prev, item.Question_ID]
                  )}
                >
                  <View style={[ss.checkbox, isSelected && ss.checkboxChecked]}>
                    {isSelected && <Text style={ss.tickText}>✓</Text>}
                  </View>
                  <Text style={ss.modalItemTxt}>
                    <Text style={{fontWeight: 'bold'}}>Q{item.Question_ID}: </Text>
                    {item.Question}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity 
            style={ss.applyBtn} 
            onPress={() => { setShowEditModal(false); handleShowEvaluation(); }}
          >
            <Text style={ss.applyBtnTxt}>Apply Filter ({selectedQuestions.length})</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#0d2e27", paddingHorizontal: 20 },
  topWrapper: { marginTop: 30 },
  logoContainer: { alignSelf: 'center', backgroundColor: '#fff', borderRadius: 50, padding: 5, elevation: 5 },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  profileCard: { backgroundColor: "#fff", borderRadius: 20, padding: 15, flexDirection: "row", alignItems: "center", marginTop: 15, marginBottom: 10 },
  profileInfo: { flex: 1 },
  pText: { fontSize: 12, color: "#333", marginBottom: 2 },
  bold: { fontWeight: "bold" },
  pSubText: { color: "#28a745", fontWeight: "600", fontSize: 10 },
  avatar: { width: 45, height: 45, borderRadius: 22.5 },
  combinedInfoCard: { backgroundColor: "#fff", borderRadius: 15, padding: 15, marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  labelBold: { fontWeight: 'bold', color: '#0d2e27', fontSize: 13 },
  valueNormal: { color: '#444', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
  sectionTitle: { color: "#fff", fontSize: 14, fontWeight: "bold", marginBottom: 10 },
  listWrapper: { marginBottom: 10 },
  listItem: { backgroundColor: "#fff", borderRadius: 15, padding: 12, flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: "#0d2e27", borderRadius: 6, marginRight: 12, justifyContent: "center", alignItems: "center" },
  checkboxChecked: { backgroundColor: "#0d2e27" },
  tickText: { color: "#fff", fontWeight: "bold" },
  listAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  itemLabel: { fontSize: 8, color: "#999", fontWeight: "bold" },
  itemTitle: { fontSize: 14, fontWeight: "bold", color: "#000" },
  subText: { fontSize: 11, color: "#28a745", marginTop: 2, fontWeight: '600' },
  evalBtn: { backgroundColor: "#c91212", padding: 15, borderRadius: 15, alignItems: "center", marginTop: 10 },
  evalBtnTxt: { color: "#fff", fontWeight: "bold" },
  graphCard: { backgroundColor: "#fff", marginTop: 20, borderRadius: 15, padding: 10 },
  graphHeader: { fontWeight: "bold", textAlign: "center", color: "#0d2e27", marginTop: 10 },
  legendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 10, marginTop: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 5 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { fontSize: 10, color: '#555', fontWeight: 'bold' },
  editBtn: { alignSelf: "center", backgroundColor: "#eff1f1", padding: 10, borderRadius: 5, marginTop: 15 },
  editBtnTxt: { color: "#0d2e27", fontWeight: "bold" },
  backBtn: { backgroundColor: "#fff", padding: 12, borderRadius: 20, alignItems: "center", marginTop: 20 },
  backBtnTxt: { fontWeight: "bold", color: "#0d2e27" },
  modalBody: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalHeader: { fontSize: 18, fontWeight: "bold", color: '#0d2e27' },
  totalCount: { fontSize: 14, color: '#666', fontWeight: '600' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
  searchInput: { flex: 1, height: 45, color: '#000', fontSize: 14 },
  controlRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  deselectBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fff1f0', borderWidth: 1, borderColor: '#ffa39e', alignItems: 'center' },
  deselectBtnTxt: { fontSize: 12, color: '#cf1322', fontWeight: 'bold' },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  modalItemTxt: { fontSize: 14, color: "#333", flex: 1 },
  applyBtn: { backgroundColor: "#0d2e27", padding: 15, borderRadius: 10, alignItems: "center", marginVertical: 20 },
  applyBtnTxt: { color: "#fff", fontWeight: "bold" },
});

export default CompareScreenForm_C_T;