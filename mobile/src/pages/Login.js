import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";

import logo from "../assets/logo.png";
import api from '../services/Api';

function Login({ navigation }) {
  const [user, setUser] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then((id) => {
      console.log(`%cLOGIN PAGE SAYS: LOGGED USER ID: ${id}`, 'color:orange;font-weight:bold');
      if (id) {
        navigation.navigate('Main', { user: id });
      }
    }).catch((error) => {
      console.error(error);
    })
  }, []);

  async function handleLogin() {
    const response = await api.post('/devs', { username: user })
      .catch((error) => {
        console.error(error);
      });

    const { _id } = response.data;

    await AsyncStorage.setItem('user', _id); 

    navigation.navigate('Main', { user: _id });
  }

  return (
    <View style={styles.container}>
      <Image source={logo} />

      <TextInput
        style={ styles.input }
        placeholder="Digite seu usuario do github"
        placeholderColor="#999"
        autoCapitalize="none"
        autoCorrect={ false }
        value={ user }
        onChangeText={ setUser }
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={ styles.buttonText }>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 30
  },
  input: {
    height: 46,
    alignSelf: "stretch",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#ddd",
    marginTop: 20,
    paddingHorizontal: 15
  },
  button: {
      height: 46,
      alignSelf: 'stretch',
      backgroundColor: '#DF4723',
      borderRadius: 4,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
  },
  buttonText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
  }
});

export default Login;
