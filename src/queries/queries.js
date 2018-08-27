import {gql} from 'apollo-boost';

const getAuthorsQuery = gql`
    {
        authors {
            name
            age
            id
        }
    }
`;

const getBooksQuery = gql`
    {
      books {
        name
        genre
        id
        author {
          id
          name
        }
      }
    }
`;

const addBookMutation = gql`
    mutation AddBook($name: String!, $genre: String!, $authorId: ID!){
        addBook(name: $name, genre: $genre, authorId: $authorId){
            name
            genre
            id
        }
    }
`;

const addAuthorMutation = gql`
    mutation AddAuthor($name: String!, $age: Int!){
        addAuthor(name: $name, age: $age){
            name
            age
            id
        }
    }
`;

const updateAuthorMutation = gql`
    mutation UpdateAuthor($name: String!, $age: Int!, $id: ID!){
        updateAuthor(name: $name, age: $age, id: $id){
            name
            age
            id
        }
    }
`;

const updateBookMutation = gql`
    mutation UpdateBook($name: String!, $genre: String!, $authorId: ID!, $id: ID!){
        updateBook(name: $name, genre: $genre, authorId: $authorId, id: $id){
            id
            name
            genre
            author {
                id
                name
                books {
                    id
                    name
                    genre
                }
            }
        }
    }
`;

const getBookQuery = gql`
    query GetBook($id: ID){
        book(id: $id) {
            id
            name
            genre
            author {
                id
                name
                age
                books {
                    name
                    id
                }
            }
        }
    }
`;

const deleteBookMutation = gql` 
    mutation deleteBook($id: ID!){
        deleteBook(id: $id)
    }
`;

const deleteAuthorMutation = gql` 
    mutation deleteAuthor($id: ID!){
        deleteAuthor(id: $id)
    }
`;

export {
    getAuthorsQuery,
    getBooksQuery,
    addBookMutation,
    getBookQuery,
    deleteBookMutation,
    addAuthorMutation,
    deleteAuthorMutation,
    updateAuthorMutation,
    updateBookMutation
};