import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import messaging from '@react-native-firebase/messaging';
import { notification_utils } from "./notification_utils";
import { global_context_data, global_data } from "../context/context";
import moment from "moment";
import notifee from '@notifee/react-native';
import { Alert, NativeEventEmitter, NativeModules, Platform } from "react-native";
// import { ChangeScreen } from "./navigation_utils";

export const firebase_utils = {
  handle_background_message: () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (remoteMessage && remoteMessage.data && remoteMessage.data.notification) {
        console.log("firebase setBackgroundMessageHandler", remoteMessage);
        try {
          await notifee.cancelNotification("shbfinance_video_call_notification");
          switch (remoteMessage.data.type) {
            case "incomming_call":
              if (remoteMessage.data.from_client_code && remoteMessage.data.session_id && remoteMessage.data.password) {
                if (global_data.context) {
                  let gdata = global_data.context.get();
                  if (gdata.client_code) {
                    if (remoteMessage.data.to_client_code === gdata.client_code) {
                      if (gdata.call_data.is_incomming_call_screen_displaying ||
                        gdata.call_data.is_call_screen_displaying) {
                        // gdata.video_call_api.user_busy_async(gdata.client_code, remoteMessage.data.session_id).then(z => console.log(z)).catch(e => console.error(e));
                        await notification_utils.display_light_notification("Đang trong cuộc gọi");
                      } else {
                        await notification_utils.display_incomming_call_notification(remoteMessage);
                      }
                    }else{
                      await notification_utils.display_light_notification("Nhận được dữ liệu không hợp lệ");
                    }
                  } else {
                    await notification_utils.display_incomming_call_notification(remoteMessage);
                  }
                } else {
                  await notification_utils.display_incomming_call_notification(remoteMessage);
                }
              }else{
                await notification_utils.display_light_notification("Nhận được dữ liệu không hợp lệ");
              }
              break;
            case "call_accepted_inform":
              if (global_data.context) {
                let gdata = global_data.context.get();
                if (remoteMessage.data.to_client_code === gdata.client_code) {
                  if (remoteMessage.data?.token !== gdata.firebase_token) {
                    if (gdata.call_data.session_id === remoteMessage.data.session_id) {
                      try {
                        // gdata.zoom_context?.leaveSession();
                      } catch (error) {
                      }
                    }
                    // ChangeScreen('Main_screen');
                  }
                }
              }
              await notification_utils.display_light_notification("Cuộc gọi đã được tiếp nhận");
              break;
            case "call_canceled_inform":
              if (global_data.context) {
                let gdata = global_data.context.get();
                if (remoteMessage.data.to_client_code === gdata.client_code) {
                  try {
                    if (gdata.call_data.session_id === remoteMessage.data.session_id) {
                      // gdata.zoom_context?.leaveSession();
                    }
                  } catch (error) {
                  }
                  // ChangeScreen('Main_screen');
                }
              }
              await notification_utils.display_light_notification("Cuộc gọi đã bị hủy");
              break;
            case "call_denied_inform":
              if (global_data.context) {
                let gdata = global_data.context.get();
                if (remoteMessage.data.to_client_code === gdata.client_code) {
                  if (gdata.call_data.session_id === remoteMessage.data.session_id) {
                    try {
                      // gdata.zoom_context?.leaveSession();
                    } catch (error) {
                    }
                  }
                  // ChangeScreen('Main_screen');
                }
              }
              await notification_utils.display_light_notification("Cuộc gọi đã bị từ chối");
              break;
            case "call_ended_inform":
              if (global_data.context) {
                let gdata = global_data.context.get();
                if (remoteMessage.data.from_client_code === gdata.client_code || remoteMessage.data.to_client_code === gdata.client_code) {
                  if (gdata.call_data.session_id === remoteMessage.data.session_id) {
                    try {
                      // gdata.zoom_context?.leaveSession();
                    } catch (error) {
                    }
                    // ChangeScreen('Main_screen');
                    // Alert.alert("Thông báo", "Cuộc gọi đã kết thúc", [{ text: "OK", onPress: () => { } }]);
                  }
                }
              }
              await notification_utils.display_light_notification("Cuộc gọi đã kết thúc");
              break;
            case "call_busy_inform":
              if (global_data.context) {
                let gdata = global_data.context.get();
                if (remoteMessage.data.to_client_code === gdata.client_code) {
                  if (gdata.call_data.session_id === remoteMessage.data.session_id) {
                    try {
                      // gdata.zoom_context?.leaveSession();
                    } catch (error) {
                    }
                  }
                  // ChangeScreen('Main_screen');
                }
              }
              await notification_utils.display_light_notification("Cuộc gọi đã bị hủy");
              break;
            default:
              break;
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  },
  handle_message_async: async (context: global_context_data, payload: FirebaseMessagingTypes.RemoteMessage) => {
    console.log("handle fbase message", payload);
    if (!payload || !payload.data || !payload.data.type || !payload.data.session_id || !payload.data.date_created){
      console.log("Invalid data");
      return true;
    }
    try {
      let diff_seconds = moment.utc().diff(moment.utc(payload.data.date_created), "seconds")
      if (isNaN(diff_seconds)) {
        console.error("isNaN diff_seconds");
        return true;
      }
      if (diff_seconds > 500){
        console.log("Too late");
        return true;
      }

      let gdata = context.get();
      switch (payload.data.type) {
        case "incomming_call":
          {
            console.log("Process incomming_call");
            if (payload.data.to_client_code === gdata.client_code) {
              if (payload.data.from_client_code && payload.data.session_id && payload.data.password) {
                if (payload.data.session_id === gdata.call_data.session_id) {
                  console.log("Duplicate session id");
                  break;
                }
                if (gdata.call_data.is_incomming_call_screen_displaying || gdata.call_data.is_call_screen_displaying) {
                  console.log("I'm busy");
                  // gdata.video_call_api.user_busy_async(gdata.client_code, payload.data.session_id).then(z => console.log(z)).catch(e => console.error(e));
                } else {
                  gdata= context.get();
                  gdata.call_data.from_client_code=payload.data.from_client_code;
                  gdata.call_data.session_id=payload.data.session_id;
                  gdata.call_data.password=payload.data.password;
                  context.set(gdata);
                  console.log("Change screen Incomming_call_screen");
                //   ChangeScreen('Incomming_call_screen', {
                //     from_client_code: payload.data.from_client_code,
                //     session_id: payload.data.session_id,
                //     password: payload.data.password,
                //     auto_accept: payload.data.auto_accept,
                //   });
                }
              }else{
                console.log("Not enough information");
              }
            }else{
              console.log("Not my client code");
            }
            break;
          }
        case "call_accepted_inform":
          {
            if (payload.data.to_client_code === gdata.client_code) {
              if (payload.data?.token !== gdata.firebase_token) {
                if (gdata.call_data.session_id === payload.data.session_id) {
                  try {
                    // zoom.leaveSession();
                  } catch (error) {
                  }
                }
                // ChangeScreen('Main_screen');
              }
            }
            break;
          }
        case "call_canceled_inform":
          {
            if (payload.data.to_client_code === gdata.client_code) {
              try {
                if (gdata.call_data.session_id === payload.data.session_id) {
                  // zoom.leaveSession();
                }
              } catch (error) {
              }
              if (Platform.OS === "ios") {
                let pushKitModule = NativeModules.PushkitModule;
                pushKitModule?.endCall()
                // pushKitModule?.endOfCall()
              }
              // ChangeScreen('Main_screen');
            }
            break;
          }
        case "call_denied_inform":
          {
            if (payload.data.to_client_code === gdata.client_code) {
              if (gdata.call_data.session_id === payload.data.session_id) {
                try {
                  // zoom.leaveSession();
                } catch (error) {
                }
              }
              if (Platform.OS === "ios") {
                let pushKitModule = NativeModules.PushkitModule;
                pushKitModule?.endCall()
                // pushKitModule?.endOfCall()
              }
              // ChangeScreen('Main_screen');
            }
            break;
          }
        case "call_ended_inform":
          {
            console.log("call_ended_inform",JSON.stringify(gdata));
            if (payload.data.from_client_code === gdata.client_code || payload.data.to_client_code === gdata.client_code) {
              if (gdata.call_data.session_id === payload.data.session_id) {
                try {
                  // zoom.leaveSession();
                } catch (error) {
                }
                if (Platform.OS === "ios") {
                  let pushKitModule = NativeModules.PushkitModule;
                  pushKitModule?.endCall()
                  // pushKitModule?.endOfCall()
                }
                // ChangeScreen('Main_screen');
              }
            }
            break;
          }
        case "call_busy_inform":
          {
            if (payload.data.to_client_code === gdata.client_code) {
              if (gdata.call_data.session_id === payload.data.session_id) {
                try {
                  // zoom.leaveSession();
                } catch (error) {
                }
              }
              // ChangeScreen('Main_screen');
            }
            break;
          }
        default:
          break;
      }
    } catch (error) {
      console.error("diff_seconds", error);
      return true;
    }
    return false;
  }
};
