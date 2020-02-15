import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeFromRedux, persistRedux } from '../redux/mainActionCreators';
import { styles } from '../assets/styles/style';
import { WidgetFactory } from '../modules/WidgetFactory';
import { stateConstants, text, ItemTypes } from '../modules/Constants';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { DeleteItemButton, FloatingToolbar } from '../components/ToolbarComponents';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION]
  }
} 

const mapDispatchToProps = dispatch => ({
  remove: (key, id) => dispatch(removeFromRedux(key, id)),
  persistRedux: (state) => dispatch(persistRedux(state))
});

class ItemHistoryScreen extends Component {
  static navigationOptions = ({ route, navigation }) => {
    const itemType = route.params.itemType;
    let title = text.historyScreen.title;
    if (itemType && WidgetFactory[itemType]) {
      title = (WidgetFactory[itemType].config.widgetTitle || '') + ' ' + text.historyScreen.title;
    }
    return ({
      title: title
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null
    }
    this.itemType = props.route.params.itemType;
  }

  onSelected(selectedItem) {
    selectedItem === this.state.selectedItem ?
      this.setState({ ...this.state, selectedItem: null }) :
      this.setState({ ...this.state, selectedItem });
  }

  deleteItem(storeKey, itemId) {
    this.props.remove(storeKey, itemId);
    this.props.persistRedux(this.props[stateConstants.OPERATION]);
    this.setState({ ...this.state, selectedItem: null })
  }

  render() {

    const renderHistoryItem = WidgetFactory[this.itemType].renderHistoryItem ?
      function (item, isSelectedItem) {
        return WidgetFactory[this.itemType].renderHistoryItem(item, isSelectedItem, WidgetFactory[this.itemType].config)
      }
      : null;

    return (
      <ScreenBackground>
        <ScreenContent  isKeyboardAvoidingView={true}>
          <ItemHistory style={[styles.toolbarBottomOffset]}
            state={this.props[stateConstants.OPERATION]}
            itemType={this.itemType}
            selectedItem={this.state.selectedItem}
            onSelected={(item) => { this.onSelected(item) }}
            renderItem={renderHistoryItem} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
            config={WidgetFactory[this.itemType].config}
          ></ItemHistory>
        </ScreenContent>
        <FloatingToolbar isVisible={this.state.selectedItem != null}>
          <DeleteItemButton item={this.state.selectedItem} onDelete={(storeKey, itemId) => { this.deleteItem(storeKey, itemId) }} />
        </FloatingToolbar>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemHistoryScreen);


