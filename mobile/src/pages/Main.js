import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import io from "socket.io-client";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";

import api from "../services/Api";

import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import itsamatch from "../assets/itsamatch.png";

function Main({ navigation }) {
  const id = navigation.getParam("user");
  console.log(
    `%cMAIN PAGE SAYS: LOGGED USER ID: ${id}`,
    "color:purple;font-weight:bold"
  );
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const response = await api.get("/devs", {
        headers: {
          user: id
        }
      });

      setUsers(response.data);
    }

    loadUsers();
  }, [id]);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      query: { user: id }
    });

    socket.on("match", dev => {
      setMatchDev(dev);
      console.log(`%cMAIN PAGE SAYS: onMatch`, "color:purple;font-weight:bold");
    });
    console.log(`%cMAIN PAGE SAYS: useEffect`, "color:purple;font-weight:bold");
  }, [id]);

  async function handleLike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {
        user: id
      }
    });

    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {
        user: id
      }
    });

    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardContainer}>
        {users.length === 0 ? (
          <Text style={styles.itsOverText}> Acabou :'( </Text>
        ) : (
          users.map((user, index) => {
            return (
              <View
                key={user._id}
                style={[styles.card, { zIndex: users.length - index }]}
              >
                <Image
                  style={styles.avatar}
                  source={{
                    uri: user.avatar
                  }}
                />
                <View style={styles.footer}>
                  <Text style={styles.name}> {user.name} </Text>
                  <Text style={styles.bio} numberOfLines={3}>
                    {user.bio}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike} />
          </TouchableOpacity>
        </View>
      )}

      {matchDev && (
        <View style={styles.itsamatchContainer}>
          <Image source={itsamatch} style={styles.matchImage} />
          <Image source={matchDev.avatar} style={styles.matchAvatar} />

          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>

          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.matchButton}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      )}

      {users.length === 0 && <View />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5"
  },
  logo: {
    marginTop: 35
  },
  cardContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    maxHeight: 500
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    margin: 30,
    overflow: "hidden",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  avatar: {
    flex: 1,
    height: 300
  },
  footer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  bio: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    lineHeight: 20
  },
  buttonsContainer: {
    flexDirection: "row",
    marginBottom: 60
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 2
  },
  itsOverText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#DDD",
    alignSelf: "center"
  },
  itsamatchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, .8);",
    justifyContent: "center",
    alignItems: "center"
  },
  matchImage: {
    height: 60,
    resizeMode: "contain"
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: "#FFF",
    marginVertical: 30
  },
  matchName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF"
  },
  matchBio: {
    marginTop: 10,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 30
  },
  matchButton: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center"
  }
});

export default Main;
