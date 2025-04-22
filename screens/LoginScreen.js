import { Alert } from 'react-native';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState } from 'react';
import { View, StyleSheet, Text,TextInput, TouchableOpacity, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const[email, setEmail]=useState('');
  const[password, setPassword]=useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const  userLogin = () => {
    if (email.trim() === '') {
      Alert.alert(' Enter your email');
        return; }
    
      if (password.trim() === '') {
        Alert.alert(' Enter your password');
        return; }
    
   signInWithEmailAndPassword(auth, email, password)
  .then((result) => {
    const createUser = result.user;
    navigation.navigate('Home');
  })
  .catch((error) => {
    if (error.code === 'auth/user-not-found') {
      
      Alert.alert('Please create account. No account exists for this email');
    } else if (error.code === 'auth/wrong-password') {
      Alert.alert('Incorrect password');
    }
      else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Try again. The email or password is incorrect.');
  } 
     else {
      Alert.alert(error.message);
    }
  });
};


    const Signup = async() => {
        if (email.trim() === '') {
          Alert.alert(' Enter your email');
        return; }
    
      if (password.trim() === '') {
        Alert.alert(' Enter your password');
        return;}
        try {
    
    const result = await createUserWithEmailAndPassword(auth, email, password);

    
    const user = result.user;


    await setDoc(doc(db, "accounts", user.uid), {
          serEmail: user.email,
          registeredTime: new Date().toISOString(),
      });
      
    
      Alert.alert('Your account is created successfully 🌱');
    navigation.navigate('Home');
  } 
  
  catch (error)  {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('You already have an account just log in');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Enter a valid Email');
    } else if (error.code === 'auth/wrong-password') {
        alert('Incorrect password.');
    } else if (error.code === 'auth/user-not-found') {
      Alert.alert('Please create account. No account exists for this email');
    } else if (error.code === 'auth/invalid-credential') {
      Alert.alert('Try again. The email or password is incorrect.');
    } else {
      Alert.alert(error.message);
    }
  }
};
        

  return (
    <View style={styles.page}>
    <Text style={styles.header}>🌱 SmartSprout</Text>

<TextInput
style={styles.UserInput}
value={email}
placeholder="Enter your email"
onChangeText={setEmail}

/>


<TextInput 
  style={styles.UserInput} 
  value={password}
  placeholder="Enter your password"
  onChangeText={setPassword}
  secureTextEntry ={!showPassword}
/>  
<Text style={styles.showPasswordstyle} onPress={() => setShowPassword(!showPassword)}>
  {showPassword ? 'Hide password':'show password' }
</Text>

<View style={styles.loginSignupStyle}>
  <TouchableOpacity onPress={userLogin}>
  <Text style={styles.loginstyle}>Login</Text>
</TouchableOpacity>

<TouchableOpacity onPress={Signup}>
    <Text style={styles.signupStyle}>Create account</Text>
  </TouchableOpacity>

  </View>
  
  
</View>

);

};

const styles = StyleSheet.create({
    page:  {
        flex: 1,
        backgroundColor: '#e6f3ec',
        alignItems: 'center',
        justifyContent: 'center',
},

      logoContainer: {
        marginTop: 50,
        alignItems: 'center',
        marginBottom: 20,
    },

      header : { fontSize: 40,
      marginBottom: 10,
      fontWeight: 'bold'
    },
    loginButton: {
        width: '50%',
        marginTop: 20,
        
      },

      UserInput : {    
  backgroundColor: '#fff',  
  width :'80%',  
  borderRadius: 10,      
  padding: 15,       
  borderWidth: 1,                   
  marginBottom: 20,
  borderColor: '#ccc',
  
},
signupStyle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',

  },
  loginstyle: {
    fontSize: 20,
    color: 'black',
    marginRight: 40,
    fontWeight: 'bold',
 
  },
  loginSignupStyle :{
    justifyContent:  'center',
    flexDirection: 'row',
    width: '75%',
    alignItems: 'center',
    marginTop: 20,
  },
  showPasswordstyle: {
    color: 'black',
    textAlign: 'right',
    fontWeight: '400',
    marginBottom: 9,
    width: '75%',
  },
  
});

export default LoginScreen;