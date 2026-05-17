import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApi } from "../../lib/api";

export default function DiagnosticScreen() {
  const api = useApi();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [codes, setCodes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    try {
      setLoading(true);

      const formattedCodes = codes
        .split(",")
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean);

      const response = await api.post("/diagnostics/scan", {
        vehicleInfo: {
          brand,
          model,
          year: Number(year),
          vin,
        },
        codes: formattedCodes,
      });

      console.log(response.data);
      Alert.alert("Success", "Diagnostic scan created successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create diagnostic scan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#111", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        OBD Diagnostic
      </Text>

      <TextInput placeholder="Brand" placeholderTextColor="#999" value={brand} onChangeText={setBrand} style={styles.input} />
      <TextInput placeholder="Model" placeholderTextColor="#999" value={model} onChangeText={setModel} style={styles.input} />
      <TextInput placeholder="Year" placeholderTextColor="#999" value={year} onChangeText={setYear} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="VIN" placeholderTextColor="#999" value={vin} onChangeText={setVin} style={styles.input} />
      <TextInput placeholder="Codes: P0300,P0420" placeholderTextColor="#999" value={codes} onChangeText={setCodes} style={styles.input} />

      <TouchableOpacity onPress={handleScan} disabled={loading} style={styles.button}>
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {loading ? "Scanning..." : "Scan Vehicle"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    marginTop: 10,
  },
};