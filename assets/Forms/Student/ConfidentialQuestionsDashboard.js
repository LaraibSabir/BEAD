import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView, 
    Alert, 
    ActivityIndicator,
    SafeAreaView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

import ApiEndPoint from "../APIEndPoint";
import biitLogo from "../../Images/Biit_Logo.png"; 
import avatar from "../../Images/avatar.png";

const ConfidentialQuestionsDashboard = () => {
    const navigation = useNavigation();
    const route = useRoute();

    // State Hooks
    const [studentProfile, setStudentProfile] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [allAnswers, setAllAnswers] = useState({});

    // Params handling
    const { 
        courseNo, 
        AridNo, 
        teacherName, 
        teacherID, 
        empNo, 
        courseName,
        Name,
        teacherId,
        Course_desc,
        returnTo 
    } = route.params || {};
    
    const resolvedTeacherId = teacherID || teacherId || empNo || "";
    const resolvedTeacherName = teacherName || Name || "N/A";
    const resolvedCourseName = courseName || Course_desc || "";

    useEffect(() => {
        const fetchData = async () => {
            if (!AridNo) {
                Alert.alert("Session expired", "Please login again.");
                navigation.navigate("Login");
                return;
            }
            try {
                setLoading(true);
                // Fetch Student Profile
                const sRes = await axios.get(`${ApiEndPoint}Student/GetStudentProfile?AridNo=${AridNo}`);
                setStudentProfile(sRes.data);

                // Fetch Questions
                const qRes = await axios.get(`${ApiEndPoint}Student/GetQuestions`);
                if (qRes.status === 200) {
                    // Filter logic: FT and FE types only (Confidential)
                    const fetchedQuestions = qRes.data.filter((q) => {
                        const t = String(q.RawType ?? "").trim().toUpperCase();
                        return t === "FT" || t === "FE";
                    });
                    setQuestions(fetchedQuestions);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                Alert.alert("Error", "Could not connect to server.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [AridNo]);

    // Auto-next logic when selection is made
    useEffect(() => {
        if (selectedOption !== null) {
            const timer = setTimeout(() => {
                if (currentIndex < questions.length - 1) {
                    handleNext();
                }
            }, 400); // 400ms delay for visual feedback
            return () => clearTimeout(timer);
        }
    }, [selectedOption]);

    const handleNext = () => {
        if (selectedOption === null) return Alert.alert("Selection Required", "Please select a rating.");
        
        const qId = questions[currentIndex].Question_Id;
        const updatedAnswers = { ...allAnswers, [qId]: selectedOption };
        setAllAnswers(updatedAnswers);

        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            const nextQId = questions[nextIdx].Question_Id;
            // Load existing answer if user is moving back and forth
            setSelectedOption(updatedAnswers[nextQId] || null);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            const prevIdx = currentIndex - 1;
            setCurrentIndex(prevIdx);
            setSelectedOption(allAnswers[questions[prevIdx].Question_Id] || null);
        }
    };

    const handleQuickFill = () => {
        const quickAnswers = {};
        questions.forEach((q) => { quickAnswers[q.Question_Id] = 4; });
        setAllAnswers(quickAnswers);
        setCurrentIndex(questions.length - 1);
        setSelectedOption(4);
    };

    const handleSubmit = async () => {
        if (selectedOption === null) return Alert.alert("Required", "Please answer the last question.");
        
        const qId = questions[currentIndex].Question_Id;
        const finalAnswersList = { ...allAnswers, [qId]: selectedOption };

        const submissionData = {
            Emp_no: String(resolvedTeacherId || "").trim(), 
            Reg_no: String(AridNo).trim(),
            Course_no: String(courseNo || "").trim(),
            Discipline: studentProfile?.Course || "BCS",
            Answers: Object.keys(finalAnswersList).map(id => ({
                Question_ID: parseInt(id),
                Rating: finalAnswersList[id]
            }))
        };

        try {
            setLoading(true);
            const response = await axios.post(`${ApiEndPoint}student/submit-confidential`, submissionData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Success", "Evaluation stored successfully!");
                navigation.goBack();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.Message || "Submission failed.";
            Alert.alert("Failed", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0f3b35" />
                <Text style={styles.loadingText}>Processing...</Text>
            </View>
        );
    }

    if (questions.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>No FT/FE type questions available.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btnOutline, {marginTop: 20}]}>
                    <Text>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Dashboard</Text>
                </TouchableOpacity>

                <View style={styles.logoWrapper}>
                    <Image source={biitLogo} style={styles.logo} resizeMode="contain" />
                </View>

                {/* Student Info Card */}
                <View style={styles.card}>
                    <View style={styles.flexRow}>
                        <View>
                            <Text style={styles.label}>Name: <Text style={styles.boldText}>{studentProfile?.FullName || "Student"}</Text></Text>
                            <Text style={styles.label}>Arid#: {AridNo}</Text>
                            <Text style={styles.label}><Text style={styles.boldText}>Section:</Text>{profile.Course}-{profile.Semester}{profile.Section} </Text>
                            
                        </View>
                       <Image 
  style={styles.avatar} 
  source={
    profile?.Sex && profile.Sex.toString().trim().toUpperCase() === "M" 
      ? require("../../Images/male.png") 
      : require("../../Images/avatar.png")
  } 
/>
                    </View>
                </View>

                {/* Teacher/Course Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Teacher: <Text style={styles.teacherText}>{resolvedTeacherName}</Text></Text>
                    <Text style={styles.label}>Course: <Text style={styles.courseText}>{courseNo} {resolvedCourseName ? `- ${resolvedCourseName}` : ""}</Text></Text>
                </View>

                {/* Question Area */}
                <View style={[styles.card, styles.questionCard]}>
                    <View style={styles.badge}><Text style={styles.badgeText}>{currentIndex + 1} / {questions.length}</Text></View>
                    <Text style={styles.questionHeading}>{questions[currentIndex]?.Question1}</Text>
                    
                    <View style={styles.ratingGrid}>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <TouchableOpacity 
                                key={num} 
                                style={[styles.ratingCircle, selectedOption === num && styles.selectedCircle]}
                                onPress={() => setSelectedOption(num)}
                            >
                                <Text style={[styles.ratingText, selectedOption === num && styles.selectedRatingText]}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Footer Navigation */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.btnOutline, currentIndex === 0 && { opacity: 0.3 }]} 
                    onPress={handleBack} 
                    disabled={currentIndex === 0}
                >
                    <Text style={styles.btnOutlineText}>Back</Text>
                </TouchableOpacity>

                {currentIndex < questions.length - 1 && (
                    <TouchableOpacity style={styles.btnQuick} onPress={handleQuickFill}>
                        <Text style={styles.btnQuickText}>Quick Fill (4)</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity 
                    style={currentIndex < questions.length - 1 ? styles.btnSolid : styles.btnSubmit} 
                    onPress={currentIndex < questions.length - 1 ? handleNext : handleSubmit}
                >
                    <Text style={styles.btnSolidText}>{currentIndex < questions.length - 1 ? "Next" : "Submit"}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f7f6" },
    centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    scrollContent: { padding: 20, paddingBottom: 120 },
    backButton: { marginBottom: 15 },
    backText: { fontSize: 16, color: "#0f3b35", fontWeight: "600" },
    logoWrapper: { alignItems: "center", marginBottom: 20 },
    logo: { width: 150, height: 70 },
    card: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    flexRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    label: { fontSize: 14, color: "#333", marginVertical: 2 },
    boldText: { fontWeight: "bold", color: "#000" },
    teacherText: { color: "#d32f2f", fontWeight: "bold" },
    courseText: { color: "#1976d2", fontWeight: "bold" },
    questionCard: { alignItems: "center", minHeight: 280, paddingVertical: 25 },
    badge: { backgroundColor: "#0f3b35", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 15 },
    badgeText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
    questionHeading: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 30, paddingHorizontal: 10, color: '#333' },
    ratingGrid: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
    ratingCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: "#0f3b35", justifyContent: "center", alignItems: "center" },
    selectedCircle: { backgroundColor: "#0f3b35" },
    ratingText: { color: "#0f3b35", fontWeight: "bold", fontSize: 18 },
    selectedRatingText: { color: "#fff" },
    footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: 20, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#eee", alignItems: 'center' },
    btnOutline: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: "#0f3b35" },
    btnOutlineText: { color: "#0f3b35", fontWeight: "bold" },
    btnQuick: { backgroundColor: "#ffc107", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8 },
    btnQuickText: { color: "#000", fontWeight: "bold", fontSize: 13 },
    btnSolid: { backgroundColor: "#0f3b35", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
    btnSubmit: { backgroundColor: "#2e7d32", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
    btnSolidText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    loadingText: { marginTop: 10, fontSize: 16, color: "#0f3b35", textAlign: 'center' }
});

export default ConfidentialQuestionsDashboard;