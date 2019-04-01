import React from 'react';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { styles, Fonts } from '../assets/styles/style';
import { homeScreenItems } from '../constants/Lists';
import * as Animatable from 'react-native-animatable';
import { ScreenBackground } from '../components/ScreenComponents';

export default class HomeScreen extends React.Component {

  // static navigationOptions = ({ navigation }) => ({
  //   headerLeft: <Icon name='menu' containerStyle={{ margin: 16 }}
  //     color='white' onPress={() => navigation.toggleDrawer()} />
  // })

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
            featuredTitleStyle={styles.cardTitle}
            wrapperStyle={styles.cardWrapper}
          >
            {/*  to show child items inside the card make sure to cardWrapper class height
            <Text style={styles.cardText}>19 entries</Text> */}
          </Card>
        </TouchableOpacity>
      );
    })

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <Animatable.View animation="fadeInLeft" duration={2000} style={styles.logoContainer}>
          <TouchableOpacity title='Test' onPress={() => this.props.navigation.toggleDrawer()} >
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logoImage}
            />
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" duration={2000} style={styles.wrappingRow}>
          {homeItems}
          <Image /* dummy item for left alignment */
            source={require('../assets/images/clear_200.png')}
            style={[styles.cardImage, styles.cardContainer, { margin: 15 }]}
          />
        </Animatable.View>
      </ScreenBackground>
    );
  }

}


