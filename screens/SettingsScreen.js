import React from 'react';
import { ScrollView, SectionList, Image, StyleSheet, Text, View } from 'react-native';
import { HeaderOptions } from '../constants/Constants';
import { Constants } from 'expo';
import { styles } from '../assets/styles/style';
import { ScreenContainer } from '../components/ScreenContainer';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
    ...HeaderOptions
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScrollView style={styles.screenBody}>
          <ExpoConfigView />
        </ScrollView>
      </ScreenContainer>
    )
  }
}

class ExpoConfigView extends React.Component {
  render() {
    const { manifest } = Constants;
    const sections = [
      { data: [{ value: manifest.sdkVersion }], title: 'sdkVersion' },
      { data: [{ value: manifest.privacy }], title: 'privacy' },
      { data: [{ value: manifest.version }], title: 'version' },
      { data: [{ value: manifest.orientation }], title: 'orientation' },
      {
        data: [{ value: manifest.primaryColor, type: 'color' }],
        title: 'primaryColor',
      },
      {
        data: [{ value: manifest.splash && manifest.splash.image }],
        title: 'splash.image',
      },
      {
        data: [
          {
            value: manifest.splash && manifest.splash.backgroundColor,
            type: 'color',
          },
        ],
        title: 'splash.backgroundColor',
      },
      {
        data: [
          {
            value: manifest.splash && manifest.splash.resizeMode,
          },
        ],
        title: 'splash.resizeMode',
      },
      {
        data: [
          {
            value:
              manifest.ios && manifest.ios.supportsTablet ? 'true' : 'false',
          },
        ],
        title: 'ios.supportsTablet',
      },
    ];

    return (
      <SectionList
        style={styles1.container}
        renderItem={this._renderItem}
        renderSectionHeader={this._renderSectionHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => index}
        ListHeaderComponent={ListHeader}
        sections={sections}
      />
    );
  }

  _renderSectionHeader = ({ section }) => {
    return <SectionHeader title={section.title} />;
  };

  _renderItem = ({ item }) => {
    if (item.type === 'color') {
      return (
        <SectionContent>
          {item.value && <Color value={item.value} />}
        </SectionContent>
      );
    } else {
      return (
        <SectionContent>
          <Text style={styles1.sectionContentText}>
            {item.value}
          </Text>
        </SectionContent>
      );
    }
  };
}

const ListHeader = () => {
  const { manifest } = Constants;

  return (
    <View style={styles1.titleContainer}>
      <View style={styles1.titleIconContainer}>
        <AppIconPreview iconUrl={manifest.iconUrl} />
      </View>

      <View style={styles1.titleTextContainer}>
        <Text style={styles1.nameText} numberOfLines={1}>
          {manifest.name}
        </Text>

        <Text style={styles1.slugText} numberOfLines={1}>
          {manifest.slug}
        </Text>

        <Text style={styles1.descriptionText}>
          {manifest.description}
        </Text>
      </View>
    </View>
  );
};

const SectionHeader = ({ title }) => {
  return (
    <View style={styles1.sectionHeaderContainer}>
      <Text style={styles1.sectionHeaderText}>
        {title}
      </Text>
    </View>
  );
};

const SectionContent = props => {
  return (
    <View style={styles1.sectionContentContainer}>
      {props.children}
    </View>
  );
};

const AppIconPreview = ({ iconUrl }) => {
  if (!iconUrl) {
    iconUrl =
      'https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png';
  }

  return (
    <Image
      source={{ uri: iconUrl }}
      style={{ width: 64, height: 64 }}
      resizeMode="cover"
    />
  );
};

const Color = ({ value }) => {
  if (!value) {
    return <View />;
  } else {
    return (
      <View style={styles1.colorContainer}>
        <View style={[styles1.colorPreview, { backgroundColor: value }]} />
        <View style={styles1.colorTextContainer}>
          <Text style={styles1.sectionContentText}>
            {value}
          </Text>
        </View>
      </View>
    );
  }
};

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
  },
  titleIconContainer: {
    marginRight: 15,
    paddingTop: 2,
  },
  sectionHeaderContainer: {
    backgroundColor: '#fbfbfb',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ededed',
  },
  sectionHeaderText: {
    fontSize: 14,
  },
  sectionContentContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 15,
  },
  sectionContentText: {
    color: '#808080',
    fontSize: 14,
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
  },
  slugText: {
    color: '#a39f9f',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: '#4d4d4d',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorPreview: {
    width: 17,
    height: 17,
    borderRadius: 2,
    marginRight: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  colorTextContainer: {
    flex: 1,
  },
});
