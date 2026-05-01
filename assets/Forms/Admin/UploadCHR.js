import React from "react";
import { View,Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert,} from "react-native";
const UploadCHR=()=>{
     return (
        <ScrollView contentContainerStyle={ss.main}>
        <View>
          <Image
          style={ss.logo}
          source={require("../../assets/Images/Biit_Logo.png")}/>
          <View style={ss.mView}>
            <Text style={ss.mtxt}>Admin Information</Text>
    
            <View style={ss.row}>
              <View>
                <Text style={ss.txt}>Name:  Mr Nadeem Ahtar</Text>
                <Text style={ss.txt}>Designation:  Data Entry Operator</Text>
              </View>
    
              <Image
              style={ss.avatar}
                source={require("../../assets/Images/avatar.png")} />
            </View>
            </View>

            <View style={ss.mView}>
                <Text style={ss.txt}>Upload Attendance</Text>
                <TextInput placeholder="Teacher Name" style={ss.input} />
                <TextInput placeholder="Course Code" style={ss.input} />
                <TextInput placeholder="Course Name" style={ss.input} />
                <TextInput placeholder="Status" style={ss.input} />

                <TouchableOpacity style={ss.updateBtn}>
                            <Text style={ss.btnText}>✏️ Edit</Text>
                </TouchableOpacity>

                 <TouchableOpacity style={ss.updateBtn}>
                            <Text style={ss.btnText}>➕ Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={ss.backBtn}>
                            <Text style={ss.btnText}>⬅️ Back</Text>
                </TouchableOpacity>
                
            </View>
            
           <TouchableOpacity style={styles.logoutBtn}>
                  <Text style={styles.logoutText}>↗️Logout</Text>
            </TouchableOpacity>
        </View>
            </ScrollView>
)}
export default UploadCHR;

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