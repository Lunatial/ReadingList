import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {getBookQuery, deleteBookMutation, getBooksQuery} from '../queries/queries';
import {NotificationManager} from 'react-notifications';

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
                            });
                            NotificationManager.success('The book is removed.')
                        }}
                    >X
                    </button>
                    <p><strong>Author:</strong> {book.author ? book.author.name : "Unknown author"}<br/>
                        <strong>Age of the author:</strong> {book.author ? book.author.age : "Unknown author"}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>All books by this author:</strong></p>
                    <ul className="other-books">
                        {book.author
                            ? book.author.books.map(item => {
                                return <li key={item.id}>{item.name}</li>
                            })
                            : "Unknown author"
                        }
                    </ul>
                    {/*<pre>{JSON.stringify(book, null, 4)}</pre>*/}
                    <hr/>
                    <pre>{JSON.stringify(this.props, null, 4)}</pre>
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
        options: props => {
            return {
                variables: {
                    id: props.bookId
                }
            }
        }
    }),
    graphql(deleteBookMutation, {name: "deleteBookMutation"}))(BookDetails);