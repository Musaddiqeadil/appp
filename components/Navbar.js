import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome as Fa, FontAwesome5 as Fa5 } from "@expo/vector-icons";
import { menuItems } from "./menuConfig";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigation = useNavigation();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Toggle mobile menu
  const toggleMenu = () => setOpen(!open);

  // Close mobile menu
  const closeMenu = () => setOpen(false);

  // Toggle dropdown for submenus
  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
      rotateArrow(0);
    } else {
      setActiveDropdown(index);
      rotateArrow(1);
    }
  };

  // Animate the dropdown arrow
  const rotateArrow = (toValue) => {
    Animated.timing(rotateAnim, {
      toValue,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.navbar}>
      <View style={styles.navbarIn}>
        <View style={styles.navbarLeft}>
          <Image
            source={require("../assets/images/logo-main.png")}
            style={styles.navbarLogo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.navbarToggle} onPress={toggleMenu}>
          {open ? (
            <Fa name="times" size={24} color="#333" />
          ) : (
            <Fa name="bars" size={24} color="#333" />
          )}
        </TouchableOpacity>

        <View style={[styles.navbarMenu, open && styles.navbarMenuActive]}>
          {menuItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.navbarItem,
                // You can add active link styling based on navigation state if needed
              ]}
            >
              {item.dropdown ? (
                <View style={styles.navbarDropdown}>
                  <TouchableOpacity
                    style={styles.dropdownHeader}
                    onPress={() => toggleDropdown(index)}
                  >
                    <Text style={styles.navbarLink}>
                      {item.label}{" "}
                      <Animated.View
                        style={{ transform: [{ rotate: rotateInterpolate }] }}
                      >
                        <Fa5
                          name="chevron-down"
                          size={14}
                          style={styles.dropdownArrow}
                        />
                      </Animated.View>
                    </Text>
                  </TouchableOpacity>
                  {activeDropdown === index && (
                    <View style={styles.dropdownMenu}>
                      {item.dropdown.map((subItem, subIdx) => (
                        <TouchableOpacity
                          key={subIdx}
                          style={styles.dropdownItem}
                          onPress={() => {
                            navigation.navigate(subItem.path);
                            closeMenu();
                            setActiveDropdown(null);
                          }}
                        >
                          <Text style={styles.dropdownLink}>
                            {subItem.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(item.path);
                    closeMenu();
                  }}
                >
                  <Text style={styles.navbarLink}>{item.label}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  navbarIn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navbarLeft: {
    flex: 1,
  },
  navbarLogo: {
    height: 40,
    width: 120,
  },
  navbarToggle: {
    padding: 10,
    zIndex: 1000,
  },
  navbarMenu: {
    position: "absolute",
    top: 60,
    right: 0,
    backgroundColor: "#fff",
    width: "70%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    display: "none",
  },
  navbarMenuActive: {
    display: "flex",
  },
  navbarItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  navbarLink: {
    fontSize: 16,
    color: "#333",
  },
  navbarDropdown: {
    position: "relative",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownArrow: {
    marginLeft: 5,
  },
  dropdownMenu: {
    marginTop: 10,
    paddingLeft: 15,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownLink: {
    fontSize: 14,
    color: "#666",
  },
});

export default Navbar;
