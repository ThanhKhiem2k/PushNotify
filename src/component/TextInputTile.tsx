import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors_global} from '../styles';
import DatePicker from 'react-native-date-picker';
import {useEffect, useState} from 'react';

export interface TextInputTileProps {
  title: string;
  typeData: boolean;
  input: string;
}

export function TextInputTile(_props: TextInputTileProps) {
  const {title, typeData, input} = _props;
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [valueInput, setValueInput] = useState('');

  useEffect(() => {
    if(typeData){
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      setValueInput(`${day}/${month}/${year}`);
    }
  }, [date]);
  useEffect(() => {
    if(!typeData) setValueInput(input);
  }, [input])
  

  return (
    <View style={styles.textInputTile}>
      <View style={styles.viewTitleText}>
        <Text style={styles.textTitle}>{title}</Text>
      </View>
      {typeData && valueInput !== '' ? (
        <TextInput
          style={styles.input}
          textAlign="center"
          editable={false}
          value={valueInput}
        />
      ) : (
        <TextInput
          style={styles.input}
          textAlign="center"
          onChangeText={text => {
            setValueInput(text);
          }}
          value={valueInput}
        />
      )}

      {typeData && (
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={{marginEnd: -10, marginStart: 5}}>
          <Image
            source={require('../assets/Icon/calendar-icon.png')}
            resizeMode="cover"
            style={{height: 50, width: 50}}
          />
        </TouchableOpacity>
      )}
      <DatePicker
        modal
        mode={'date'}
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInputTile: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    color: colors_global.black,
    flex: 1,
    marginStart: 30,
    borderRadius: 7,
    alignSelf: 'center',
  },
  viewTitleText: {width: '35%'},
  textTitle: {textAlign: 'center', color: colors_global.black, fontSize: 16},
});
