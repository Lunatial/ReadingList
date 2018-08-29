import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {getBookQuery, deleteBookMutation, getBooksQuery} from '../queries/queries';
import {NotificationManager} from 'react-notifications';

import {CircleLoader} from 'react-spinners'

class BookDetails extends Component {

    displayBookDetails() {
        const {book} = this.props.data;
        const {bookData} = this.props;
        if (book) {
            return (
                <div>
                    <h2>{book.name}</h2>
                    {
                        bookData &&
                        bookData.volumeInfo.subtitle &&
                        <h4>{bookData.volumeInfo.subtitle}</h4>
                    }
                    <button
                        id="delete-button"
                        onClick={() => {
                            this.props.deleteBookMutation({
                                variables: {
                                    id: this.props.bookId
                                },
                                refetchQueries: [
                                    {query: getBooksQuery},
                                ]
                            });
                            NotificationManager.success('The book is removed.')
                        }}
                    >X
                    </button>
                    <p>
                        <strong>Author:</strong> {book.author ? book.author.name : "Unknown author"}<br/>
                        <strong>Age of the author:</strong> {book.author ? book.author.age : "Unknown author"}</p>
                    <p><strong>Genre:</strong> {book.genre ? book.genre : "Unknown genre"}</p>
                    {
                        this.props.coverURL &&
                        <div style={{textAlign: "center"}}>
                            <img
                                src={this.props.coverURL}
                                alt={book.name}
                                style={{
                                    height: "250px",
                                    width: "auto"
                                }}
                            />
                        </div>
                    }
                    {
                        book.isbn &&
                        <div>
                            <p><strong>ISBN:</strong> {book.isbn}</p>
                        </div>
                    }
                    {
                        bookData &&
                        bookData.volumeInfo.averageRating &&
                        <div>
                            <p><strong>Average rating:</strong> {bookData.volumeInfo.averageRating}</p>
                        </div>
                    }
                    {
                        bookData &&
                        bookData.volumeInfo.canonicalVolumeLink &&
                        <div>
                            <a href={bookData.volumeInfo.canonicalVolumeLink}
                               style={{color: "white"}}
                               target="_blank"
                            >Volume info link</a>
                        </div>
                    }
                    {
                        bookData &&
                        bookData.volumeInfo.description &&
                        <p><strong>Description:</strong> {bookData.volumeInfo.description}</p>
                    }
                    {
                        bookData &&
                        bookData.volumeInfo.publishedDate &&
                        <div>
                            <p><strong>Published date:</strong> {bookData.volumeInfo.publishedDate}</p>
                        </div>
                    }
                    {
                        bookData &&
                        bookData.volumeInfo.publisher &&
                        <div>
                            <p><strong>Publisher:</strong> {bookData.volumeInfo.publisher}</p>
                        </div>
                    }
                    <div>
                        <p><strong>All books by this author:</strong></p>

                        <ul className="other-books">
                            {
                                book.author
                                    ? book.author.books.map(item => {
                                        return (
                                            <li
                                                key={item.id}
                                                // onClick={this.props.showAuthorsOtherBook(book.id)}
                                            >{item.name}</li>
                                        )
                                    })
                                    : <li>Unknown author</li>
                            }
                        </ul>
                    </div>
                    {/*<hr/>*/}
                    {/*<pre>{JSON.stringify(this.props, null, 4)}</pre>*/}
                </div>
            );
        } else {
            return (
                <div style={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <CircleLoader
                        style={{margin: "auto"}}
                        sizeUnit={"px"}
                        size={50}
                        color={'black'}
                    />
                </div>
            )
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