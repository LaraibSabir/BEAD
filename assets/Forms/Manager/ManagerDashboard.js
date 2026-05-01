import React from "react";
import { View,Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert,} from "react-native";
const ManagerDashboard=()=>{
     return (
        <ScrollView contentContainerStyle={ss.main}>
           <View>
          <Image
          style={ss.logo}
            source={require("../../assets/Images/Biit_Logo.png")}/>
            <Text style={ss.mtxt}>Manager Information</Text>
    
            <View style={ss.row}>
              <View>
                <Text style={ss.txt}>Name: Mr Nazir Shah</Text>
                <Text style={ss.txt}>Designation:  Database Administrator</Text>
              </View>
    
              <Image
              style={ss.avatar}
                source={require("../../assets/Images/avatar.png")} />
            </View>
            </View>

            <View style={ss.mView}>
                <Text style={ss.txt}>Manager Dashboard</Text>
            </View>
            <View style={ss.mainView}>
                <TouchableOpacity style={ss.Btn}>
                <Text style={ss.btnText}>Manage Faculty</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ss.Btn}>
                <Text style={ss.btnText}>Manage Student</Text>
                </TouchableOpacity>
                <TouchableOpacity style={ss.Btn}>
                <Text style={ss.btnText}>Manage Slot</Text>
                </TouchableOpacity>
            </View>
           <TouchableOpacity style={styles.logoutBtn}>
                  <Text style={styles.logoutText}>↗️Logout</Text>
            </TouchableOpacity>
            </View>
            </ScrollView>
)}
export default ManagerDashboard;

const ss=StyleSheet.create({
    main: {
    backgroundColor: "#0f3b35",
    alignItems: "center",
    padding: 20,
    paddingBottom: 60,
  },
    mView: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
    mtxt: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
    row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
 Btn: {
    backgroundColor: "#0f3b35",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 5,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
   logoutBtn: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
  },

  logoutText: {
    color: "#050505ff",
    fontSize: 18,
    fontWeight: "bold",
  },

})