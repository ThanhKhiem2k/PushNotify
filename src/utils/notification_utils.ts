import { Alert, Linking, Platform } from "react-native";
import notifee, { AndroidCategory, AndroidColor, AndroidImportance, AndroidVisibility, AuthorizationStatus, EventType } from '@notifee/react-native';
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { firebase_utils } from "./firebase_utils";
import { global_context_data, global_data } from "../context/context";

export const notification_utils = {
    display_incomming_call_notification: async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        await notifee.displayNotification({
            id: "shbfinance_video_call_notification",
            body: "Cuộc gọi đến từ SHBFinance",
            data: { firebase_message: JSON.stringify(remoteMessage) },
            android: {
                channelId: 'shbfinance_video_call_notification_strong_channel',
                onlyAlertOnce: false,
                importance: AndroidImportance.HIGH,
                visibility: AndroidVisibility.PUBLIC,
                autoCancel: false,
                vibrationPattern: [1000, 1000],
                lights: [AndroidColor.GREEN, 300, 600],
                sound: 'ringtone',
                smallIcon: 'ic_ringbot_notification',
                color: '#015faf',
                showChronometer: true,
                ongoing: true,
                category: AndroidCategory.CALL,
                fullScreenAction: {
                    id: 'default',
                },
                pressAction: {
                    id: 'default',
                },
                actions: [
                    {
                        title: 'Mở app',
                        pressAction: {
                            id: 'open_app',
                            launchActivity: 'default',
                        }
                    },
                    {
                        title: 'Bỏ qua',
                        pressAction: {
                            id: 'cancel',
                        }
                    },
                ],
                timeoutAfter: 180000,
            }
        });
    },
    display_light_notification:async (body_str:string)=>{
        await notifee.displayNotification({
            id: "shbfinance_video_call_notification",
            body: body_str,
            android: {
                channelId: 'shbfinance_video_call_notification_light_channel',
                importance: AndroidImportance.MIN,
                visibility: AndroidVisibility.SECRET,
                smallIcon: 'ic_ringbot_notification',
                color: '#015faf',
                showChronometer: false,
                ongoing: false,
                timeoutAfter: 500,
            }
        });
    },
    check_notification_that_open_app: async (context: global_context_data) => {
        try {
            let initial_notification = await notifee.getInitialNotification();
            notifee.cancelAllNotifications();
            if (!initial_notification && global_data.lock_screen_notification_data?.detail) {
                initial_notification = global_data.lock_screen_notification_data.detail;
            }
            global_data.lock_screen_notification_data = null;
            console.log("initial_notification", JSON.stringify(initial_notification));
            if (initial_notification &&
                initial_notification.notification?.data?.firebase_message &&
                (!initial_notification.pressAction || (initial_notification.pressAction?.id ?? "") === "open_app")) {
                // let rs = await firebase_utils.handle_message_async(context, zoom, JSON.parse(initial_notification.notification.data.firebase_message.toString()))
                // return rs;
            }
        } catch (error) {
            console.error(error);
        }
        return true;
    },
    handle_notification_background_events: () => {
        notifee.onBackgroundEvent(async (data) => {
            if (data) {
                if (data.type === EventType.DELIVERED && !data.detail?.pressAction) {
                    global_data.lock_screen_notification_data = data;
                } else {
                    global_data.lock_screen_notification_data = null;
                    if (data.type === EventType.ACTION_PRESS) {
                        await notifee.cancelAllNotifications();
                    }
                }
            }
        });
    },
    handle_notification_foreground_events: (context: global_context_data) => {
        notifee.onForegroundEvent(async (data) => {
            if (data.type === EventType.ACTION_PRESS) {
                await notifee.cancelAllNotifications();
                if (data.detail.pressAction?.id === "open_app" && data.detail?.notification?.data?.firebase_message) {
                    // await firebase_utils.handle_message_async(context, zoom, JSON.parse(data.detail.notification.data.firebase_message.toString()));
                }
            }
        });
    },
    create_firebase_notification_channel: async function () {
        if (Platform.OS === 'android') {
            try {
                await notifee.createChannel({
                    id: 'shbfinance_video_call_notification_strong_channel',
                    name: 'SHBFinance Video Call Notification (S)',
                    importance: AndroidImportance.HIGH,
                    visibility: AndroidVisibility.PUBLIC,
                    vibration: true,
                    vibrationPattern: [1000, 1000],
                    lights: true,
                    lightColor: AndroidColor.GREEN,
                    sound: 'ringtone',
                    badge: false,
                });
                await notifee.createChannel({
                    id: 'shbfinance_video_call_notification_light_channel',
                    name: 'SHBFinance Video Call Notification (L)',
                    importance: AndroidImportance.MIN,
                    visibility: AndroidVisibility.SECRET,
                    vibration: false,
                    lights: false,
                    sound: undefined,
                    badge: false,
                });
                console.log("create_notification_channel ok");
            } catch (error: any) {
                console.error("create_notification_channel", error.message);
            }
        }
    },
    request_ios_notification_permission: async function () {
        if (Platform.OS === 'ios') {
            try {
                if (Platform.OS === 'ios') {
                    const settings = await notifee.requestPermission(
                        {
                            sound: true,
                            criticalAlert: true,
                            alert: true,
                            announcement: false,
                            badge: false,
                            carPlay: true,
                            provisional: false
                        }
                    );

                    if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
                        Alert.alert("Thiếu quyền", "App cần quyền notification để hoạt động được", [{
                            text: "Mở Settings", onPress: () => {
                                Linking.openSettings();
                            }
                        }]);
                    }
                }
            } catch (error: any) {
                console.error("request_ios_notification_permission", error.message);
                Alert.alert("Lỗi request_ios_notification_permission", error.message, [], { cancelable: false });
            }
        }
    }
};