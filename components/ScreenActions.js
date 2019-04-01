import React from 'react';
import { Button } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { View, TouchableOpacity } from 'react-native';

export const ScreenActions = (props) => {
    return (
      <View style={{ marginTop: 40, marginBottom: 40, alignItems: 'center' }}>
        <View>
          <Button title="SAVE" titleStyle={{ fontSize: 24 }}
            disabled={!props.canSave}
            onPress={props.onPressSave}
            containerStyle={{ width: 100 }}
          />
        </View>
        <TouchableOpacity style={styles.option}>
          <Button title={"View " + props.itemName + " History"} titleStyle={{ fontSize: 20 }} type='clear'
            onPress={() => props.navigation.navigate(props.itemName + 'History')} />
        </TouchableOpacity>
      </View>
    )
  }
