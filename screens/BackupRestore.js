import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { stateConstants } from '../modules/Constants';
import { ParagraphText, ActivityIndicator, ButtonPrimary } from '../components/MiscComponents';
import { View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { AppContext } from '../modules/AppContext';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.BACKUPRESTORE]: state[stateConstants.BACKUPRESTORE]
  }
}

class BackupRestoreScreen extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = { password: null };
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true} style={{ padding: 20 }} >
          {this.props[stateConstants.OPERATION].isLoading ? <ActivityIndicator /> : <View />}
          <ParagraphText style={[styles.bodyTextLarge, { marginTop: 30 }]}>{language.exportExplanation}</ParagraphText>
          <ButtonPrimary
            containerStyle={{ marginTop: 20 }}
            title={language.export}
            onPress={() => { this.props.navigation.navigate('Backup') }}
            icon={<Icon
              containerStyle={{ marginRight: 20 }}
              name='arrow-downward'
              size={20}
              color='white'
            />}
          />
          <ParagraphText style={[styles.bodyTextLarge, { marginTop: 30 }]}>{language.importExplanationLong}</ParagraphText>
          <ButtonPrimary
            containerStyle={{ marginTop: 20 }}
            title={language.import}
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


