/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  AppState,
  BackHandler,
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {CirclesLoader} from 'react-native-indicator';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {colors_global, styles_global} from './styles';
import {TextInputTile} from './component/TextInputTile';
import {
  PERMISSIONS,
  Permission,
  PermissionStatus,
  RESULTS,
  checkMultiple,
  openSettings,
  requestMultiple,
  requestNotifications,
} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import RadioGroup, {RadioButton} from 'react-native-radio-buttons-group';
// import {notificationListener} from './utils/firebase_helper';
import ConnectAPIServer from './api/server_api';
import {useNavigation} from '@react-navigation/native';
import notifee, {AndroidImportance} from '@notifee/react-native';
import GlobalVariable from './utils/GlobalVariable';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App1(): JSX.Element {
  const globalValue = GlobalVariable.get();
  const navigation = useNavigation<any>();
  const isDarkMode = useColorScheme() === 'dark';
  const [numberMessage, setNumberMessage] = useState<string>('');
  const [topicCode, setTopicCode] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [selectedId, setSelectedId] = useState<string>();
  const data = useMemo(
    () => [
      {
        id: '1',
        label: 'Quan Tâm',
      },
      {
        id: '2',
        label: 'Không Quan Tâm',
      },
      {
        id: '3',
        label: 'Sẽ Cân Nhắc',
      },
    ],
    [],
  );
  const [showContent, setShowContent] = useState<Number>(1);
  const handleBackPress = () => {
    setShowContent(1);
    setNumberMessage('');
    return true;
  };

  useEffect(() => {
    changeExtensionData('sync');
    requestStoragePermission();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      onDisplayNotification(remoteMessage);
      console.log('Message handled in the background!', remoteMessage);
      setNumberMessage(remoteMessage!.data!.phoneNumber);
      setShowContent(2);
      setTimeout(() => {
        setShowContent(3);
      }, 500);
      console.log(
        'A new FCM message arrived!',
        JSON.stringify(remoteMessage!.data!.phoneNumber),
      );
    });
    const listenMessaging = messaging().onMessage(async remoteMessage => {
      setNumberMessage(remoteMessage!.data!.phoneNumber);
      setShowContent(2);
      setTimeout(() => {
        setShowContent(3);
      }, 500);
      console.log(
        'A new FCM message arrived!',
        JSON.stringify(remoteMessage!.data!.phoneNumber),
      );
    });
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      // subscription;
      listenMessaging;
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  useEffect(() => {
    Keyboard.dismiss();
  }, [showContent]);
  useEffect(() => {
    if (globalValue !== '') {
      setNumberMessage(globalValue);
      setShowContent(2);
      setTimeout(() => {
        setShowContent(3);
      }, 500);
    }
  }, [globalValue]);

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1500);
  };
  const platformPermissions = {
    android: [
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ],
  };
  const requestStoragePermission = async () => {
    const permissions = platformPermissions[Platform.OS];
    let notGranted: Permission[] = [];
    checkMultiple(permissions).then(
      (statuses: Record<Permission[number], PermissionStatus>) => {
        permissions.map((p: Permission) => {
          const status = statuses[p];
          console.log('status', status);
          console.log(p);
          if (status === RESULTS.DENIED) {
            notGranted.push(p);
          } else if (status === RESULTS.BLOCKED) {
            console.log('Quyền sử dụng Notifications bị từ chối.');
            Alert.alert(
              'Yêu cầu quyền',
              'Ứng dụng cần quyền gửi thông báo để hiển thị thông báo mới.',
              [{text: 'OK', onPress: () => openSettings()}],
            );
          }
        });
        try {
          notGranted.length && requestMultiple(notGranted);
        } catch (error) {
          console.log('error');
        }
      },
    );
  };
  const [extensionData, setExtensionData] = useState<string[]>([]);
  const changeExtensionData = (status: string, value: string[] = []) => {
    // console.log(value.toString());
    if (status === 'sync') {
      AsyncStorage.getItem('ExtensionData').then(valueCurrent => {
        if (valueCurrent !== null) {
          const stringArrayExtension = valueCurrent.split(',');
          console.log('stringArrayExtension', stringArrayExtension);
          setExtensionData(stringArrayExtension);
        }
      });
    } else if (status === 'add') {
      // console.log(value.toString());
      AsyncStorage.setItem('ExtensionData', value.toString());
    } else {
    }
  };
  useEffect(() => {
    if (extensionData.length !== 0) changeExtensionData('add', extensionData);
  }, [extensionData]);
  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
        paddingHorizontal: 50,
      }}>
      <Text style={{fontSize: 18}}>{item}</Text>
      <TouchableOpacity onPress={() => handleDelete(item)}>
        <Text style={{color: 'red'}}>X</Text>
      </TouchableOpacity>
    </View>
  );
  const handleDelete = (item: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this extension?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setShowContent(2);
            try {
              messaging()
                .unsubscribeFromTopic(item)
                .then(() => {
                  console.log('Unsubscribed to topic:', topicCode);
                  const newArray = extensionData.filter(i => i !== item);
                  setExtensionData(newArray);
                  setShowContent(3);
                });
            } catch (error) {}
            // const updatedExtensions = extensions.filter(ext => ext.id !== id);
            // setExtensions(updatedExtensions);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      {showNotification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Đã lưu thông tin!</Text>
        </View>
      )}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {showContent === 2 ? (
        <View
          style={[
            styles.connectingWrapper,
            {zIndex: showContent === 2 ? 2 : 0},
          ]}>
          <CirclesLoader size={50} />
          <Text style={styles.connectingText}>Loading...</Text>
        </View>
      ) : null}

      <View style={styles_global.flex1}>
        <View style={[styles.content, {zIndex: showContent === 1 ? 1 : 0}]}>
          <Text style={styles.title}>Extension</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderTopColor:
                  topicCode === '' ? '#587062' : colors_global.emerald,
                borderBottomColor:
                  topicCode === '' ? '#587062' : colors_global.emerald,
              },
            ]}
            onChangeText={setTopicCode}
            placeholder="Nhập mã Extension..."
            placeholderTextColor={'#cbcbcb'}
          />
          <TouchableOpacity
            disabled={topicCode === '' ? true : false}
            style={[styles.button, {opacity: topicCode === '' ? 0.4 : 1}]}
            onPress={() => {
              setShowContent(3);
              try {
                messaging()
                  .subscribeToTopic(topicCode)
                  .then(() => {
                    console.log('Subscribed to topic:', topicCode);
                    setExtensionData([...extensionData, topicCode]);
                  });
              } catch (error) {}
            }}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.popupInf,
            {zIndex: showContent === 3 || showContent === 2 ? 1 : 0},
          ]}>
          <TextInputTile title={'Họ/Tên'} typeData={false} input={''} />
          <TextInputTile
            title={'Số ĐT'}
            typeData={false}
            input={numberMessage}
          />
          {data.map(item => {
            return (
              <RadioButton
                key={item.id}
                id={item.id}
                onPress={() => {
                  setSelectedId(item.id);
                }}
                label={item.label}
                labelStyle={styles.TextRadio}
                containerStyle={styles.boxStyleRadio}
                selected={selectedId === item.id ? true : false}
              />
            );
          })}

          <TextInputTile title={'Lịch Gọi Lại'} typeData={true} input={''} />
          <View style={[styles_global.flex1, {width: '100%', margin: 20}]}>
            <Text style={{fontSize: 20, marginStart: 20}}>
              Extension List:{' '}
            </Text>
            <FlatList
              data={extensionData}
              renderItem={renderItem}
              keyExtractor={index => index}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonSave}
            onPress={() => {
              handleShowNotification();
            }}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export async function onDisplayNotification(remoteMessage) {
  const channelId = await notifee.createChannel({
    id: 'my_channel_id',
    name: 'My Notification Channel',
    importance: AndroidImportance.HIGH,
  });
  GlobalVariable.set(remoteMessage!.data!.phoneNumber);
  // Display a notification
  await notifee.displayNotification({
    title: remoteMessage!.data!.title,
    body: remoteMessage!.data!.body,
    android: {
      channelId,
      smallIcon: 'ic_small_icon',
      pressAction: {
        id: 'open_activity',
        launchActivity: 'com.pushnotify.MainActivity',
      },
    },
  });
}

const styles = StyleSheet.create({
  notification: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    width: '100%',
    zIndex: 99,
  },
  notificationText: {
    color: 'white',
  },
  connectingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
  },
  connectingWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 20,
    backgroundColor: colors_global.dark,
    opacity: 0.9,
  },
  TextRadio: {
    fontSize: 16,
    width: '90%',
    textAlign: 'center',
    color: colors_global.black,
  },
  boxStyleRadio: {
    marginStart: '35%',
    width: '50%',
  },
  margin10: {margin: 10},
  popupInf: {
    backgroundColor: colors_global.white,
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    paddingTop: 20,
    alignItems: 'center',
  },
  content: {
    backgroundColor: colors_global.midnightBlue,
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    paddingTop: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderTopColor: colors_global.emerald,
    borderBottomColor: colors_global.emerald,
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: colors_global.white,
  },
  title: {fontSize: 30, color: colors_global.white, margin: 20},
  button: {
    backgroundColor: colors_global.turquoise,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: colors_global.turquoise,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonSave: {
    borderRadius: 10,
    paddingVertical: 12,
    width: '30%',
    marginBottom: 50,
    backgroundColor: colors_global.turquoise,
    paddingHorizontal: 20,
    shadowColor: colors_global.turquoise,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default App1;
