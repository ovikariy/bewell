
import React from 'react';
import { ButtonPrimary, Toast, StyledImage, ActivityIndicator, RoundButton } from './MiscComponents';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { AppContext } from '../modules/AppContext';
import * as FileHelpers from '../modules/FileHelpers';
import { getNewUuid, isNullOrEmpty } from '../modules/helpers';
import { Errors, brokenImageURI } from '../modules/Constants';
import { encryptDataAsync, decryptDataAsync } from '../modules/SecurityHelpers';

export class ImagePickerWidget extends React.Component {
  static contextType = AppContext;

  state = {
    image: null
  };

  reset() {
    this.setState({
      ...this.state,
      image: null
    })
  }

  componentDidMount() {
    this.getPermissionAsync();
    /* when images has been saved in the past, process it async from disk and update state when ready with new image data */
    if (this.props.value.imageProps)
      this.getImageFromFile();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.value || !this.props.value.imageProps)
      return;
    /* when user selects a new image, process it async from disk and update state when ready with new image data */
    if (!prevProps.value.imageProps || prevProps.value.imageProps.filename !== this.props.value.imageProps.filename) {
      this.getImageFromFile();
    }
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    const image = this.state.image;

    if (!image) {
      if (this.props.value && this.props.value.imageProps && this.props.value.imageProps.filename) {
        /* we have a filename but haven't finished loading it from disk yet */
        return <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      }
      else {
        /* it's a blank widget and user hasn't picked an image yet */
        return <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ButtonPrimary
            title={language.pickImage}
            onPress={() => this.pickImage()}
          />
        </View>
      }
    }

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {this.props.readonly !== true && this.props.isSelected
          && <RoundButton name="close" onPress={() => this.clearImage()} containerStyle={styles.imageComponentClearButtonContainer} />}
        {this.props.value.imageProps
          && <StyledImage image={image} imageProps={this.props.value.imageProps} />}
      </View >
    );
  }

  getImageFromFile() {
    this.getImageFromFileAsync()
      .then((image) => {
        this.setState({ ...this.state, image });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ ...this.state, image: brokenImageURI });
        Toast.showTranslated(error.message ? error.message : error, this.context);
      })
  }

  getImageFromFileAsync = async () => {
    const imageFullPath = FileHelpers.getFullImagePath(this.props.value.imageProps.filename);
    if (await FileHelpers.existsAsync(imageFullPath) !== true) {
      throw Errors.InvalidFile;
    }
    const fileContent = await FileHelpers.getStringfromFileAsync(imageFullPath);
    if (!fileContent)
      throw Errors.InvalidFormat;

    const fileContentDecrypted = await decryptDataAsync(fileContent);
    if (!fileContentDecrypted)
      throw Errors.UnableToDecrypt;

    return fileContentDecrypted;
  }

  pickImage() {
    this.pickImageAsync()
      .then(() => { })
      .catch((error) => {
        console.log(error);
        Toast.showTranslated(error.message ? error.message : error, this.context);
      })
  }

  pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      exif: true,
      allowsEditing: false,
      quality: 0.5
    });
    if (!result.cancelled) {
      this.onImagePicked(result);
    }
  }

  onImagePicked(result) {
    this.saveImageToFileAsync(result)
      .then((filename) => {
        this.props.onChange({
          ...this.props.value,
          imageProps: {
            imageType: result.type,
            exif: result.exif,
            filename: filename,
            width: result.width,
            height: result.height
          }
        })
        this.reset();
      })
      .catch((error) => {
        console.log(error);
        Toast.showTranslated(error.message ? error.message : error, this.context);
      })
  }

  saveImageToFileAsync = async (result) => {
    //get image base64 string, encrypt, store in document directory so can be zipped up during export
    //get the URI to the file and store as property of widget record by calling onChange from props
    const fileContent = result.base64;
    if (isNullOrEmpty(fileContent))
      throw Errors.InvalidFormat;

    const fileContentEncrypted = await encryptDataAsync(fileContent);
    if (!fileContentEncrypted)
      throw Errors.UnableToEncrypt;

    await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.FileSystemConstants.ImagesSubDirectory);

    const filename = getNewUuid();
    const filepath = FileHelpers.getFullImagePath(filename);
    await FileHelpers.writeFileAsync(filepath, fileContentEncrypted);
    return filename;
  }

  getPermissionAsync = async () => {
    const language = this.context.language;

    if (Constants.platform.ios) {
      const status = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert(language.cameroRollPermissions);
      }
    }
  }

  clearImage() {
    if (!this.props.value || !this.props.value.imageProps || !this.props.value.imageProps.filename)
      return;

    if (this.state.image == brokenImageURI) {
      this.props.onChange({ ...this.props.value, imageProps: null });
      this.reset();
      return;
    }

    FileHelpers.deleteImageFromDiskAsync(this.props.value.imageProps.filename)
      .then(() => {
        this.props.onChange({ ...this.props.value, imageProps: null });
        this.reset();
      })
      .catch((error) => {
        console.log(error);
        Toast.showTranslated(Errors.CannotDeleteFile, this.context);
      })
  }
}