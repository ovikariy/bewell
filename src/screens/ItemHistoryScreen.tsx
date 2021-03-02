import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { removeFromReduxAndPersist } from '../redux/mainActionCreators';
import { CreateWidgetFactory, WidgetBase } from '../modules/widgetFactory';
import { ItemHistory } from '../components/ItemHistory';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { DeleteWidgetItemButton, FloatingToolbar } from '../components/ToolbarComponents';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppNavigationProp, AppRouteProp } from '../modules/types';
import { filterByItemType } from '../modules/utils';

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

interface ItemHistoryScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'ItemHistory'>
  route: AppRouteProp<'ItemHistory'>
}

class ItemHistoryScreen extends Component<ItemHistoryScreenProps, ItemHistoryScreenState> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  static getNavigationOptions = ({ route, navigation }: any) => {
    return ({
      title: route.params.title
    });
  };

  itemType: string;

  constructor(props: ItemHistoryScreenProps) {
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
    const styles = this.context.styles;

    const widgetFactory = CreateWidgetFactory(this.context);
    const itemType = this.itemType;

    const renderHistoryItem = !widgetFactory[itemType].renderHistoryItem ? undefined :
      (item: WidgetBase, isSelectedItem: boolean) => widgetFactory[itemType].renderHistoryItem(item, isSelectedItem, widgetFactory[itemType].config);

    const renderCalendarItem = !widgetFactory[itemType].renderCalendarItem ? undefined :
      (item: WidgetBase) => widgetFactory[itemType].renderCalendarItem(item, widgetFactory[itemType].config);

    const items = filterByItemType(this.props.STORE.items, this.itemType);

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={[styles.screenBodyContainerMediumMargin, { paddingHorizontal: 0 }]}>
          <ItemHistory style={[styles.toolbarBottomOffset]}
            items={items}
            itemType={this.itemType}
            selectedItem={this.state.selectedItem}
            onSelected={(item) => { this.onSelected(item); }}
            renderItem={renderHistoryItem} /* make sure the prop name and function name are different, otherwise will get called but the return from function is undefined */
            renderCalendarItem={renderCalendarItem}
            config={widgetFactory[this.itemType].config}
            navigation={this.props.navigation}
          />
        </ScreenContent>
        <FloatingToolbar isVisible={this.state.selectedItem !== undefined}>
          <DeleteWidgetItemButton item={this.state.selectedItem} onDelete={(storeKey, item) => { this.deleteItem(storeKey, item); }} />
        </FloatingToolbar>
      </ScreenBackground>
    );
  }
}

export default connector(ItemHistoryScreen);


