import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { ClearTextArea, Spacer, IconButton } from '../components/MiscComponents';
import { WellKnownStoreKeys, stateConstants, text, defaultTags } from '../modules/Constants';
import { getHashtagsFromText, mergeArraysImmutable } from '../modules/helpers';
import { styles } from '../assets/styles/style';
import Tags from '../components/Tags';
import { connect } from 'react-redux';
import { load } from '../redux/mainActionCreators';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION]
  };
}

const mapDispatchToProps = dispatch => ({
  load: (itemType) => dispatch(load(itemType))
});

class NoteComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      recentTagsVisble: false
    }
  }

  componentDidMount() {
    //TODO below?
    // this.props.load(WellKnownStoreKeys.TAGS);
  }

  textChanged(note) {
    this.props.onChange({ ...this.props.value, note });
  }

  onTagPress(tag) {
    this.props.onChange({ ...this.props.value, note: (this.props.value.note || '') + ' ' + tag.id });
  }

  getRecentTags() {
    /* show up to ten most recent and/or default tags without the ones already showing in the text field */
    const note = this.props.value && this.props.value.note ? this.props.value.note : '';
    const tagsFromNote = getHashtagsFromText(note);
    const tagsFromStorage = this.props[stateConstants.OPERATION].store[WellKnownStoreKeys.TAGS];

    let result = mergeArraysImmutable(defaultTags, tagsFromStorage);
    result = result.filter(item => tagsFromNote.indexOf(item.id) < 0);
    result = result.sort((x, y) => new Date(y.date) - new Date(x.date));
    return result.slice(0, 10); 
  }
 
  render() {
    const tags = this.getRecentTags();
    return (
      <Animatable.View animation="fadeIn" duration={500}>
        <ClearTextArea
          numberOfLines={1}
          placeholder={text.note.placeholder}
          value={this.props.value ? this.props.value.note : null}
          onChangeText={(note) => { this.textChanged(note) }}
        />
        <Spacer height={10} />
        <IconButton iconName='tags' iconType='font-awesome' iconStyle={styles.iconSecondarySmall}
          containerStyle={{ alignItems: 'flex-start', }}
          onPress={() => { this.setState({ recentTagsVisble: !this.state.recentTagsVisble }) }} />
        {
          this.state.recentTagsVisble ?
            <Tags title={text.note.tagInstruction}
              items={tags}
              onPress={(tag) => this.onTagPress(tag)} />
            : <View />
        }
      </Animatable.View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteComponent);