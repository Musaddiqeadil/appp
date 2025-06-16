import React from "react";
import { View, StyleSheet, ActivityIndicator, Modal } from "react-native";

function Loader2() {
  return (
    <Modal transparent={true} visible={true} animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator
          size="large"
          color="#0000ff" // Customize color as needed
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
});

export default Loader2;
