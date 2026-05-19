import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApi } from "../../lib/api";
import { DiagnosticScan } from "@/types";

export default function DiagnosticScreen() {
  const api = useApi();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [codes, setCodes] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [scanResult, setScanResult] = useState<DiagnosticScan | null>(null);
  const [scanHistory, setScanHistory] = useState<DiagnosticScan[]>([]);

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case "low":
        return "#22c55e";
      case "medium":
        return "#eab308";
      case "high":
        return "#f97316";
      case "critical":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const fetchScanHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await api.get("/diagnostics/scans");
      setScanHistory(response.data.scans || []);
    } catch (error) {
      console.log(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const handleScan = async () => {
    if (!brand || !model || !year || !codes) {
      Alert.alert("Missing information", "Please fill brand, model, year and codes.");
      return;
    }

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

      setScanResult(response.data.scan);
      await fetchScanHistory();

      Alert.alert("Success", "Diagnostic scan created successfully");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create diagnostic scan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.iconBox}>
          <Ionicons name="car-sport" size={30} color="#F5A623" />
        </View>

        <View>
          <Text style={styles.title}>OBD Diagnostic</Text>
          <Text style={styles.subtitle}>Manual scan now, Bluetooth later</Text>
        </View>
        

      </View>

        <View
  style={{
    backgroundColor: "#2A1D10",
    borderWidth: 1,
    borderColor: "#3B2B1B",
    padding: 14,
    borderRadius: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }}
>
  <Ionicons name="bluetooth" size={22} color="#F5A623" />

  <View style={{ flex: 1 }}>
    <Text
      style={{
        color: "#FFF7E6",
        fontWeight: "bold",
        marginBottom: 4,
      }}
    >
      Bluetooth OBD Ready
    </Text>

    <Text
      style={{
        color: "#A68B6B",
        lineHeight: 18,
      }}
    >
      The system architecture supports future ELM327 Bluetooth
      integration for automatic vehicle scanning.
    </Text>
  </View>
</View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>

        <TextInput
          placeholder="Brand e.g. Renault"
          placeholderTextColor="#94a3b8"
          value={brand}
          onChangeText={setBrand}
          style={styles.input}
        />

        <TextInput
          placeholder="Model e.g. Clio 4"
          placeholderTextColor="#94a3b8"
          value={model}
          onChangeText={setModel}
          style={styles.input}
        />

        <TextInput
          placeholder="Year e.g. 2018"
          placeholderTextColor="#94a3b8"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="VIN number optional"
          placeholderTextColor="#94a3b8"
          value={vin}
          onChangeText={setVin}
          autoCapitalize="characters"
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>OBD Codes</Text>

        <TextInput
          placeholder="P0300,P0420"
          placeholderTextColor="#94a3b8"
          value={codes}
          onChangeText={setCodes}
          autoCapitalize="characters"
          style={styles.input}
        />

        <TouchableOpacity onPress={handleScan} disabled={loading} style={styles.button}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="scan" size={20} color="white" />
              <Text style={styles.buttonText}>Scan Vehicle</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {scanResult && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Latest Scan Result</Text>

          <Text style={styles.vehicleText}>
            {scanResult.vehicleInfo.brand} {scanResult.vehicleInfo.model} •{" "}
            {scanResult.vehicleInfo.year}
          </Text>

          {scanResult.diagnosticCodes.length === 0 ? (
            <Text style={styles.emptyText}>No diagnostic codes found.</Text>
          ) : (
            scanResult.diagnosticCodes.map((item) => (
              <View key={item._id} style={styles.codeCard}>
                <View style={styles.codeHeader}>
                  <Text style={styles.codeText}>{item.code}</Text>

                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(item.severity) },
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {item.severity || "unknown"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>{item.description}</Text>
              </View>
            ))
          )}
        </View>
      )}

      <View style={styles.card}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Scan History</Text>

          <TouchableOpacity onPress={fetchScanHistory}>
            <Ionicons name="refresh" size={22} color="#60a5fa" />
          </TouchableOpacity>
        </View>

        {historyLoading ? (
          <ActivityIndicator color="#60a5fa" />
        ) : scanHistory.length === 0 ? (
          <Text style={styles.emptyText}>No previous scans yet.</Text>
        ) : (
          scanHistory.map((scan) => (
            <View key={scan._id} style={styles.historyCard}>
              <View style={styles.codeHeader}>
                <View>
                  <Text style={styles.historyTitle}>
                    {scan.vehicleInfo.brand} {scan.vehicleInfo.model}
                  </Text>
                  <Text style={styles.historyDate}>
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
              </View>

              <Text style={styles.description}>
                Year: {scan.vehicleInfo.year}
              </Text>

              <Text style={styles.description}>
                Codes:{" "}
                {scan.diagnosticCodes.length > 0
                  ? scan.diagnosticCodes.map((code) => code.code).join(", ")
                  : "No codes"}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#0B0603",
    padding: 18,
  },
  headerCard: {
    backgroundColor: "#16110D",
    borderRadius: 24,
    padding: 18,
    marginTop: 15,
    marginBottom: 18,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 14,
    borderWidth: 1,
    borderColor: "#2D2218",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#2A1D10",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  title: {
    color: "#FFF7E6",
    fontSize: 26,
    fontWeight: "800" as const,
  },
  subtitle: {
    color: "#A68B6B",
    marginTop: 4,
  },
  card: {
   backgroundColor: "#16110D",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2D2218",
  },
  sectionTitle: {
    color: "white",
    fontSize: 19,
    fontWeight: "800" as const,
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#211912",
    color: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#2D2218",
  },
  button: {
    backgroundColor: "#F5A623",
    padding: 16,
    borderRadius: 16,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
    marginTop: 5,
  },
  buttonText: {
    color: "#0B0603",
    fontWeight: "800" as const,
    fontSize: 16,
  },
  vehicleText: {
    color: "#cbd5e1",
    marginBottom: 14,
  },
  codeCard: {
    backgroundColor: "#211912",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2D2218",
  },
  codeHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  codeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800" as const,
  },
  description: {
    color: "#cbd5e1",
    marginTop: 8,
    lineHeight: 20,
  },
  severityBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  severityText: {
    color: "white",
    fontWeight: "800" as const,
    textTransform: "uppercase" as const,
    fontSize: 12,
  },
  emptyText: {
    color: "#94a3b8",
  },
  historyHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  historyCard: {
    backgroundColor: "#211912",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2D2218",
  },
  historyTitle: {
    color: "white",
    fontWeight: "800" as const,
    fontSize: 16,
  },
  historyDate: {
    color: "#94a3b8",
    marginTop: 3,
  },
};