import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ErrorMessage } from '../modules/constants';
import { ParagraphText, Toast, PasswordInputWithButton, Spacer, HorizontalLine, ButtonPrimary, ButtonSecondary, ActivityIndicator, LoadingScreeenOverlay } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { isNullOrEmpty, consoleLogWithColor } from '../modules/utils';
import { startRestore, verifyPasswordForRestore, tryDecryptFileData, importData } from '../redux/backupRestoreActionCreators';
import * as FileHelpers from '../modules/io';
import { getDocumentAsync } from 'expo-document-picker';
import { StackActions } from '@react-navigation/native';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppError, AppNavigationProp, ImportInfo } from '../modules/types';
import { sizes } from '../assets/styles/style';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION,
  BACKUPRESTORE: state.BACKUPRESTORE
});

const mapDispatchToProps = {
  verifyPasswordForRestore,
  startRestore,
  tryDecryptFileData,
  importData
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface RestoreScreenState {
  password?: string,
  filePassword?: string,
  importInfo?: ImportInfo,
  importFilename?: string,
  loading: boolean
}

interface RestoreScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'Restore'>
}

class RestoreScreen extends Component<RestoreScreenProps, RestoreScreenState> {

  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: RestoreScreenProps) {
    super(props);
    this.state = {
      password: undefined,
      filePassword: undefined,
      importInfo: undefined,
      importFilename: undefined,
      loading: false
    };
  }

  componentDidMount() {
    this.props.startRestore();
  }

  reset() {
    this.setState({
      ...this.state,
      password: undefined,
      filePassword: undefined,
      importInfo: undefined,
      importFilename: undefined,
      loading: false
    });
  }

  verifyPassword() {
    const language = this.context.language;

    if (!this.state.password || isNullOrEmpty(this.state.password)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }
    this.props.verifyPasswordForRestore(this.state.password);
  }

  verifyFilePassword() {
    const language = this.context.language;

    if (!this.state.filePassword || isNullOrEmpty(this.state.filePassword)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }

    if (!this.state.importInfo || this.state.importInfo.data.length <= 0)
      throw new AppError(ErrorMessage.NoRecordsInFile);

    this.props.tryDecryptFileData(this.state.importInfo.data, this.state.filePassword);
  }

  browseForFile() {
    this.browseForFileAsync()
      .then(() => { })
      .catch(error => {
        consoleLogWithColor(error);
        (error instanceof AppError !== true) ?
          Toast.showTranslated(error.message, this.context) :
          Toast.showError(error, this.context);
      });
  }

  browseForFileAsync = async () => {
    const docPickerResult = await getDocumentAsync({ copyToCacheDirectory: false });
    if (docPickerResult.type !== 'success' || !docPickerResult.uri)
      return; /* the user cancelled */

    this.setState({ ...this.state, importFilename: docPickerResult.name });

    await this.tryGetDataFromFileAsync(docPickerResult.uri);
  };

  tryGetDataFromFileAsync = async (importFileUri: string) => {
    this.setState({ ...this.state, loading: true });
    const language = this.context.language;

    if (!this.state.password || isNullOrEmpty(this.state.password)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }

    try {
      const importInfo = await FileHelpers.importUserDataZip(importFileUri);
      if (!importInfo || !importInfo.data || importInfo.data.length <= 0)
        throw new AppError(ErrorMessage.NoRecordsInFile);

      this.props.tryDecryptFileData(importInfo.data, this.state.password);
      this.setState({ ...this.state, importInfo, loading: false });
    }
    catch (error) {
      this.setState({ ...this.state, importFilename: undefined, loading: false });
      consoleLogWithColor(error);
      (error instanceof AppError !== true) ?
        Toast.showTranslated(error.message, this.context) :
        Toast.showError(error, this.context);
      FileHelpers.clearDirectoryAsync(FileHelpers.FileSystemConstants.ImportDirectory);
    }
  };

  clearSelectedFile() {
    this.setState({ ...this.state, importFilename: undefined });
  }

  import() {
    const language = this.context.language;

    if (!this.state.importInfo || this.state.importInfo.data.length <= 0)
      throw new AppError(ErrorMessage.NoRecordsInFile);

    const password = this.state.filePassword ? this.state.filePassword : this.state.password;

    if (!password || isNullOrEmpty(password)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }

    this.props.importData(this.state.importInfo, password);
  }

  renderPasswordField() {
    const language = this.context.language;
    const styles = this.context.styles;

    /* re-prompt for password even if logged in; if verified then allow setting PIN */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordConfirm}</ParagraphText>
      <Spacer />
      <PasswordInputWithButton value={this.state.password}
        containerStyle={styles.bottomPositioned}
        placeholder={language.passwordEnter}
        onPress={() => this.verifyPassword()}
        onChangeText={(value) => { this.setState({ ...this.state, password: value }); }}
      />
    </View>;
  }

  renderFilePasswordFields() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordFile}</ParagraphText>
      <Spacer height={sizes[40]} />
      {this.renderFileField()}
      <View style={[styles.flex, styles.bottomPositioned, { width: '100%', alignItems: 'center'}]}>
        <ButtonPrimary
          iconName='arrow-back'
          title={language.importClear}
          onPress={() => { this.clearSelectedFile(); }}
        />
        <Spacer height={sizes[20]} />
        <PasswordInputWithButton value={this.state.filePassword}
          placeholder={language.passwordEnterFile}
          onPress={() => this.verifyFilePassword()}
          onChangeText={(value) => { this.setState({ ...this.state, filePassword: value }); }}
        />
      </View>
    </View>;
  }

  renderBrowseForFile() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.importBrowseExplanation}</ParagraphText>
      <Spacer />
      <ButtonSecondary
        containerStyle={[styles.bottomPositioned, styles.buttonLarge]}
        title={language.importBrowse}
        onPress={() => { this.browseForFile(); }}
      />
    </View>;
  }

  renderSelectedFile() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      {this.state.loading && <LoadingScreeenOverlay text={language.filePleaseWait} />}
      <ParagraphText style={[styles.bodyTextLarge]}>{language.importPress}</ParagraphText>
      <Spacer height={sizes[40]} />
      {this.renderFileField()}
      <View style={[styles.flex, styles.bottomPositioned]}>
        <ButtonPrimary
          iconName='arrow-back'
          title={language.importClear}
          onPress={() => { this.clearSelectedFile(); }}
        />
        <Spacer height={sizes[20]} />
        {!this.state.loading && <ButtonSecondary
          title={language.import}
          disabled={this.state.loading}
          onPress={() => { this.import(); }}
        />}
      </View>
    </View>;
  }

  renderFileField() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge, { color: styles.titleText.color, marginBottom: sizes[16] }]}>{language.importSelectedFile}</ParagraphText>
      <ParagraphText style={[styles.bodyTextLarge]}>{this.state.importFilename}</ParagraphText>

    </View>;
  }

  renderImportComplete() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.importComplete}</ParagraphText>
      <Spacer />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, styles.buttonMedium]}
        title={language.done}
        onPress={() => { this.props.navigation.dispatch(StackActions.popToTop()); }}
      />
    </View>;
  }

  renderFields() {
    if (this.props.BACKUPRESTORE.isComplete === true)
      return this.renderImportComplete();

    if (this.props.BACKUPRESTORE.isPasswordVerified !== true)
      return this.renderPasswordField();

    if (!this.state.importFilename)
      return this.renderBrowseForFile();

    if (this.props.BACKUPRESTORE.isFilePasswordNeeded === true)
      return this.renderFilePasswordFields();

    return this.renderSelectedFile();
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}  /** @see devnotes.md#scrollView-and-keyboard */>
          <ScreenContent style={styles.screenBodyContainerLargeMargin} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.importExplanation}</ParagraphText>
            <HorizontalLine />
            {this.renderFields()}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(RestoreScreen);