import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { styles, Colors } from '../assets/styles/style';
import { TextArea, WidgetHeader } from './FormFields';

export class DreamComponent extends React.Component {
  onChangeText(note) {
    this.props.onChange({ ...this.props.value, note });
  }

  render() {
    return (
      <View style={styles.formRow}>
        <TextArea
          placeholder={'I was dreaming I could fly...'}
          value={this.props.value ? this.props.value.note : null}
          onChangeText={(note) => { this.onChangeText(note) }}
        />
      </View>
    );
  }
}