import React from 'react';
import { View } from 'react-native';
import { TextArea } from '../components/MiscComponents';
import { OtherItemTypes, stateConstants, text, defaultTags } from '../modules/Constants';
import { getHashtagsFromText } from '../modules/helpers';
import Tags from '../components/Tags';
import { connect } from 'react-redux';
import { loadItems } from '../redux/mainActionCreators';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION]
  };
}

const mapDispatchToProps = dispatch => ({
  loadItems: (itemType) => dispatch(loadItems(itemType))
});

class NoteComponent extends React.Component {

  componentDidMount() {
    this.props.loadItems(OtherItemTypes.TAGS);
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
    const tagsFromStorage = this.props[stateConstants.OPERATION].items[OtherItemTypes.TAGS];

    let sortedTags = (tagsFromStorage || defaultTags).sort(function (x, y) {
      return new Date(y.date) - new Date(x.date);
    });

    sortedTags = sortedTags.filter(item => tagsFromNote.indexOf(item.id) < 0);
    if (sortedTags.length > 10)
      return sortedTags.slice(0, 10);

    /* there are less than 10 tags in storage so we add a few more from the default tags to make 10 */
    const tagsForPadding = defaultTags.filter((defaultTag) => sortedTags.filter(sortedTag => tagsFromNote.indexOf(defaultTag.id) >= 0 || defaultTag.id == sortedTag.id).length <= 0);
    return sortedTags.concat(tagsForPadding).slice(0, 10);
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