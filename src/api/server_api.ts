import messaging from '@react-native-firebase/messaging';

export default class ConnectAPIServer {
  url: string;
  FirebaseServerKey: string;
  token: string;

  constructor() {
    this.url = 'https://fcm.googleapis.com/fcm/send';
    this.FirebaseServerKey = 'AAAAGrQgKzE:APA91bF-za6CdbH9YKuZWEPedsqwWlTUbYZUo5JqN7im6z6WIZqU_ad61B2ppDh7lbdZhQTzYpXU7lRqg-29RhZaR7HtmXhsuToF-Art_cfQL3qeNPh-daxsvDR_OIhiIqkZRL2MIiJ2';
    this.token = 'dFzgTppJQluOJ8erjL3Jck:APA91bFm9dXjD3Sam0rMf6fMeXLeDeiAcwgX_UjZ0UBXh4IH299C9Alvu5Fb-vp2aw7vT67jX_iqV6waKS5z5k_SsDmPIHYSg-awrRXt_mAYO1YVJDsrg3jqYG9rilXci9mvKEJ6UZwo'
  }

  async getTokenMessaging() {
    try {
      const tokenHere =  await messaging().getToken();
      console.log(tokenHere);
      return tokenHere
    } catch (error) {
      console.error(error);
    }
    
  }

  async sendFCMNotification() {   
    this.getTokenMessaging().then(async (tokenHere) => {
      try {
        const notificationData = {
          data: {
            number: '0795488801821'
          },
          to: '/topics/1111',
          direct_boot_ok: true,
        };
        const response = await fetch(this.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `key=${this.FirebaseServerKey}`,
          },
          body: JSON.stringify(notificationData),
        }).then(()=>{
          console.log('Push notify successful!');
          
        })
      } catch (error) {
        console.error('Lỗi khi gửi thông điệp FCM:', error);
        throw error;
      }
    })
  }
}