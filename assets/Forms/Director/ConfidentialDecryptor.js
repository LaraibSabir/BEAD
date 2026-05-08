import React, { useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    ScrollView, 
    ActivityIndicator, 
    Alert 
} from "react-native";
import * as DocumentPicker from "@react-native-documents/picker";
import axios from "axios";
import ApiEndPoint from "../APIEndPoint";

const ConfidentialDecryptor = ({ navigation }) => {
    const [fileName, setFileName] = useState("");
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [status, setStatus] = useState({ type: "", msg: "" });

    const handleFileSelect = async () => {
        try {
            // Updated to use DocumentPicker.pick
            const [res] = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                allowMultiSelection: false,
            });

            // Validate extension
            if (!res.name.toLowerCase().endsWith(".enc")) {
                setStatus({ type: "error", msg: "Please upload a .enc file." });
                return;
            }

            setFileName(res.name);
            setStatus({ type: "", msg: "" });
            setIsDecrypting(true);

            const formData = new FormData();
            formData.append("file", {
                uri: res.uri,
                name: res.name,
                type: "application/octet-stream", 
            });

            const response = await axios.post(
                `${ApiEndPoint}director/import-confidential`, 
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setStatus({ type: "success", msg: "Upload successful!" });
            
            navigation.navigate("ConfidentialDecryptorTable", {
                records: response.data.records || [],
                rawJson: JSON.stringify(response.data, null, 2),
                fileName: res.name
            });

        } catch (err) {
            // Consistent reference via the DocumentPicker object to fix the error in image_c1ff1e.jpg
            if (DocumentPicker.isCancel(err)) { 
                console.log("User cancelled the picker");
            } else {
                const apiMessage = err.response?.data?.message || err.message;
                setStatus({ type: "error", msg: `Process failed: ${apiMessage}` });
            }
        } finally {
            setIsDecrypting(false);
        }
    };

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.logoWrap}>
                <Image source={require("../../Images/Biit_Logo.png")} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.card}>
                <TouchableOpacity 
                    style={[styles.uploadBtn, isDecrypting && { opacity: 0.6 }]} 
                    onPress={handleFileSelect}
                    disabled={isDecrypting}
                >
                    <Text style={styles.uploadBtnText}>
                        {isDecrypting ? "Uploading..." : "Upload Encrypted File"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.cardTitle}>Confidential File Decryptor</Text>
                <Text style={styles.hintText}>
                    Upload .enc file. It will be sent directly to the save endpoint.
                </Text>

                {fileName ? <Text style={styles.fileName}>Selected: {fileName}</Text> : null}
                
                {isDecrypting && <ActivityIndicator color="#4caf50" style={{ marginTop: 10 }} />}
                
                {status.msg ? (
                    <Text style={status.type === "error" ? styles.errorText : styles.statusText}>
                        {status.msg}
                    </Text>
                ) : null}
            </View>

            <TouchableOpacity 
                style={styles.footerBtn} 
                onPress={() => navigation.navigate("DirectorDashboard")}
            >
                <Text style={styles.footerBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ConfidentialDecryptor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a2e28",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
        alignItems: "center",
    },
    logoWrap: {
        marginVertical: 20,
    },
    logo: {
        width: 150,
        height: 60,
    },
    card: {
        backgroundColor: "#ffffff",
        width: "100%",
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1a2e28",
        marginBottom: 10,
    },
    hintText: {
        color: "#4f5f5b",
        fontSize: 14,
    },
    uploadBtn: {
        backgroundColor: "#4caf50",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    uploadBtnText: {
        color: "#fff",
        fontWeight: "bold",
    },
    fileName: {
        marginTop: 10,
        color: "#2f4f4a",
        fontStyle: "italic",
    },
    errorText: {
        color: "#b00020",
        marginTop: 10,
        fontWeight: "600",
    },
    statusText: {
        color: "#4caf50",
        marginTop: 10,
    },
    footerBtn: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    footerBtnText: {
        color: "#1a2e28",
        fontWeight: "bold",
    }
});