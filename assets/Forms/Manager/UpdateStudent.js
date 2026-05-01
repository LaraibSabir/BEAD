import React, { useState } from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet,ScrollView,TextInput,} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

const UpdateFaculty = () => {
  const [gender, setGender] = useState("Male");
  const [course, setCourse] = useState("");
  const [program, setProgram] = useState("");
  const [class_Section, setClass_Section] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [avatar, setAvatar] = useState(
    require("../../assets/Images/avatar.png")
  );

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) return;

        setAvatar({ uri: response.assets[0].uri });
      }
    );
  };

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
            <Text style={ss.txt}>Designation: Database Administrator</Text>
          </View>

          <Image style={ss.avatar} source={avatar} />
        </View>
      </View>

      <View style={ss.mCard}>
        <Text style={ss.mTitle}>Update Student</Text>

        <TextInput placeholder="AridNo" style={ss.input} />

        <View style={ss.row}>
          <TextInput
            placeholder="Student Name"
            style={[ss.input, { flex: 1 }]}
          />
          <TouchableOpacity style={ss.imageBtn} onPress={pickImage}>
            <Text style={ss.imageText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

    <View style={ss.ddc}>
          <TouchableOpacity
            style={ss.dd}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text>{class_Section || "Class_Section"}</Text>
            <Text>▼</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={ss.ddList}>
              {[
                "1A",
                "1B",
                "1C",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={ss.ddItem}
                  onPress={() => {
                    setClass_Section(item);
                    setShowDropdown(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={ss.genderRow}>
          <Text style={ss.genderText}>Gender:</Text>

          <TouchableOpacity
            style={ss.radioContainer}
            onPress={() => setGender("Male")}
          >
            <View style={ss.radioOuter}>
              {gender === "Male" && <View style={ss.radioInner} />}
            </View>
            <Text style={ss.radioLabel}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ss.radioContainer}
            onPress={() => setGender("Female")}
          >
            <View style={ss.radioOuter}>
              {gender === "Female" && <View style={ss.radioInner} />}
            </View>
            <Text style={ss.radioLabel}>Female</Text>
          </TouchableOpacity>
        </View>


          <View style={ss.ddc}>
          <TouchableOpacity
            style={ss.dd}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text>{program || " Program"}</Text>
            <Text>▼</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={ss.ddList}>
              {[
                "BSSE",
                "BSCS",
                "BSAI",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={ss.ddItem}
                  onPress={() => {
                    setProgram(item);
                    setShowDropdown(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={ss.ddc}>
          <TouchableOpacity
            style={ss.dd}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text>{course || "Assign Courses"}</Text>
            <Text>▼</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={ss.ddList}>
              {[
                "Database Systems",
                "Software Engineering",
                "Web Development",
              ].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={ss.ddItem}
                  onPress={() => {
                    setCourse(item);
                    setShowDropdown(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={ss.input}
        />

        <View style={ss.btnRow}>
          <TouchableOpacity style={ss.updateBtn}>
            <Text style={ss.btnText}>✔ Update</Text>
          </TouchableOpacity>

          <TouchableOpacity style={ss.backBtn}>
            <Text style={ss.btnText}>⬅ Back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={ss.logoutBtn}>
        <Text style={ss.logoutText}>⬅ Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UpdateFaculty;
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
    marginBottom: 8,
  },

  txt: {
    fontSize: 14,
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
    marginBottom: 25,
  },

  mTitle: {
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 8,
    borderRadius: 5,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    marginBottom: 10,
  },

  imageBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    marginLeft: 5,
  },

  imageText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  genderText: {
    color: "#fff",
    marginRight: 10,
  },

  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },

  radioLabel: {
    color: "#fff",
  },

  ddc: {
    marginBottom: 10,
  },

  dd: {
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ddList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 5,
  },

  ddItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },

  updateBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  backBtn: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
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
