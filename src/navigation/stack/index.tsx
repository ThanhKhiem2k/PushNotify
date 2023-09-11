import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppState,
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {useNavigation} from '@react-navigation/native';
import App1 from '../../App1';
import {App2} from '../../screens/App2';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

export type IndexProps = {};
const Stack = createNativeStackNavigator();
// const sizeDevices = Dimensions.get('window').height < 650 ? 'small' : 'big';

const MainStack: React.FC<IndexProps> = ({}) => {
  const navigation = useNavigation<any>();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
          setTimeout(() => {
            console.log('App has come to the foreground!');
          }, 5000);
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('AppState', appState.current);
      });
      const focus = navigation.addListener('focus', () => {
      });

      return () => {
        subscription.remove();
      };
    }, []),
  );
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName={'App1'}
        screenOptions={{
          headerShown: true,
          // animation: 'none',
          // headerStyle: {
          // backgroundColor: Colors.primary,
          // },
        }}>
        <Stack.Screen
          name="App1"
          component={App1}
          options={{
            headerShown: false,
            // headerStyle: {
            //   backgroundColor: Colors.primary,
            // },
          }}
        />
        <Stack.Screen
          name="App2"
          component={App2}
          options={{
            headerShown: false,
            // headerStyle: {
            //   backgroundColor: Colors.primary,
            // },
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default MainStack;
