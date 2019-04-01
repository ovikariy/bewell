import React from 'react';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { homeScreenItems } from '../constants/Lists';
import * as Animatable from 'react-native-animatable';
import { ScreenContainer } from '../components/ScreenContainer';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {

    const homeItems = homeScreenItems.map((item, index) => {
      return (
        <TouchableOpacity key={index}
          onPress={() => this.props.navigation.navigate(item.navigatoTo)}>
          <Card
            image={item.image}
            imageStyle={styles.cardImage}
            containerStyle={styles.cardContainer}
            featuredTitle={item.title}
            wrapperStyle={styles.cardWrapper}
          >
            {/*  to show child items inside the card make sure to cardWrapper class height
            <Text style={styles.cardText}>19 entries</Text> */}
          </Card>
        </TouchableOpacity>
      );
    })

    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <Animatable.View animation="fadeInLeft" duration={2000} style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
          />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" duration={2000} style={styles.wrappingRow}>
          {homeItems}
          <Image /* dummy item for left alignment */
            source={require('../assets/images/clear_200.png')}
            style={[styles.cardImage, styles.cardContainer, { margin: 15 }]}
          />
        </Animatable.View>
      </ScreenContainer>
    );
  }

}


