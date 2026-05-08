import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput, // Added missing import
  Alert,
} from "react-native";

const TeacherPerformanceDashboard = () => {
  const [evaluationStatus, setEvaluationStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const teachers = [
    { name: "Dr Irum : HOD", status: "View Performance" },
    { name: "Mr Aftab : Assistant Professor", status: "View Performance" },
    { name: "Mr Azeem : Assistant Professor", status: "View Performance" },
    { name: "Mr Daniyal : Lecturer ", status: "View Performance" },
  ];

  return (
    <ScrollView contentContainerStyle={ss.main}>
    <Image style={ss.bimg} source={require("../../../Images/Biit_Logo.png")} />
     

      <View style={ss.mView}>
        <Text style={ss.mTxt}>Director Information</Text>
        <View style={ss.row}>
          <View>
            <Text style={ss.txt}>Name: DR. MOHAMMAD JAMIL SAWAR</Text>
            <Text style={ss.txt}>Designation: Administrative Head</Text>
          </View>

           <Image
                        style={ss.avatar}
                        source={require("../../../Images/male.png")}
            />
        </View>
      </View>

      <View style={ss.allteachers}>
        <Text style={ss.cTitle}>Teacher Performance</Text>

        <View style={ss.searchRow}>
          <TextInput
            placeholder="Search Name..."
            style={ss.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={ss.searchBtn}>
            <Text style={ss.searchText}>🔍 Search</Text>
          </TouchableOpacity>
        </View>

        {teachers.map((teacher, index) => (
          <View key={index} style={ss.cRow}>
            <Text style={ss.ctxt}>{teacher.name}</Text>

            <TouchableOpacity
              style={[
                ss.statusBtn,
                teacher.status === "Evaluated" && ss.evaluatedBtn,
              ]}
            >
              <Text
                style={[
                  ss.statusTxt,
                  teacher.status === "Evaluated" && ss.evaluatedTxt,
                ]}
              >
                {teacher.status}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={[ss.Btn, { marginTop: 15 }]}>
          <Text style={ss.BtnTxt}>Performance Mapping</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={ss.Btn} >
        <Text style={ss.BtnTxt}>🏠 Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  main: {
    backgroundColor: "#0f3b35",
    alignItems: "center",
    padding: 20,
    paddingBottom: 60,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginTop: 20,
    marginBottom: 25,
  },
  mView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  mTxt: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txt: {
    fontSize: 14,
    marginBottom: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  allteachers: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  cTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  cRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  ctxt: {
    fontSize: 14,
    width: "55%",
  },
  statusBtn: {
    backgroundColor: "#0f3b35",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  evaluatedBtn: {
    backgroundColor: "#c7f3d0",
  },
  statusTxt: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  evaluatedTxt: {
    color: "#0f3b35",
    fontWeight: "bold",
  },
  Btn: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: "90%",
    alignItems: "center",
  },
  BtnTxt: {
    color: "#0f3b35",
    fontSize: 16,
    fontWeight: "bold",
  },
  searchRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchBtn: {
    backgroundColor: "#0f3b35",
    marginLeft: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 20,
  },
  searchText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default TeacherPerformanceDashboard;