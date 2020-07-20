import React, { Component } from 'react';
import { connect } from 'react-redux';
import { stateConstants, Errors } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Toast, PasswordInputWithButton, Spacer, HorizontalLine, ButtonPrimary, ButtonSecondary } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { isNullOrEmpty, formatDate } from '../modules/helpers';
import { startRestore, verifyPasswordForRestore, tryDecryptFileData, importData } from '../redux/backupRestoreActionCreators';
import * as FileHelpers from '../modules/FileHelpers';
import { getDocumentAsync } from 'expo-document-picker';
import { StackActions } from '@react-navigation/native';
import { AppContext } from '../modules/AppContext';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.BACKUPRESTORE]: state[stateConstants.BACKUPRESTORE]
  };
}

const mapDispatchToProps = dispatch => ({
  verifyPasswordForRestore: (password) => dispatch(verifyPasswordForRestore(password)),
  startRestore: () => dispatch(startRestore()),
  tryDecryptFileData: (data, password) => dispatch(tryDecryptFileData(data, password)),
  importData: (data, password) => dispatch(importData(data, password))
});

class RestoreScreen extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      password: null,
      filePassword: null,
      data: null,
      importFilename: null//'test.txt'
    }
  }

  componentDidMount() {
    this.props.startRestore();
  }

  reset() {
    this.setState({
      ...this.state,
      password: null,
      filePassword: null,
      data: null,
      importFilename: null
    });
  }

  verifyPassword() {
    const language = this.context.language;

    if (isNullOrEmpty(this.state.password)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }
    this.props.verifyPasswordForRestore(this.state.password);
  }

  verifyFilePassword() {
    const language = this.context.language;

    if (isNullOrEmpty(this.state.filePassword)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }
    this.props.tryDecryptFileData(this.state.data, this.state.filePassword);
  }

  browseForFile() {
    const language = this.context.language;

    this.browseForFileAsync()
      .then(() => { })
      .catch(error => {
        console.log(error);
        Toast.showTranslated(error.message ? error.message : error, language);
      });
  }

  browseForFileAsync = async () => {
    const docPickerResult = await getDocumentAsync({ copyToCacheDirectory: false });
    if (docPickerResult.type !== 'success')
      return; /* the user cancelled */

    this.setState({ ...this.state, importFilename: docPickerResult.name });

    await this.tryGetDataFromFileAsync(docPickerResult.uri);
  }

  tryGetDataFromFileAsync = async (importFileUri) => {
    const language = this.context.language;

    try {
      const importDirectory = await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.ImportDirectory);
      const tempFilename = 'morning-app-import-' + formatDate(new Date(), 'YYMMMDD-hhmmss') + '.txt';
      const tempFilepath = importDirectory + '/' + tempFilename;

      /* copy to cache directory otherwise error when reading from its original location  */
      await FileHelpers.clearDirectoryAsync(importDirectory);
      await FileHelpers.copyFileAsync(importFileUri, tempFilepath);

      const data = await FileHelpers.getJSONfromFileAsync(tempFilepath);
      await FileHelpers.clearDirectoryAsync(FileHelpers.ImportDirectory);

      if (!data || data.length <= 0)
        throw Errors.NoRecordsInFile;

      this.props.tryDecryptFileData(data, this.state.password);
      this.setState({ ...this.state, data: data });
    }
    catch (error) {
      console.log(error);
      Toast.showTranslated(error.message ? error.messsage : error, language);
      FileHelpers.clearDirectoryAsync(FileHelpers.ImportDirectory);
    }
  }

  clearSelectedFile() {
    this.setState({ ...this.state, importFileUri: null, importFilename: null });
  }

  import() {
    const password = this.state.filePassword ? this.state.filePassword : this.state.password;
    this.props.importData(this.state.data, password);
  }

  renderPasswordField() {
    const language = this.context.language;
    const styles = this.context.styles;

    /* re-prompt for password even if logged in; if verified then allow setting PIN */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordConfirm}</ParagraphText>
      <Spacer height={70} />
      <PasswordInputWithButton value={this.state.password}
        containerStyle={styles.bottomPositioned}
        placeholder={language.passwordEnter}
        onPress={() => this.verifyPassword()}
        onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
      />
    </View>;
  }

  renderFilePasswordFields() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordFile}</ParagraphText>
      <Spacer height={40} />
      {this.renderFileField()}
      <View style={[styles.flex, styles.bottomPositioned]}>
        <ButtonPrimary
          title={language.importClear}
          onPress={() => { this.clearSelectedFile(); }}
        />
        <Spacer height={20} />
        <PasswordInputWithButton value={this.state.filePassword}
          placeholder={language.passwordEnterFile}
          onPress={() => this.verifyFilePassword()}
          onChangeText={(value) => { this.setState({ ...this.state, filePassword: value }) }}
        />
      </View>
    </View>;
  }

  renderBrowseForFile() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.importBrowseExplanation}</ParagraphText>
      <Spacer height={70} />
      <ButtonSecondary
        containerStyle={[styles.bottomPositioned, { width: 280 }]}
        title={language.importBrowse}
        onPress={() => { this.browseForFile(); }}
      />
    </View>;
  }

  renderSelectedFile() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.importPress}</ParagraphText>
      <Spacer height={40} />
      {this.renderFileField()}
      <View style={[styles.flex, styles.bottomPositioned]}>
        <ButtonPrimary
          title={language.importClear}
          onPress={() => { this.clearSelectedFile(); }}
        />
        <Spacer height={20} />
        <ButtonSecondary
          title={language.import}
          onPress={() => { this.import(); }}
        />
      </View>
    </View>;
  }

  renderFileField() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge, { color: styles.titleText.color, marginBottom: 15 }]}>{language.importSelectedFile}</ParagraphText>
      <ParagraphText style={[styles.bodyTextLarge]}>{this.state.importFilename}</ParagraphText>

    </View>;
  }

  renderImportComplete() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.importComplete}</ParagraphText>
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 180 }]}
        title={language.done}
        onPress={() => { this.props.navigation.dispatch(StackActions.popToTop()) }}
      />
    </View>;
  }

  renderFields() {
    if (this.props[stateConstants.BACKUPRESTORE].isComplete === true) {
      return this.renderImportComplete();
    }
    if (this.props[stateConstants.BACKUPRESTORE].isPasswordVerified !== true) {
      return this.renderPasswordField();
    }
    if (!this.state.importFilename) {
      return this.renderBrowseForFile();
    }
    if (this.props[stateConstants.BACKUPRESTORE].isFilePasswordVerified !== true) {
      return this.renderFilePasswordFields();
    }
    return this.renderSelectedFile();
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}  /** @see devnotes.md#region 1.1 */>
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 100 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.importExplanation}</ParagraphText>
            <HorizontalLine />
            {this.renderFields()}
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestoreScreen);