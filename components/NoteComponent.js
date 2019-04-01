import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { styles, Colors } from '../assets/styles/style';
import { TextArea, WidgetHeader } from '../components/FormFields';

export class NoteComponent extends React.Component {
  onChangeText(note) {
    this.props.onChange({ ...this.props.value, note });
  }

  render() {
    return (
      <View style={styles.formRow}>
        <TextArea
          placeholder={'On my mind...'}
          value={this.props.value ? this.props.value.note : null}
          onChangeText={(note) => { this.onChangeText(note) }}
        />
      </View>
    );
  }
}