import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
// Assuming shared styles

const ConfidentialDecryptorTable = ({ route, navigation }) => {
    const { records = [], rawJson = "", fileName = "" } = route.params || {};

    const columns = useMemo(() => {
        if (!records.length) return [];
        const keys = new Set();
        records.forEach((row) => {
            Object.keys(row || {}).forEach((k) => keys.add(k));
        });
        return Array.from(keys);
    }, [records]);

    return (
        <View style={styles.container}>
           <ScrollView 
  style={styles.container} // This handles the flex: 1
  contentContainerStyle={styles.scrollContent} // This handles padding/alignment[cite: 2, 3]
>
                <View style={styles.logoWrap}>
                  <Image source={require("../../Images/Biit_Logo.png")} style={styles.logo} resizeMode="contain" />
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Decrypted Confidential Data</Text>
                    {fileName ? <Text style={styles.fileName}>Source: {fileName}</Text> : null}
                    
                    {!records.length && (
                        <Text style={styles.hintText}>No decrypted data found.</Text>
                    )}
                </View>

                {records.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.subTitle}>Decrypted Records</Text>
                        <ScrollView horizontal>
                            <View>
                                {/* Header */}
                                <View style={styles.tableRow}>
                                    {columns.map((col) => (
                                        <View key={col} style={[styles.tableCell, styles.headerCell]}>
                                            <Text style={styles.headerText}>{col}</Text>
                                        </View>
                                    ))}
                                </View>
                                {/* Rows */}
                                {records.map((row, idx) => (
                                    <View key={idx} style={styles.tableRow}>
                                        {columns.map((col) => (
                                            <View key={col} style={styles.tableCell}>
                                                <Text style={styles.cellText}>
                                                    {typeof row[col] === "object" 
                                                        ? JSON.stringify(row[col]) 
                                                        : String(row[col] ?? "")}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                )}


                {rawJson ? (
                    <View style={styles.card}>
                        <Text style={styles.subTitle}>Raw JSON</Text>
                        <Text style={styles.rawJsonText}>{rawJson}</Text>
                    </View>
                ) : null}
            </ScrollView>

            <TouchableOpacity 
                style={styles.footerBtn} 
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.footerBtnText}>Back to Upload</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ConfidentialDecryptorTable;
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
        elevation: 5, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1a2e28",
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: "700",
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
    // Table Styles
    tableRow: {
        flexDirection: "row",
    },
    tableCell: {
        borderWidth: 1,
        borderColor: "#d4ddda",
        padding: 8,
        minWidth: 100,
    },
    headerCell: {
        backgroundColor: "#e6efec",
    },
    headerText: {
        fontWeight: "bold",
        color: "#1a2e28",
    },
    cellText: {
        fontSize: 12,
        color: "#333",
    },
    rawJsonText: {
        backgroundColor: "#f7f9f8",
        padding: 10,
        borderRadius: 8,
        fontFamily: "monospace",
        fontSize: 12,
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