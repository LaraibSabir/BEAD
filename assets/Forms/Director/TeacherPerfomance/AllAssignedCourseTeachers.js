import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import axios from "axios";
import APIEndPoint from "../../APIEndPoint";

const AllAssignedCourseTeachers = ({ route, navigation }) => {
  const { courseId, courseName, initialSession } = route.params || {};

  const [selectedSession, setSelectedSession] = useState(initialSession || "");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedSession]);

  const fetchData = async () => {
    if (!courseId) {
      Alert.alert("Error", "No course selected.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = `${APIEndPoint}/Director/GetTeachersByCourse?courseId=${courseId}&session=${encodeURIComponent(selectedSession)}`;
      const response = await axios.get(endpoint);
      setDataList(response.data);
    } catch (error) {
      setDataList([]);
      if (error.response?.status !== 404) console.log("API Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (teacherId) => {
    if (selectedItems.includes(teacherId)) {
      setSelectedItems(selectedItems.filter(id => id !== teacherId));
    } else {
      setSelectedItems([...selectedItems, teacherId]);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.TeacherID);
    return (
      <View style={ss.teacherCard}>
        <View style={ss.cardContent}>
          <View style={ss.infoSection}>
            <TouchableOpacity 
              style={[ss.checkbox, isSelected && ss.checkboxChecked]} 
              onPress={() => toggleSelection(item.TeacherID)}
            >
              {isSelected && <Text style={ss.tickText}>✓</Text>}
            </TouchableOpacity>
            <View style={ss.textDetails}>
              <Text style={ss.teacherNameText}>{item.TeacherName}</Text>
              <View style={ss.designationBadge}>
                <Text style={ss.designationText}>{item.Designation || "Faculty Member"}</Text>
              </View>
            </View>
          </View>
          <View style={ss.ratingBox}>
            <Text style={ss.ratingLabel}>Rating</Text>
            <Text style={ss.ratingValue}>{item.AverageRating || '0.0'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={ss.container}>
      {/* 1. Director Information Card */}
      <View style={ss.headerCard}>
        <View style={{ flex: 1 }}>
          <Text style={ss.headerTitle}>Director Information</Text>
            <Text style={ss.headerSub}>Name: DR. MOHAMMAD JAMIL SAWAR</Text>
          <Text style={ss.headerSub}>Designation: Administrative Head</Text>
        </View>
        <Image style={ss.avatar} source={require("../../../Images/avatar.png")} />
      </View>

      {/* 2. New Separated Course/Session Info Div */}
      <View style={ss.statusDiv}>
        <View style={ss.statusRow}>
          <Text style={ss.statusLabel}>Subject:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            <Text style={ss.statusValueText}>{courseName}</Text>
          </ScrollView>
        </View>
        <View style={[ss.statusRow, { marginTop: 5, borderTopWidth: 0.5, borderTopColor: '#ddd', paddingTop: 5 }]}>
          <Text style={ss.statusLabel}>Session:</Text>
          <Text style={ss.statusValueText}>{selectedSession}</Text>
        </View>
      </View>

      {/* 3. Teachers List Area */}
      <View style={ss.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={dataList}
            renderItem={renderItem}
            keyExtractor={(item) => item.TeacherID.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={ss.emptyText}>No teachers assigned in {selectedSession}</Text>
            }
          />
        )}
      </View>

      {/* 4. Footer Actions */}
      <View style={ss.footer}>
                      <TouchableOpacity 
                style={[ss.compareBtn, selectedItems.length < 2 && ss.disabledBtn]}
                onPress={() => navigation.navigate('CompareScreenFrom_C_T', { 
                  courseId: courseId, 
                  courseName: courseName, 
                  session: selectedSession, // Passing the actual session string
                  teacherIds: selectedItems    // The array of IDs selected via checkboxes
                })}
                disabled={selectedItems.length < 2}
              >
                <Text style={ss.compareBtnTxt}>Compare Selected ({selectedItems.length})</Text>
              </TouchableOpacity>

        <TouchableOpacity style={ss.backBtn} onPress={() => navigation.goBack()}>
          <Text style={ss.backBtnTxt}>⬅️ Back to Courses</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f3b35", padding: 15 },
  
  // Header Styles
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  headerTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 5, color: '#333' },
  headerSub: { fontSize: 13, color: "#555" },
  avatar: { width: 55, height: 55, borderRadius: 30, marginLeft: 10 },

  // New Status Div Styles
  statusDiv: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#89c098', // Red accent to match theme
  },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusLabel: { fontSize: 13, fontWeight: 'bold', color: '#555', width: 70 },
  statusValueText: { fontSize: 14, fontWeight: 'bold', color: '#0f3b35' },
  
  // List Styles
  listContainer: { flex: 1 },
  teacherCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#8bf0a1', 
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  textDetails: { marginLeft: 12 },
  teacherNameText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  designationBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  designationText: { fontSize: 11, color: '#666', fontWeight: '600' },
  
  ratingBox: {
    backgroundColor: '#0f3b35',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 55,
  },
  ratingLabel: { color: '#fff', fontSize: 8, textTransform: 'uppercase' },
  ratingValue: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  checkbox: { 
    width: 24, 
    height: 24, 
    borderWidth: 2, 
    borderColor: '#0f3b35', 
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#0f3b35' },
  tickText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  footer: { marginTop: 10 },
  compareBtn: { backgroundColor: '#c91212', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  disabledBtn: { backgroundColor: '#95a5a6', opacity: 0.6 },
  compareBtnTxt: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  backBtn: { backgroundColor: '#eff1f1', padding: 10, borderRadius: 30, alignItems: 'center', marginBottom: 5 },
  backBtnTxt: { color: '#0b371d', fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: '#ffffff', textAlign: 'center', marginTop: 40, opacity: 0.8 }
});

export default AllAssignedCourseTeachers;