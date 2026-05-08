import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  Dimensions
} from "react-native";
import axios from "axios";
import APIEndPoint from "../../APIEndPoint";

const { height } = Dimensions.get('window');

const AddStudentEvalQuestions = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedType, setSelectedType] = useState("T");
  const [subType, setSubType] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollRef = useRef();

  const evalTypes = [
    { id: 'T', label: 'Teacher' },
    { id: 'C', label: 'Course' },
    { id: 'P', label: 'Peer' },
    { id: 'S', label: 'Supervisor' },
    { id: 'Conf', label: 'Confidential' },
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${APIEndPoint}Director/GetActiveQuestions`);
      const validData = response.data.filter(q => q.Question_ID !== 0);
      setQuestions(validData);
      setFilteredQuestions(validData);
    } catch (error) {
      Alert.alert("Error", "Could not load questions.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (search, type) => {
    let temp = questions;
    if (type !== "All") {
      temp = temp.filter(q => {
          if (type === 'P') return q.Type === 'P' || q.Type === 'PTS' || q.Type === 'PTJ';
          if (type === 'Conf') return q.Type === 'Conf' || q.Type === 'FT' || q.Type === 'FE';
          return q.Type === type;
      });
    }
    if (search) {
      temp = temp.filter(q =>
        q.Question_ID.toString().includes(search) ||
        q.Question.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredQuestions(temp);
  };

  const resetForm = () => {
    setNewQuestion("");
    setEditingId(null);
    setSubType("");
    setSelectedType("T");
  };

  const handleSave = async () => {
    if (!newQuestion.trim()) return Alert.alert("Validation", "Enter question text.");
    
    const finalDescription = ((selectedType === 'Conf' || selectedType === 'P') && subType)
                             ? subType 
                             : selectedType;

    try {
      const payload = {
        Question_ID: editingId || 0,
        Question: newQuestion,
        Description: finalDescription 
      };

      // Calls ModifyQuestion if editingId exists, otherwise AddQuestion
      await axios.post(`${APIEndPoint}Director/${editingId ? 'ModifyQuestion' : 'AddQuestion'}`, payload);
      Alert.alert("Success", editingId ? "Question modified (New version created)." : "Question added.");
      
      resetForm();
      fetchQuestions();
    } catch (error) {
      Alert.alert("Error", "Save failed.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.Question_ID);
    setNewQuestion(item.Question);
    if(['FT', 'FE'].includes(item.Type)) {
        setSelectedType('Conf');
        setSubType(item.Type);
    } else if(['PTS', 'PTJ'].includes(item.Type)) {
        setSelectedType('P');
        setSubType(item.Type);
    } else {
        setSelectedType(item.Type || "T");
        setSubType("");
    }
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={ss.logoContainer}>
        <Image 
          source={require("../../../Images/Biit_Logo.png")} 
          style={ss.logo} 
          resizeMode="contain" 
        />
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={ss.scrollContent}>
        
        <View style={ss.profileCard}>
          <View style={ss.profileInfo}>
            <Text style={ss.pText}>Name: <Text style={ss.bold}>DR. MOHAMMAD JAMIL SAWAR</Text></Text>
            <Text style={ss.pText}>Role: <Text style={ss.bold}>Director</Text></Text>
            <Text style={ss.pSubText}>BIIT Administration</Text>
          </View>
          <Image style={ss.avatar} source={require("../../../Images/male.png")} />
        </View>

        <View style={ss.whiteBox}>
          <Text style={ss.boxLabel}>{editingId ? `MODIFYING ID: ${editingId}` : "CREATE NEW QUESTION"}</Text>
          
          <View style={ss.createTypeRow}>
            {evalTypes.map(t => (
              <TouchableOpacity 
                key={t.id} 
                style={[ss.miniTab, selectedType === t.id && ss.activeTab]}
                onPress={() => { setSelectedType(t.id); setSubType(""); }}>
                <Text style={[ss.tabText, selectedType === t.id && ss.activeTabText]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedType === 'Conf' && (
            <View style={ss.subTypeRow}>
               {['FT', 'FE'].map(st => (
                 <TouchableOpacity key={st} style={[ss.subBtn, subType === st && ss.activeSub]} onPress={() => setSubType(st)}>
                   <Text style={[ss.subBtnText, subType === st && ss.activeSubText]}>{st === 'FT' ? 'FT (Theory)' : 'FE (Exp)'}</Text>
                 </TouchableOpacity>
               ))}
            </View>
          )}

          {selectedType === 'P' && (
            <View style={ss.subTypeRow}>
               {['PTS', 'PTJ'].map(st => (
                 <TouchableOpacity key={st} style={[ss.subBtn, subType === st && ss.activeSub]} onPress={() => setSubType(st)}>
                   <Text style={[ss.subBtnText, subType === st && ss.activeSubText]}>{st === 'PTS' ? 'PTS (Senior)' : 'PTJ (Junior)'}</Text>
                 </TouchableOpacity>
               ))}
            </View>
          )}

          <TextInput
            style={ss.inputField}
            placeholder="Question text..."
            placeholderTextColor="#666"
            value={newQuestion}
            onChangeText={setNewQuestion}
            multiline
          />

          {editingId ? (
            <View style={ss.buttonRow}>
              <TouchableOpacity style={[ss.addBtn, { flex: 2 }]} onPress={handleSave}>
                <Text style={ss.addBtnText}>UPDATE VERSION</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ss.addBtn, ss.cancelBtn]} onPress={resetForm}>
                <Text style={ss.addBtnText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={ss.addBtn} onPress={handleSave}>
              <Text style={ss.addBtnText}>ADD QUESTION</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={ss.manageHeader}>
            <View style={ss.headerRow}>
                <Text style={ss.sectionTitle}>MANAGE QUESTIONS</Text>
                <View style={ss.countBadge}><Text style={ss.countText}>{filteredQuestions.length}</Text></View>
            </View>
            
            <TextInput 
                style={ss.searchBar}
                placeholder="🔎Search ID or Question..."
                placeholderTextColor="#444"
                value={searchQuery}
                onChangeText={(t) => {setSearchQuery(t); applyFilters(t, filterType);}}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ss.filterScroll}>
                <TouchableOpacity 
                    style={[ss.filterBtn, filterType === "All" && ss.activeFilter]}
                    onPress={() => {setFilterType("All"); applyFilters(searchQuery, "All");}}>
                    <Text style={[ss.filterBtnText, filterType === "All" && ss.activeFilterText]}>All</Text>
                </TouchableOpacity>
                {evalTypes.map(t => (
                    <TouchableOpacity 
                        key={t.id}
                        style={[ss.filterBtn, filterType === t.id && ss.activeFilter]}
                        onPress={() => {setFilterType(t.id); applyFilters(searchQuery, t.id);}}>
                        <Text style={[ss.filterBtnText, filterType === t.id && ss.activeFilterText]}>{t.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        <View style={ss.questionListBox}>
            {loading ? (
                <ActivityIndicator color="#0d2e27" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView 
                    nestedScrollEnabled={true} 
                    pagingEnabled={true} 
                    style={{ flex: 1 }}
                >
                    {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((item) => (
                            <View key={item.Question_ID} style={ss.singleQuestionItem}>
                                <View style={ss.qHeader}>
                                    <Text style={ss.qIdText}>ID: {item.Question_ID}</Text>
                                    <Text style={ss.typeTag}>{item.Type}</Text>
                                </View>
                                <Text style={ss.qMainText}>{item.Question}</Text>
                                <View style={ss.qActions}>
                                    <TouchableOpacity style={[ss.actionBtn, {backgroundColor: '#28a745'}]} onPress={() => startEdit(item)}>
                                        <Text style={ss.actionBtnText}>Modify</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[ss.actionBtn, {backgroundColor: '#dc3545'}]}>
                                        <Text style={ss.actionBtnText}>Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={ss.noDataText}>No questions found.</Text>
                    )}
                </ScrollView>
            )}
        </View>

        <TouchableOpacity style={ss.backBtn} onPress={() => navigation.goBack()}>
          <Text style={ss.backBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2e27" },
  logoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 10 },
  logo: { width: 120, height: 60 },
  scrollContent: { padding: 20 },
  profileCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", marginBottom: 20 },
  profileInfo: { flex: 1 },
  pText: { fontSize: 13, color: "#333" },
  bold: { fontWeight: "bold" },
  pSubText: { color: "#28a745", fontWeight: "bold", fontSize: 11, marginTop: 4 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  whiteBox: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 20 },
  boxLabel: { fontSize: 10, fontWeight: 'bold', color: '#666', textAlign: 'center', marginBottom: 10 },
  createTypeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 12 },
  subTypeRow: { flexDirection: 'row', gap: 8, marginBottom: 12, paddingBottom: 5, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  subBtn: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f0f0f0' },
  activeSub: { backgroundColor: '#28a745' },
  subBtnText: { fontSize: 10, fontWeight: 'bold', color: '#666' },
  activeSubText: { color: '#fff' },
  miniTab: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, borderWidth: 1, borderColor: '#ddd' },
  activeTab: { backgroundColor: '#0d2e27', borderColor: '#0d2e27' },
  tabText: { fontSize: 10, color: '#666' },
  activeTabText: { color: '#fff' },
  inputField: { backgroundColor:'#cdc2c2', borderRadius: 10, padding: 10, height: 60, marginBottom: 10, color: '#000' },
  addBtn: { backgroundColor: '#00c853', padding: 12, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  cancelBtn: { backgroundColor: '#6c757d', flex: 1 },
  manageHeader: { width: '100%', marginBottom: 15 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  countBadge: { backgroundColor: '#00c853', borderRadius: 10, paddingHorizontal: 8, marginLeft: 10 },
  countText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  searchBar: { backgroundColor: '#a19a9a', borderRadius: 10, padding: 10, marginBottom: 10, color: '#000' },
  filterScroll: { flexDirection: 'row', marginBottom: 5 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 15, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  activeFilter: { backgroundColor: '#fff' },
  filterBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  activeFilterText: { color: '#0d2e27' },
  questionListBox: { 
      backgroundColor: '#fff', 
      borderRadius: 15, 
      height: 180, 
      overflow: 'hidden',
      marginBottom: 10 
  },
  singleQuestionItem: { 
      height: 180, 
      padding: 20,
      justifyContent: 'center'
  },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  qIdText: { fontSize: 11, color: '#999', fontWeight: 'bold' },
  typeTag: { fontSize: 10, fontWeight: 'bold', color: '#28a745' },
  qMainText: { fontSize: 15, color: '#333', marginBottom: 15, textAlign: 'center' },
  qActions: { flexDirection: 'row', justifyContent: 'center', gap: 15 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 6 },
  actionBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  noDataText: { textAlign: 'center', marginTop: 50, color: '#666' },
  backBtn: { backgroundColor: '#ece4e4', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  backBtnText: { color: '#042909', fontWeight: 'bold' }
});

export default AddStudentEvalQuestions;