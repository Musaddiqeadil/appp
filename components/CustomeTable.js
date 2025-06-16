import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const CustomTable = ({ columns, data, heading }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={styles.headerRow}>
            {columns.map((column, index) => (
              <View key={`header-${index}`} style={styles.headerCell}>
                <Text>{column.Header}</Text>
              </View>
            ))}
          </View>

          {/* Table Rows */}
          {data.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {columns.map((column, colIndex) => (
                <View key={`cell-${rowIndex}-${colIndex}`} style={styles.cell}>
                  <Text>{row[column.accessor]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  headerCell: {
    padding: 10,
    minWidth: 100,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    padding: 10,
    minWidth: 100,
  },
});

export default CustomTable;
