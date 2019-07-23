import React, { Component } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Text,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

import api from '../../services/api';

export default class Main extends Component {
  state = {
    newUser: '',
    users: [],
    loading: false,
    textInput: '',
  };

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true, textInput: '' });
    Keyboard.dismiss();

    try {
      const response = await api.get(`/users/${newUser}`);

      const { data } = response;
      const user = {
        name: data.name,
        login: data.login,
        bio: data.bio,
        avatar: data.avatar_url,
      };

      this.setState({ users: [...users, user], newUser: '', loading: false });
    } catch (error) {
      this.setState({
        newUser: '',
        loading: false,
        textInput: 'Usuário não encontrado',
      });
      console.tron.log(Object.keys(error), error.message);
    }
  };

  render() {
    const { users, newUser, loading, textInput } = this.state;
    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator size={20} color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>
        <Text>{textInput}</Text>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => {}}>
                <ProfileButtonText>Ver perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
Main.navigationOptions = {
  title: 'Usuários',
};
