import React, { Component } from 'react';

import { ActivityIndicator } from 'react-native';

import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Bio,
  Avatar,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    refreshing: false,
    page: 1,
    loading: true,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    this.loadRepositories();
  }

  loadRepositories = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ refreshing: true });

    const { page, stars } = this.state;

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);
    const { data } = response;

    this.setState({
      page: page + 1,
      stars: [...stars, ...data],
      loading: false,
      refreshing: false,
    });
  };

  refreshList = () => {
    this.setState({ stars: [], page: 1, refreshing: true });
    this.loadRepositories();
  };

  handleNavigate = starred => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { starred });
  };

  render() {
    const { stars, loading, refreshing } = this.state;

    const { navigation } = this.props;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator size={30} color="#999" />
        ) : (
          <Stars
            onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
            onEndReached={this.loadRepositories} // Função que carrega mais itens
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
