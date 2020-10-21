import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { removeFromReduxAndPersist } from '../redux/mainActionCreators';
import { CreateWidgetFactory, WidgetBase } from '../modules/widgetFactory';
import ItemHistory from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { DeleteWidgetItemButton, FloatingToolbar } from '../components/ToolbarComponents';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/configureStore';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
});

const mapDispatchToProps = {
  removeFromReduxAndPersist
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface ItemHistoryScreenState {
  selectedItem?: WidgetBase
}

interface ItemHistoryScreenProps {
  navigation: any;
}

class ItemHistoryScreen extends Component<PropsFromRedux & ItemHistoryScreenProps, ItemHistoryScreenState> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  static navigationOptions = ({ route, navigation }: any) => {
    return ({
      title: route.params.title
    });
  };

  itemType: string;

  constructor(props: PropsFromRedux & ItemHistoryScreenProps) {
    super(props);
    this.itemType = props.route.params.itemType;
    this.state = {
      selectedItem: undefined
    };
  }

  onSelected(selectedItem: WidgetBase) {
    selectedItem === this.state.selectedItem ?
      this.setState({ ...this.state, selectedItem: undefined }) :
      this.setState({ ...this.state, selectedItem });
  }

  deleteItem(storeKey: string, item: WidgetBase) {
    this.props.removeFromReduxAndPersist(storeKey, this.props.STORE.items, item.id);
    this.setState({ ...this.state, selectedItem: undefined });
  }

  render() {
    const widgetFactory = CreateWidgetFactory(this.context);
    const itemType = this.itemType;

    let renderHistoryItem;
    const renderHistoryItemFunction = widgetFactory[itemType].renderHistoryItem;
    if (renderHistoryItemFunction) {
      renderHistoryItem = function (item: WidgetBase, isSelectedItem: boolean) {
        return renderHistoryItemFunction(item, isSelectedItem, widgetFactory[itemType].config);
      };
    }

    const styles = this.context.styles;
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true}>
          <ItemHistory style={[styles.toolbarBottomOffset]}
            store={this.props.STORE}
            itemType={this.itemType}
            selectedItem={this.state.selectedItem}
            onSelected={(item) => { this.onSelected(item); }}
            renderItem={renderHistoryItem} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
            config={widgetFactory[this.itemType].config}
          ></ItemHistory>
        </ScreenContent>
        <FloatingToolbar isVisible={this.state.selectedItem !== undefined}>
          <DeleteWidgetItemButton item={this.state.selectedItem} onDelete={(storeKey, item) => { this.deleteItem(storeKey, item); }} />
        </FloatingToolbar>
      </ScreenBackground>
    );
  }
}

export default connector(ItemHistoryScreen);


