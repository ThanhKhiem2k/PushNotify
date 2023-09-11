import messaging from '@react-native-firebase/messaging';
// import { Notifications } from 'react-native-notifications';
// import { Linking } from 'react-native';
// import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import {PermissionsAndroid} from 'react-native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
export const notificationListener = () => {
    messaging().registerDeviceForRemoteMessages();
    messaging().onMessage(async remoteMessage => {
        console.log(
          'A new FCM message arrived!'
        );
      });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const uri = 'myapp://PushNotify/notifications';
      console.log('Message handled in the background!', remoteMessage);
      // Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      //   // Xử lý thông báo đẩy tại đây
      //   // Mở ứng dụng tự động khi cần
      //   completion({ alert: true, sound: true, badge: true });
      
      //   // Kiểm tra nếu ứng dụng không ở trạng thái hoạt động (background hoặc inactive), thì mở ứng dụng
      //   if (AppState.currentState !== 'active') {
      //     Linking.openURL(uri); // Thay 'app://' bằng scheme của ứng dụng của bạn
      //   }
      // });
      // Linking.canOpenURL(uri);
      // AppRegistry.registerComponent(appName, () => App);
      // RNNotificationCall.displayNotification();
      // Linking.openURL('myapp://PushNotify/notifications');
      // Linking.canOpenURL(uri)
      //   .then((supported) => {
      //     if (supported) {
      //       return Linking.openURL(uri);
      //     } else {
      //       console.log(`Không thể mở: ${uri}`);
      //     }
      //   })
      //   .catch((error) => console.error('Lỗi:', error));
    });
}
