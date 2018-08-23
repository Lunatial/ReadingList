import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {getBookQuery, deleteBookMutation, getBooksQuery} from '../queries/queries';

class BookDetails extends Component {

    displayBookDetails() {
        const {book} = this.props.data;
        if (book) {
            return (
                <div>
                    <h2>{book.name}</h2>
                    <button
                        id="delete-button"
                        onClick={() => {
                            this.props.deleteBookMutation({
                                variables: {
                                    id: this.props.bookId
                                },
                                refetchQueries: [
                                    {query: getBooksQuery},
                                    {query: getBookQuery}
                                ]
                            })
                        }}
                    >X
                    </button>
                    <p><strong>Author:</strong> {book.author.name}<br/>
                        <strong>Age of the author:</strong> {book.author.age}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>All books by this author:</strong></p>
                    <ul className="other-books">
                        {book.author.books.map(item => {
                            return <li key={item.id}>{item.name}</li>
                        })}
                    </ul>
                    <pre>{JSON.stringify(book, null, 4)}</pre>
                </div>
            );
        } else {
            return (<div>No book selected...</div>);
        }
    }

    render() {
        return (
            <div id="book-details">
                {this.displayBookDetails()}
            </div>
        );
    }
}

export default compose(
    graphql(getBookQuery, {
        options: (props) => {
            return {
                variables: {
                    id: props.bookId
                }
            }
        }
    }),
    graphql(deleteBookMutation, {name: "deleteBookMutation"}))(BookDetails);