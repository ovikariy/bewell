import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { text, stateConstants } from '../modules/Constants';
import { ParagraphText, ActivityIndicator, showMessages, ButtonPrimary } from '../components/MiscComponents';
import { View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { styles } from '../assets/styles/style';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.BACKUPRESTORE]: state[stateConstants.BACKUPRESTORE]
  }
}

class BackupRestoreScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { password: null };
  }

  render() {

    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true} style={{ padding: 20 }} >
          {this.props[stateConstants.OPERATION].isLoading ? <ActivityIndicator /> : <View />}
          <ParagraphText style={[styles.bodyTextLarge, { marginTop: 30 }]}>{text.backupRestoreScreen.exportExplanation}</ParagraphText>
          <ButtonPrimary
            containerStyle={{ marginTop: 20 }}
            title={text.backupRestoreScreen.buttonExport}
            onPress={() => { this.props.navigation.navigate('Backup') }}
            icon={<Icon
              containerStyle={{ marginRight: 20 }}
              name='arrow-downward'
              size={20}
              color='white'
            />}
          />
          <ParagraphText style={[styles.bodyTextLarge, { marginTop: 30 }]}>{text.backupRestoreScreen.importExplanation}</ParagraphText>
          <ButtonPrimary
            containerStyle={{ marginTop: 20 }}
            title={text.backupRestoreScreen.buttonImport}
            onPress={() => { this.props.navigation.navigate('Restore') }}
            icon={<Icon
              containerStyle={{ marginRight: 20 }}
              name='arrow-upward'
              size={20}
              color='white'
            />}
          />
        </ScreenContent>
      </ScreenBackground>
    );
  }

  }

export default connect(mapStateToProps, null)(BackupRestoreScreen);


