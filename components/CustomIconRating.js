import React, { Component } from 'react';
import { ButtonGroup } from 'react-native-elements';

class CustomIconRating extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ButtonGroup
        onPress={(selectedIndex) => { this.props.onPress(selectedIndex) }}
        buttons={this.props.buttons}
        containerStyle={this.props.containerStyle}
        innerBorderStyle={{ width: 0 }}
      />
    )
  }
}

export default CustomIconRating;