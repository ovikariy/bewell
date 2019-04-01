import React from 'react';
import { View, ScrollView, TouchableOpacity, ToastAndroid, ImageBackground } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { connect } from 'react-redux';
import * as ItemTypes from '../constants/ItemTypes';
import { postItem } from '../redux/CommonActionCreators';
import { ScreenActions } from '../components/ScreenActions';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderOptions } from '../constants/Constants';

const mapStateToProps = state => {
  return {
    dream: state.dream
  }
}

const mapDispatchToProps = dispatch => ({
  postDream: (dream) => dispatch(postItem(ItemTypes.DREAM, dream))
});

class DreamScreen extends React.Component {
  static navigationOptions = {
    title: 'Write down a dream',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
    this.state = {
      dream: ''
    }
  }

  recordDream() {
    const date = new Date();
    const newDream = {
      id: date.getTime(), /* use ticks for ID */
      note: this.state.dream,
      date: date.toISOString()
    }
    this.props.postDream(newDream);
    this.setState({ dream: '' });
    ToastAndroid.show('Dream saved!', ToastAndroid.LONG);
    this.props.navigation.navigate('DreamHistory');
  }

  render() {
    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScrollView style={styles.screenBody}>
          <View style={{ marginTop: 20 }}>
            <Input
              placeholder='...'
              onChangeText={(dream) => this.setState({ dream })}
              value={this.state.dream}
            />
          </View>
          <ScreenActions itemName='Dream' navigation={this.props.navigation}
            canSave={(this.state.dream + '').trim() == '' ? false : true}
            onPressSave={() => { this.recordDream() }}
          ></ScreenActions>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DreamScreen);