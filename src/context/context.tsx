import React, { createContext, useRef } from "react";
// import { video_call_server_api } from "../api/video_call_server_api";
// import { onesignal_server_api } from "../api/onesignal_server_api";

export interface call_data_type{
  is_incomming_call_screen_displaying:boolean,
  is_call_screen_displaying:boolean,
  from_client_code:string,
  session_id:string,
  password:string
}

export interface context_data {
  progress_bar_loading_value: number,
  progress_bar_status_text: string,
  device_id: string,
  client_code: string,
  phone_number: string,
  firebase_token: string,
  // video_call_api: video_call_server_api,
  // onesignal_call_api: onesignal_server_api,
  call_data: call_data_type
}

export interface global_context_data {
  get: () => context_data,
  set: (value: context_data) => void
}

export const default_global_context_value: context_data = {
  device_id: "",
  client_code: "",
  firebase_token: "",
  phone_number: "",
  progress_bar_loading_value: 0,
  progress_bar_status_text: "",
  // video_call_api: new video_call_server_api(),
  // onesignal_call_api: new onesignal_server_api(),
  call_data:{
    from_client_code:"",
    session_id:"",
    password:"",
    is_incomming_call_screen_displaying:false,
    is_call_screen_displaying:false
  }
};

export const global_context = createContext<global_context_data>({
  set: (value: context_data) => { },
  get: () => {
    return default_global_context_value;
  }
});

const Global_context_provider = ({ children }: any) => {
  const data_ref = useRef<context_data>(default_global_context_value);
  const get = () => {
    return data_ref.current;
  };
  const set = (value: context_data) => {
    data_ref.current = value;
  }
  return (
    <>
      <global_context.Provider value={{ set, get }}>
        {children}
      </global_context.Provider>
    </>
  );
};

export interface global_data_type{
  context:global_context_data|null,
  lock_screen_notification_data:any|null
}

export const global_data={
  context:null,
  lock_screen_notification_data:null
}as global_data_type;

export default Global_context_provider;