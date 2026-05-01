import React, { useState } from "react";
import {View,Text,Image,TouchableOpacity,StyleSheet,ScrollView,TextInput,} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const ManageSlots = () => {
  const [avatar, setAvatar] = useState(
    require("../../assets/Images/avatar.png")
  );

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const pickImage = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 1 },
      (response) => {
        if (response.didCancel || response.errorCode) return;
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

          <TouchableOpacity onPress={pickImage}>
            <Image style={ss.avatar} source={avatar} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={ss.mCard}>
        <Text style={ss.mTitle}>Manage Slot</Text>

        <Text style={ss.mTitle}>Start Time</Text>

        <TouchableOpacity
          style={ss.input}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>
            {startDate ? startDate.toLocaleDateString() : "Select Start Date"}
          </Text>
        </TouchableOpacity>

        <TextInput placeholder="Day" style={ss.input} />

        <Text style={ss.mTitle}>End Time</Text>

        <TouchableOpacity
          style={ss.input}
          onPress={() => setShowEndPicker(true)}>
          <Text>
            {endDate ? endDate.toLocaleDateString() : "Select End Date"}
          </Text>
        </TouchableOpacity>

        <TextInput placeholder="Day" style={ss.input} />

        <View style={ss.btnRow}>
          <TouchableOpacity style={ss.stBtn}>
            <Text style={ss.btnText}>⏲️ Set Time</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="calendar"
          onChange={(e, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="calendar"
          onChange={(e, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <TouchableOpacity style={ss.logoutBtn}>
        <Text style={ss.logoutText}>⬅ Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ManageSlots;

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
    backgroundColor: "#ffffff",
    width: "95%",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    elevation: 5,
  },

  cardTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 16,
    color: "#0f3b35",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  txt: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#0f3b35",
  },

  /* ===== Manage Slot Card ===== */
  mCard: {
    backgroundColor: "#204d45",
    width: "95%",
    borderRadius: 18,
    padding: 18,
    marginBottom: 30,
    elevation: 6,
  },

  mTitle: {
    backgroundColor: "#ffffff",
    textAlign: "center",
    paddingVertical: 8,
    borderRadius: 8,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0f3b35",
    fontSize: 14,
  },



  btnRow: {
    alignItems: "center",
    marginTop: 10,
  },

  stBtn: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
  },

  btnText: {
    color: "#0f3b35",
    fontWeight: "bold",
    fontSize: 14,
  },


});
