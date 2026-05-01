import React, { useState } from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet,ScrollView,TextInput,} from "react-native";
const AddStudentEvalQuestions = () => {

  const [showInput, setShowInput] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  return (
    <ScrollView contentContainerStyle={ss.main}>

      <Image
        style={ss.logo}
        source={require("../../assets/Images/Biit_Logo.png")}/>

      <View style={ss.infoCard}>
        <Text style={ss.infoTitle}>Director Information</Text>

        <View style={ss.row}>
          <View>
            <Text style={ss.txt}>Name: Dr. Jamil Sawar</Text>
            <Text style={ss.txt}>Designation: Administrative Head</Text>
          </View>

          <Image
            style={ss.avatar}
            source={require("../../assets/Images/avatar.png")}/>
        </View>
      </View>

      <View style={ss.questionCard}>
        <Text style={ss.cardTitle}>Add Student Eval Questions</Text>

        <Text style={ss.question}>
          1. Did the teacher explain the experiments clearly?
        </Text>
        <View style={ss.btnRow}>
          <TouchableOpacity style={ss.editBtn}>
            <Text style={ss.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.deleteBtn}>
            <Text style={ss.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <Text style={ss.question}>
          2. Did the teacher encourage student participation and teamworK?
        </Text>
        <View style={ss.btnRow}>
          <TouchableOpacity style={ss.editBtn}>
            <Text style={ss.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.deleteBtn}>
            <Text style={ss.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <Text style={ss.question}>
          3. Did the teacher encourage student participation and teamwork?
        </Text>
        <View style={ss.btnRow}>
          <TouchableOpacity style={ss.editBtn}>
            <Text style={ss.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ss.deleteBtn}>
            <Text style={ss.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {showInput && (
          <View style={ss.inputBox}>
            <TextInput
              placeholder="Enter new question"
              placeholderTextColor="#999"
              style={ss.input}
              value={newQuestion}
              onChangeText={setNewQuestion}
            />

            <TouchableOpacity
              style={ss.okBtn}
              onPress={() => {
                alert("Question Added:\n" + newQuestion);
                setNewQuestion("");
                setShowInput(false);
              }}
            >
              <Text style={ss.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={ss.actionRow}>
          <TouchableOpacity
            style={ss.addBtn}
            onPress={() => setShowInput(true)}
          >
            <Text style={ss.actionText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={ss.submitBtn}>
            <Text style={ss.actionText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={ss.dashboardBtn}>
        <Text style={ss.dashboardText}>🏠 Dashboard</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default AddStudentEvalQuestions;

const ss = StyleSheet.create({
  main: {
    backgroundColor: "#0f3b35",
    alignItems: "center",
    padding: 20,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },

  infoCard: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },

  infoTitle: {
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
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  questionCard: {
    borderWidth: 2,
    borderColor: "#fff",
    width: "95%",
    padding: 15,
    marginBottom: 30,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },

  question: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 5,
  },

  btnRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  editBtn: {
    backgroundColor: "#1f6f64",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginRight: 10,
  },

  deleteBtn: {
    backgroundColor: "#8b2d2d",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },

  btnText: {
    color: "#fff",
    fontSize: 12,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },

  addBtn: {
    backgroundColor: "#1f6f64",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginRight: 10,
  },

  submitBtn: {
    backgroundColor: "#1f6f64",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
  },

  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },

  dashboardBtn: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },

  dashboardText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  inputBox: {
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },

  okBtn: {
    backgroundColor: "#1f6f64",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },

  okText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
