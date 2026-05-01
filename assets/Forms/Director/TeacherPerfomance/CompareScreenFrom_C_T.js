import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, 
  FlatList, ActivityIndicator, Alert, Modal, Dimensions, Image 
} from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import APIEndPoint from "../../APIEndPoint";

const { width } = Dimensions.get("window");

const CompareScreenForm_C_T = ({ route, navigation }) => {
  const { courseId, courseName, session } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [teacherList, setTeacherList] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Teachers
      const resT = await axios.get(`${APIEndPoint}/Director/GetTeachersByCourse?courseId=${courseId}&session=${session}`);
      // Filtering duplicates strictly
      const uniqueTeachers = Array.from(new Map(resT.data.map(item => [String(item.TeacherID), item])).values());
      setTeacherList(uniqueTeachers);

      // 2. Fetch Questions
      const resQ = await axios.get(`${APIEndPoint}/Director/GetQuestionsList`);
      const uniqueQuestions = Array.from(new Map(resQ.data.map(item => [String(item.Question_ID), item])).values());
      setAllQuestions(uniqueQuestions);
      setSelectedQuestions(uniqueQuestions.map(q => q.Question_ID));
      
    } catch (e) {
      console.log("Error loading initial data:", e);
      Alert.alert("Data Error", "Failed to load teachers or questions.");
    } finally {
      setLoading(false);
    }
  };

  const getTeacherColor = (name, index) => {
    const normalizedName = name ? name.toLowerCase() : "";
    if (normalizedName.includes("jannat")) return `rgba(255, 0, 0, 1)`;
    if (normalizedName.includes("mohsin")) return `rgba(255, 215, 0, 1)`;
    if (normalizedName.includes("azeem")) return `rgba(0, 128, 0, 1)`;
    
    const palette = [`#007AFF`, `#FF9500`, `#AF52DE`, `#FF2D55`, `#5856D6`, `#34C759` ];
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
      const teacher = teacherList.find(t => String(t.TeacherID) === String(tId));
      const teacherName = teacher ? teacher.TeacherName : "Unknown";

      const ratings = sortedQIds.map(qId => {
        const match = apiData.find(d => 
          String(d.TeacherID) === String(tId) && 
          parseInt(d.QuestionNo) === parseInt(qId)
        );
        return match ? match.AverageRating : 0;
      });

      return {
        data: ratings,
        color: (opacity = 1) => getTeacherColor(teacherName, idx),
        strokeWidth: 4,
        withDots: true,
      };
    });

    datasets.push({
      data: sortedQIds.map(() => 5),
      color: () => `transparent`,
      strokeWidth: 0,
      withDots: false,
    });

    setGraphData({ labels, datasets });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={ss.headerCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Director Information</Text>
          <Text style={ss.headerSub}>DR. MOHAMMAD JAMIL SAWAR</Text>
          <Text style={ss.headerSub}>Designation: Administrative Head</Text>
        </View>
        <Image style={ss.avatar} source={require("../../../Images/avatar.png")} />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Subject: {courseName}</Text>
        <Text style={styles.infoLabel}>Session: {session}</Text>
      </View>

      <Text style={styles.sectionTitle}>Select Teachers to Compare:</Text>
      <View style={styles.teacherScrollContainer}>
        <ScrollView nestedScrollEnabled={true}>
          {teacherList.map((t, index) => (
            <TouchableOpacity 
              // ✅ CRITICAL FIX: Unique key combination
              key={`teacher-row-${t.TeacherID}-${index}`} 
              style={styles.row} 
              onPress={() => setSelectedTeachers(prev => 
                prev.includes(t.TeacherID) ? prev.filter(x => x !== t.TeacherID) : [...prev, t.TeacherID]
              )}
            >
              <View style={[styles.chk, selectedTeachers.includes(t.TeacherID) && styles.checked]} />
              <Text style={styles.nameTxt}>{t.TeacherName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.evalBtn} onPress={handleShowEvaluation}>
        <Text style={styles.evalBtnTxt}>Show Evaluation</Text>
      </TouchableOpacity>

      {graphData && (
        <View style={styles.graphCard}>
          <Text style={styles.graphHeader}>Performance Comparison</Text>
          <ScrollView horizontal>
            <LineChart
              data={graphData}
              width={Math.max(width - 40, graphData.labels.length * 70)}
              height={300}
              fromZero={true}
              segments={5}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: { r: "5", strokeWidth: "2" },
                fillShadowGradientOpacity: 0,
                propsForBackgroundLines: { strokeDasharray: "" },
              }}
              bezier
              style={{ borderRadius: 10, marginVertical: 10 }}
            />
          </ScrollView>

          {/* Legend Section */}
          <View style={styles.legendContainer}>
            {selectedTeachers.map((tId, index) => {
              const teacher = teacherList.find(t => String(t.TeacherID) === String(tId));
              return (
                <View key={`legend-item-${tId}-${index}`} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: getTeacherColor(teacher?.TeacherName || "", index) }]} />
                  <Text style={styles.legendText}>{teacher?.TeacherName}</Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditModal(true)}>
            <Text style={styles.editBtnTxt}>⚙️ Edit Questions</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtnTxt}>⬅️ Back </Text>
      </TouchableOpacity>

      {/* Questions Modal */}
      <Modal visible={showEditModal} animationType="slide">
        <View style={styles.modalBody}>
          <Text style={styles.modalHeader}>Questions List</Text>
          <FlatList
            data={allQuestions}
            // ✅ CRITICAL FIX: Key extractor must be a string and unique
            keyExtractor={(item, index) => `question-list-item-${item.Question_ID || index}`}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.row} 
                onPress={() => setSelectedQuestions(prev => 
                  prev.includes(item.Question_ID) 
                    ? prev.filter(x => x !== item.Question_ID) 
                    : [...prev, item.Question_ID]
                )}
              >
                <View style={[styles.chk, selectedQuestions.includes(item.Question_ID) && styles.checked]} />
                <Text style={styles.nameTxt}>{item.Question}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity 
            style={styles.applyBtn} 
            onPress={() => { setShowEditModal(false); handleShowEvaluation(); }}
          >
            <Text style={styles.applyBtnTxt}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  headerCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerSub: { color: '#555', fontSize: 13 },
  avatar: { width: 55, height: 55, borderRadius: 30, marginLeft: 10 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f3b35", padding: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 5 },
  infoRow: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  infoLabel: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  sectionTitle: { color: '#fff', marginTop: 15, marginBottom: 5, fontWeight: 'bold' },
  teacherScrollContainer: { backgroundColor: '#fff', borderRadius: 10, height: 140 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  chk: { width: 20, height: 20, borderWidth: 2, borderColor: '#0f3b35', marginRight: 10, borderRadius: 4 },
  checked: { backgroundColor: '#0f3b35' },
  nameTxt: { fontSize: 14, color: '#333', flex: 1 },
  evalBtn: { backgroundColor: '#c91212', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  evalBtnTxt: { color: '#fff', fontWeight: 'bold' },
  graphCard: { backgroundColor: '#fff', marginTop: 20, borderRadius: 15, padding: 10 },
  graphHeader: { fontWeight: 'bold', textAlign: 'center', color: '#0f3b35' },
  legendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 5 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 5 },
  legendText: { fontSize: 12, color: '#333' },
  editBtn: { alignSelf: 'center', backgroundColor: '#eff1f1', padding: 10, borderRadius: 5, marginTop: 10 },
  editBtnTxt: { color: '#0f3b35', fontWeight: 'bold' },
  modalBody: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  applyBtn: { backgroundColor: '#0f3b35', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 20 },
  applyBtnTxt: { color: '#fff', fontWeight: 'bold' },
  backBtn: { backgroundColor: '#eff1f1', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  backBtnTxt: { fontWeight: 'bold', color: '#0f3b35' },
});

export default CompareScreenForm_C_T;