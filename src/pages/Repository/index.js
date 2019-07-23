import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('starred').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    const starred = navigation.getParam('starred');

    return (
      <WebView
        source={{
          uri: starred.html_url,
        }}
        style={{ flex: 1 }}
      />
    );
  }
}
