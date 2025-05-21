import { auth , db} from '../firebase';
import { signOut , updatePassword,updateEmail,sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider, } from 'firebase/auth';
import React, { useState,useEffect } from 'react';
import{ View, Text, StyleSheet,TextInput,Alert }from 'react-native';
import { Video } from 'expo-av';
import CustomButton from '../components/CustomButton';
import { doc, updateDoc, getDoc,setDoc } from 'firebase/firestore';
import TopBar from '../components/TopBar';



const ProfileScreen = ({ navigation }) => {
const [editProfile, seteditProfile] = useState(false);
const [showAccount, setAccount] = useState(false);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [username, setUsername] = useState('');
const [newPassword, setnewPassword] = useState('');
const [oldEmail, setoldEmail] = useState('');


// Sign out Function
const UserSignOut = () => {
signOut(auth)
.catch((error) => {
 Alert.alert('logout failed.');
});
};




// Get current user information  
useEffect(() => {
const getUserinformation = async () => {
const user = auth.currentUser;
await user.reload()
if (user) {
setEmail(user.email);
setoldEmail(user.email);
const userData = doc(db, 'accounts', user.uid);
const data  = await getDoc(userData);
if (data.exists()) {
const dataInformaton = data.data();
setUsername(dataInformaton.username || '');
}
} else {
Alert.alert('Not Logged in');
}
};




getUserinformation();
}, []);






// Function for user information update
const  changeUserInfo = async () => {
const user = auth.currentUser;




if (!user) {
 Alert.alert('Not Logged in');
 return;
}
if (password.trim() === '') {
 Alert.alert('Enter your current password');
 return;
}




try {
const userCredential = EmailAuthProvider.credential(user.email, password);
await reauthenticateWithCredential(user, userCredential);




await user.reload();


if (!user.emailVerified) {
await sendEmailVerification(user);
setEmail(oldEmail);
Alert.alert('Please verify your current email before changing. A verification link has been sent.');
return;
}




if (newPassword.trim() !== '') {
await updatePassword(user, newPassword);
Alert.alert('Password updated successfully 🌱');
setnewPassword('');
 }


// Update or create user information document in Firestore

const userInformation = doc(db, 'accounts', user.uid);
const currentData = await getDoc(userInformation);
if (!currentData.exists()) {
await setDoc(userInformation, {
 username: username,
 email: user.email,
 registeredTime: new Date().toISOString(),
});
Alert.alert('You changed your username successfully🌱');
}
else {
const currentName = currentData.data().username || '';
if (username.trim() !== '' && username !== currentName) {
 await updateDoc(userInformation, { username: username });
 Alert.alert('You changed your username successfully 🌱');
}


}
// Reset UI state after updates


setAccount(false);
seteditProfile(false);
setPassword('');






} catch (error) {
  if (error.code === 'auth/invalid-credential') {
   Alert.alert('Incorrect Password', 'Please try again.');
} else {
Alert.alert('Error', error.message);




}
}
};


// Component UI
return (
   <View style={styles.wrapper}>
     {/* arrow return button */}
     <TopBar
     title="Account"
     onBackPress={() => navigation.goBack()} />
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




{/* Profile */}
<View style={styles.page}>
<Text style={styles.header}>SmartSprout 🌱</Text>

{/* Settings button */}
{!editProfile &&!showAccount&&(
<View style={styles.spaceBetween}>
<CustomButton
title="Settings ⚙️"
onPress={() => {
setAccount(true);
seteditProfile(false);
}}
/>
<CustomButton
title=" Logout 🔒 "
onPress={UserSignOut}
/>
</View>
)}




{showAccount && ! editProfile && (
<View style={styles.middleView}>
<Text style = {styles.accountInformationStyle}>Your account information</Text>
<Text style={styles.textStyle}>Email: {email}</Text>
<Text style={styles.textStyle}>Username: {username}</Text>








<CustomButton
title="Change Information"
onPress={() => {
 seteditProfile(true);
}}
/>
</View>
)}
{ editProfile   && (
<View style={ styles.middleView}>
     <TextInput
       placeholder="Your new Username"
       style={styles.input}
       value={username}
       onChangeText={setUsername}
/>
      <TextInput
       placeholder="Your new password optional:"
       style={styles.input}
       value={newPassword}
       onChangeText={setnewPassword}
 
     />
      <TextInput
       placeholder="Enter your current password"
       style={styles.input}
       value={password}
       onChangeText={setPassword}
     />
     <CustomButton title="Save" onPress={changeUserInfo} />
     </View>
     )}
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
middleView: {
alignItems: 'center',
paddingHorizontal: 20,
width: '100%',
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
setting: {
 fontSize: 20,
 color: '#202b4a',
 marginRight: 40,
 fontWeight: 'bold',
},
input: {
 backgroundColor: '#fff',
 width: '80%',
 borderRadius: 10,
 padding: 15,
 borderWidth: 1,
 marginBottom: 20,
 borderColor: '#ccc',
},




spaceBetween : {
 justifyContent:'space-between',
 height: 130,
 alignItems: 'center',
 flexDirection: 'row',
 width: '85%',
 gap: 10,
 marginTop: 20,
},






textStyle: {
 backgroundColor: '#fff',
 width: '100%',
 borderRadius: 10,
 padding: 15,
 borderWidth: 1,
 marginBottom: 20,
 borderColor: '#ccc',
 
},
text : {
 fontSize: 20,
 color: '#202b4a',
 marginRight: 40,
 fontWeight: 'bold',
},




accountInformationStyle: {
   fontSize: 20,
   fontWeight: 'bold',
   color: '#202b4a',
   textAlign: 'center', 
   padding: 20,
   width: '100%',         
 },


backButtonArrow :{
backgroundColor: '#fff',
position: 'absolute',
padding: 15,
top: 40,
left: 25,
borderRadius: 15,
zIndex: 25,
},


});




export default ProfileScreen;