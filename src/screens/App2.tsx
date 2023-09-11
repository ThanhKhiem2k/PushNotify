import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { View, Text, BackHandler } from 'react-native';

export interface App2Props {
}

export function App2 () {
    const navigation = useNavigation<any>();
    const handleBackPress = () => {
        navigation.goBack();
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
      }, []);
    
    return (
      <View style={{flex: 1, backgroundColor: 'red'}}>
         <Text>App</Text>
      </View>
    );
}

