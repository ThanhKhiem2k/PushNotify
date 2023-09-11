/**
 * @format
 */
//@ts-check
import { AppRegistry, Linking, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { onDisplayNotification } from './src/App1';

AppRegistry.registerComponent(appName, () => App);
// Kill state Notification Listener.
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // Your code to handle notifications in killed state. For example
  onDisplayNotification(remoteMessage);
  console.log('Killed state notification.', remoteMessage)
});
notifee.onBackgroundEvent(async data => {
});
