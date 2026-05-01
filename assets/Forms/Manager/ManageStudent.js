import React from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet,ScrollView,TextInput,} from "react-native";

const ManagerStudent = () => {
  return (
    <ScrollView contentContainerStyle={ss.main}>
      <Image
        style={ss.logo}
        source={require("../../assets/Images/Biit_Logo.png")}/>

      <View style={ss.card}>
        <Text style={ss.cardTitle}>Manager Information</Text>

        <View style={ss.row}>
          <View>
            <Text style={ss.txt}>Name: Mr Nazir Shah</Text>
            <Text style={ss.txt}>
              Designation: Database Administrator
            </Text>
          </View>

          <Image
            style={ss.avatar}
            source={require("../../assets/Images/avatar.png")}
          />
        </View>
      </View>

      <View style={ss.mCard}>
        <Text style={ss.mTitle}>Manage Student</Text>

        <View style={ss.searchRow}>
          <TextInput
            placeholder="Name"
            style={ss.input}
          />
          <TouchableOpacity style={ss.searchBtn}>
            <Text style={ss.searchText}>🔍 Search</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={ss.uploadBtn}>
          <Text style={ss.uploadText}>⬆ Upload Student</Text>
        </TouchableOpacity>

        <View style={ss.thead}>
          <Text style={ss.th}>Arid No</Text>
          <Text style={ss.th}>Edit / Delete</Text>
        </View>

        {renderRow("2022-Arid-123")}
        {renderRow("2022-Arid-124")}
        {renderRow("2022-Arid-125")}
      </View>

      <TouchableOpacity style={ss.logoutBtn}>
        <Text style={ss.logoutText}>⬅ Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const renderRow = (arid) => (
  <View style={ss.trow}>
    <Text style={ss.td}>{arid}</Text>

    <View style={ss.aRow}>
      <TouchableOpacity style={ss.editBtn}>
        <Text style={ss.actionText}>✏ Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={ss.deleteBtn}>
        <Text style={ss.actionText}>❌ Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default ManagerStudent;
const ss = StyleSheet.create({
  main: {
    backgroundColor: "#0f3b35",
    alignItems: "center",
    padding: 20,
    paddingBottom: 60,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },

  cardTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  txt: {
    fontSize: 14,
    marginBottom: 4,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  mCard: {
    backgroundColor: "#204d45",
    width: "95%",
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },

  mTitle: {
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 8,
    borderRadius: 5,
    fontWeight: "bold",
    marginBottom: 10,
  },

  sRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
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
  },

  uploadBtn: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
  },

  uploadText: {
    fontWeight: "bold",
  },

  thead: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 5,
    marginBottom: 5,
  },

  th: {
    color: "#fff",
    fontWeight: "bold",
  },

  tRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  td: {
    color: "#fff",
  },

  aRow: {
    flexDirection: "row",
  },

  editBtn: {
    backgroundColor: "#ffc107",
    paddingHorizontal: 8,
    borderRadius: 10,
    marginRight: 5,
  },

  deleteBtn: {
    backgroundColor: "#dc3545",
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  actionText: {
    color: "#fff",
    fontSize: 12,
  },

  logoutBtn: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f3b35",
  },
});
