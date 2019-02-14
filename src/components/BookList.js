import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import axios from "axios/index";
import {CircleLoader} from 'react-spinners';

import {getBooksQuery} from '../queries/queries';
import ErrorBoundary from './errorBoundary/ErrorBoundary';
import {compare, compareBack} from '../common';
import BookDetails from './BookDetails';

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            alphabeticOrder: "a-z",
            selectedISBN: "",
            coverURL: "",
            bookData: []
        }
    }

    getBooksApi = book => {
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book.name}`)
            .then(response => {
                this.setState({
                    coverURL: '',
                    selected: '',
                    selectedISBN: '',
                    bookData: ''
                });
                return response;
            })
            .then(response => {
                // handle success
                const {items} = response.data;
                this.setState({
                    coverURL: items && items[0].volumeInfo.imageLinks && items[0].volumeInfo.imageLinks.thumbnail,
                    selected: book.id,
                    selectedISBN: book.isbn,
                    bookData: items && items[0]
                })
            })
            .catch(error => {
                // handle error
                console.log(error);
            })
    }

    bookListItem = book =>
        <li key={book.id}
            onClick={() => this.getBooksApi(book)}
            style={{
                backgroundColor: this.state.selected === book.id ? "#B0E0E6" : ""
            }}
        >
            {book.name}
        </li>;

    displayBooks = () => {
        const data = this.props.data;
        if (data.loading) {
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
        let myObject = Object.assign([], data.books);
        myObject.sort(this.state.alphabeticOrder === "a-z" ? compare : compareBack);
        return myObject.map(book => {
            return (
                this.bookListItem(book)
            );
        })
    }

    showAuthorsOtherBook = bookId => {
        this.state.selected !== bookId && this.setState({selected: bookId});
        let book = this.props.data.books.find(book => book.id === bookId);
        this.getBooksApi(book);
    }

    render() {
        const showSideBar = this.props.data.books
            && this.props.data.books.findIndex(book => book.id === this.state.selected) !== -1;
        return (
            <div>
                <button id="a-z" onClick={() => this.setState({alphabeticOrder: "a-z"})}>A->Z</button>
                <button id="z-a" onClick={() => this.setState({alphabeticOrder: "z-a"})}>Z->A</button>
                <ul id="book-list">
                    {this.displayBooks()}
                </ul>
                {showSideBar &&
                <ErrorBoundary>
                    <BookDetails
                        bookId={this.state.selected}
                        bookISBN={this.state.selectedISBN}
                        coverURL={this.state.coverURL !== '' && this.state.coverURL}
                        bookData={this.state.bookData !== [] && this.state.bookData}
                        showAuthorsOtherBook={this.showAuthorsOtherBook}
                    />
                </ErrorBoundary>
                }
            </div>
        );
    }
}

export default graphql(getBooksQuery)(BookList);