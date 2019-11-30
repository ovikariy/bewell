import React from 'react';
import { View } from 'react-native';
import { TextArea } from '../components/MiscComponents';
import { WellKnownStoreKeys, stateConstants, text, defaultTags } from '../modules/Constants';
import { getHashtagsFromText, mergeArraysImmutable } from '../modules/helpers';
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

  componentDidMount() {
   // this.props.load(WellKnownStoreKeys.TAGS);
  }

  textChanged(note) {
    this.props.onChange({ ...this.props.value, note });
  }

  onTagPress(tag) {
    this.props.onChange({ ...this.props.value, note: (this.props.value.note || '') + ' ' + tag.id });
  }

  getMostRecentTags() {
    /* show up to ten most recent and/or default tags without the ones already showing in the text field */
    const note = this.props.value && this.props.value.note ? this.props.value.note : '';
    const tagsFromNote = getHashtagsFromText(note);
    const tagsFromStorage = this.props[stateConstants.OPERATION].store[WellKnownStoreKeys.TAGS];

    let result = mergeArraysImmutable(defaultTags, tagsFromStorage);
    result = result.filter(item => tagsFromNote.indexOf(item.id) < 0);
    result = result.sort(function (x, y) {
      if (!x.date)
        return true;
      if (!y.date)
        return false;
      return new Date(y.date) - new Date(x.date)
    });
console.log('\r\nresult ' + JSON.stringify(result));
    return result.slice(0, 10);
  }

  render() {
    const tags = this.getMostRecentTags();

    return (
      <View>
        <TextArea
          placeholder={text.note.placeholder}
          value={this.props.value ? this.props.value.note : null}
          onChangeText={(note) => { this.textChanged(note) }}
        />
        <Tags
          items={tags}
          onPress={(tag) => this.onTagPress(tag)} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteComponent);