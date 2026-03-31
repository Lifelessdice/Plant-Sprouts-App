import { Alert } from 'react-native';
import { auth, db } from '../firebase';

import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, StyleSheet, Text,TextInput } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Video } from 'expo-av';


const LoginScreen = ({ navigation }) => {
const[email, setEmail]=useState('');
const[password, setPassword]=useState('');
const [username, setUsername] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [showname, setname] = useState(false);


// Function for password reset emails 
const forgotPassword  = async () => {
if (!email.trim()){
Alert.alert('Enter your email');
 return;
}
try { await sendPasswordResetEmail(auth, email);
Alert.alert('A reset link has been sent to your email');
} catch (error) {
Alert.alert('error', error.message);
}
};


const  userLogin = async () => {
if (email.trim() === '') {
 Alert.alert(' Enter your email');
   return; }
  if (password.trim() === '') {
   Alert.alert(' Enter your password');
   return; }
try {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;

  await user.reload();
   if (!user.emailVerified) {
      await sendEmailVerification(user);
      Alert.alert('Email is not verified, a verification email has been sent')
      return;
    }

  {/* Welcome message with the user name*/}
  
  const userDocRef = doc(db, "accounts", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  let nameToDisplay = "Welcome!";
  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    if (userData.username && userData.username.trim() !== "") {
      nameToDisplay = `Welcome ${userData.username}!`;
    }
  }

    Alert.alert(nameToDisplay);


     navigation.navigate('Home');
    }
catch(error) {
if (error.code === 'auth/user-not-found') { 
 Alert.alert('Please create account. No account exists for this email');
} else if (error.code === 'auth/wrong-password') {
 Alert.alert('Incorrect password');
}
 else if (error.code === 'auth/invalid-credential') {
   Alert.alert('Try again. The email or password is incorrect.');
} else if (error.code === 'auth/invalid-email') {
   Alert.alert('Please enter a valid Email.');
}
else {
 Alert.alert(error.message);
}
}
};


{/* Function to create a new account */}

const Signup = async () => {
  if (email.trim() === '') {
    Alert.alert('Enter your email');
    return;
  }
  if (password.trim() === '') {
    Alert.alert('Enter your password');
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await sendEmailVerification(user);

    await setDoc(doc(db, "accounts", user.uid), {
      email: user.email,
      username: username,
      registeredTime: new Date().toISOString(),
    });

    Alert.alert('Your account is created successfully. Please log in 🌱');
    Alert.alert('Please verify your email. A verification link has been sent');

    //  Sign the user out so they stay on LoginScreen
    await signOut(auth);

    // Clear input fields
    setEmail('');
    setPassword('');
    setUsername('');
    setname(false); // Hide name input again

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('You already have an account, just log in');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Enter a valid Email');
    } else if (error.code === 'auth/wrong-password') {
      alert('Incorrect password.');
    } else if (error.code === 'auth/user-not-found') {
      Alert.alert('Please create account. No account exists for this email');
    } else if (error.code === 'auth/invalid-credential') {
      Alert.alert('Try again. The email or password is incorrect.');
    } else if (error.code === 'auth/weak-password') {
      Alert.alert('Password should be at least 6 characters');
    } else {
      Alert.alert(error.message);
    }
  }
};




return (
<View style={styles.wrapper}>
{/* Background video */}
<View style={styles.videoWrapper}>
 <Video
   source={require('../assets/animation3.mp4')}
   style={styles.video}
   isLooping
   shouldPlay
   isMuted
   resizeMode="cover"
 />
</View>


{/* Login form UI */}
<View style={styles.page}>
 <Text style={styles.header}>SmartSprout</Text>


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
   secureTextEntry={!showPassword}
 />
 {showname &&
 <TextInput
 style={styles.UserInput}
 value={username}
 placeholder="Enter your name optional"
 onChangeText={setUsername}
/>
}


 <Text style={styles.showPasswordstyle} onPress={() => setShowPassword(!showPassword)}>
   {showPassword ? 'Hide password' : 'Show password'}
 </Text>
 <Text style={styles.ForgetPasswordstyle} onPress=  {forgotPassword}>
 Forgot Password?
 </Text>


 <View style={styles.loginSignupStyle}>
 <CustomButton title="Login" onPress={userLogin} style={{marginRight:15}}/>
 <CustomButton title="Create account"  onPress = {() => {
 if (!showname) {
   setname(true);
 } else {
   Signup(); }
 }} />
 </View>
</View>
</View>
);
};


{/*Stylesheet all components*/}
const styles = StyleSheet.create({
wrapper: {
flex: 1,
backgroundColor: '#e6f3ec',
},
videoWrapper: {
position: 'absolute',
top: 0,
left: 0,
width: '100%',
height: '100%',
zIndex: 0,
},
video: {
width: '100%',
height: '100%',
position: 'absolute',
},
page: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
zIndex: 1,
paddingHorizontal: 20,
},
header: {
fontSize: 40,
marginBottom: 10,
fontWeight: 'bold',
color: '#202b4a',
},
UserInput: {
backgroundColor: '#fff',
width: '80%',
borderRadius: 10,
padding: 15,
borderWidth: 1,
marginBottom: 20,
borderColor: '#ccc',
},
loginSignupStyle: {
justifyContent: 'center',
flexDirection: 'row',
width: '75%',
alignItems: 'center',
marginTop: 20,
},

showPasswordstyle: {
color: '#202b4a',
textAlign: 'left',
fontWeight: '400',
marginBottom: 9,
marginTop: -10,
width: '75%',
fontWeight: 'bold',
},
ForgetPasswordstyle: {
color: '#202b4a',
textAlign: 'left',
fontWeight: '400',
marginBottom: 9,
marginTop: -10,
width: '75%',
fontWeight: 'bold',
},
});



export default LoginScreen;