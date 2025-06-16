import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Modal,
} from "react-native";

const PosterModal = ({ onClose, posterSrc, posterAlt }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={!!posterSrc}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close poster"
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: posterSrc }}
            style={styles.poster}
            resizeMode="contain"
            accessibilityLabel={posterAlt}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 24,
    lineHeight: 30,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
});

export default PosterModal;
