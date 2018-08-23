import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// components
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import AddAuthor from './components/AddAuthor';

// apollo client setup
const client = new ApolloClient({
    uri: 'http://localhost:4001/graphql'
});

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <div id="main">
                    <h1>Mirkó's Reading List</h1>
                    <BookList />
                    <AddBook />
                    <AddAuthor />
                </div>
            </ApolloProvider>
        );
    }
}
export default App;