import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import {useState, useEffect} from 'react';

import {create} from 'apisauce';
import Icons from './src/assets/icons';

// define the api
const api = create({
  baseURL: 'https://api.github.com',
  headers: {Accept: 'application/vnd.github.v3+json'},
});

const STATE = {
  LOADING: 1,
  DONE: 2,
  ERROR: 3,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
});
export default function App() {
  const [user, setUser] = useState('');
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <SearchBar onChangeText={setUser} />
        {user === '' ? (
          <Text
            style={{
              textAlign: 'center',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
            Search something
          </Text>
        ) : (
          <RepoList user={user} />
        )}
      </View>
    </SafeAreaView>
  );
}

const SearchBar = ({onChangeText}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#CCC',
      borderWidth: 1,
      padding: 8,
      borderRadius: 4,
      marginBottom: 8,
    },
    input: {
      flex: 1,
      marginLeft: 8,
    },
  });
  return (
    <View style={styles.container}>
      <Image
        source={Icons.search}
        style={{width: 16, height: 16, tintColor: '#CCC'}}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={onChangeText}
      />
    </View>
  );
};
const RepoList = ({user}) => {
  const TAG = 'RepoList';

  const [data, setData] = useState({state: STATE.LOADING, data: []});

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchRepos(), 1_000);
    return () => clearTimeout(timeoutId);
  }, [user]);

  function fetchRepos() {
    console.log(TAG, 'fetchRepos()', `Fetching repos for: ${user}`);
    api.get(`/users/${user}/repos`).then(response => {
      const repoNames = response.data.map(element => ({
        id: element.id,
        name: element.name,
      }));
      setData({state: 'DONE', data: repoNames});
    });
  }

  function renderItem({item}) {
    const itemStyle = {
      paddingHorizontal: 8,
      paddingVertical: 16,
      backgroundColor: '#EEE',
    };
    return <Text style={itemStyle}>{item.name}</Text>;
  }

  function separator() {
    return <View style={{height: 10}} />;
  }
  return data.state === STATE.LOADING ? (
    <Text>Loading</Text>
  ) : (
    <FlatList
      data={data.data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ItemSeparatorComponent={separator}
    />
  );
};
