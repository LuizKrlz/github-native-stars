import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Avatar,
  Bio,
  Container,
  Header,
  Name,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
  ShowButton,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  state = {
    stars: [],
    loading: true,
    page: 1,
    total: 0,
    refreshing: false,
  };

  async componentDidMount() {
    this.loadMore();
  }

  async componentDidUpdate(_, prevState) {
    const { refreshing } = this.state;
    if (prevState.refreshing !== refreshing) {
      await this.loadMore(1, true);
    }
  }

  /**
   * @todo Rever
   */
  loadMore = async (pageNumber, shouldRefresh = false) => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { total, stars, page } = this.state;

    if (!pageNumber) {
      // eslint-disable-next-line no-param-reassign
      pageNumber = page;
    }

    if (total && pageNumber > total) return;

    this.setState({ loading: true });

    const { data } = await api.get(
      `/users/${user.login}/starred?per_page=5&page=${pageNumber}`
    );

    this.setState({
      stars: shouldRefresh ? data : [...stars, ...data],
      page: pageNumber + 1,
      loading: false,
      refreshing: false,
    });
  };

  refreshList = () => {
    this.setState({ refreshing: true });
  };

  handleNavigate = repository => {
    const { navigation } = this.props;
    navigation.navigate('Show', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={0.2}
            onEndReached={() => this.loadMore()}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
                <ShowButton onPress={() => this.handleNavigate(item)}>
                  <Icon name="link" size={20} />
                </ShowButton>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
