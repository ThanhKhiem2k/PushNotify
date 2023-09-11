import {NavigationContainer} from '@react-navigation/native';
import App1 from './src/App1';
import linking from './src/linking';
// import MainStack from '';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainStack from './src/navigation/stack';
export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <SafeAreaProvider>
        <MainStack />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
