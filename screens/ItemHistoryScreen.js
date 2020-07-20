import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeFromRedux, persistRedux } from '../redux/mainActionCreators';
import { WidgetFactory } from '../modules/WidgetFactory';
import { stateConstants } from '../modules/Constants';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { DeleteWidgetItemButton, FloatingToolbar } from '../components/ToolbarComponents';
import { AppContext } from '../modules/AppContext';

const mapStateToProps = state => {
  return {
    [stateConstants.STORE]: state[stateConstants.STORE]
  }
}

const mapDispatchToProps = dispatch => ({
  remove: (key, id) => dispatch(removeFromRedux(key, id)),
  persistRedux: (items, dirtyKeys) => dispatch(persistRedux(items, dirtyKeys))
});

class ItemHistoryScreen extends Component {
  static contextType = AppContext;

  static navigationOptions = ({ route, navigation }) => {
    return ({
      title: route.params.title
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
    this.props.persistRedux(this.props[stateConstants.STORE].items, this.props[stateConstants.STORE].dirtyKeys);
    this.setState({ ...this.state, selectedItem: null })
  }

  render() {
    const widgetFactory = WidgetFactory(this.context);
    const renderHistoryItem = widgetFactory[this.itemType].renderHistoryItem ?
      function (item, isSelectedItem) {
        return widgetFactory[this.itemType].renderHistoryItem(item, isSelectedItem, widgetFactory[this.itemType].config)
      }
      : null;

    const styles = this.context.styles;
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true}>
          <ItemHistory style={[styles.toolbarBottomOffset]}
            state={this.props[stateConstants.STORE]}
            itemType={this.itemType}
            selectedItem={this.state.selectedItem}
            onSelected={(item) => { this.onSelected(item) }}
            renderItem={renderHistoryItem} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
            config={widgetFactory[this.itemType].config}
          ></ItemHistory>
        </ScreenContent>
        <FloatingToolbar isVisible={this.state.selectedItem != null}>
          <DeleteWidgetItemButton item={this.state.selectedItem} onDelete={(storeKey, itemId) => { this.deleteItem(storeKey, itemId) }} />
        </FloatingToolbar>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemHistoryScreen);


