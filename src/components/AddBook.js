import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {NotificationManager} from "react-notifications";

import {getAuthorsQuery, addBookMutation, getBooksQuery, getBookQuery, updateBookMutation} from '../queries/queries';
import {compare} from '../common'

class AddBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            genre: '',
            authorId: '',
            bookId: '',
            isbn: ''
        };
    }

    displayAuthors = () => {
        let data = this.props.getAuthorsQuery;
        if (data.loading) {
            return (<option disabled>Loading authors</option>);
        } else {
            let myObject = Object.assign([], data.authors);
            myObject.sort(compare);
            return myObject.map(author => {
                return (<option key={author.id} value={author.id}>{author.name}</option>);
            });
        }
    }

    displayBooks = () => {
        let data = this.props.getBooksQuery;
        if (data.loading) {
            return (<option disabled>Loading books</option>);
        } else {
            let myObject = Object.assign([], data.books);
            myObject.sort(compare);
            return myObject.map(book => {
                return (<option key={book.id} value={book.id}>{book.name}</option>);
            });
        }
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    addBook = e => {
        let data = this.props.getBooksQuery;
        e.preventDefault();
        if (this.state.bookId === '') {
            if (data.books.map(book => book.name).includes(this.state.name)) {
                NotificationManager.warning('Book already exists ...');
                return
            }
            try {
                this.props.addBookMutation({
                    variables: {
                        name: this.state.name,
                        genre: this.state.genre,
                        isbn: this.state.isbn,
                        authorId: this.state.authorId
                    },
                    refetchQueries: [
                        {query: getBooksQuery},
                        {query: getBookQuery}
                    ]
                });
                NotificationManager.success(`${this.state.name} is now in the database!`);
                this.setState({
                    name: '',
                    genre: '',
                    isbn: '',
                    authorId: ''
                })
            }
            catch (err) {
                NotificationManager.error(`${err}`)
            }
        } else {
            try {
                this.props.updateBookMutation({
                    variables: {
                        id: this.state.bookId,
                        authorId: this.state.authorId,
                        name: this.state.name,
                        isbn: this.state.isbn,
                        genre: this.state.genre
                    },
                    refetchQueries: [
                        {query: getBooksQuery},
                        {query: getBookQuery},
                    ]
                })
            }
            catch (err) {
                NotificationManager.error(`${err}`)
            }
            NotificationManager.success('Successful upgrade!')
        }
    }

    bookChange = e => {
        const {books} = this.props.getBooksQuery;
        const {name, value} = e.target;
        this.setState({
            [name]: value,
            name: value !== '' ? books.find(book => book.id === value).name : '',
            genre: value !== '' ? books.find(book => book.id === value).genre : '',
            isbn: value !== '' ? (books.find(book => book.id === value).isbn !== null && books.find(book => book.id === value).isbn) : '',
            authorId: value !== '' ? books.find(book => book.id === value).author.id : '',
        });
    }

    render() {
        return (
            <form id="add-book">
                <div className="field">
                    <label>Book name:</label>
                    <input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="field">
                    <label>Genre:</label>
                    <input
                        type="text"
                        name="genre"
                        value={this.state.genre}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="field">
                    <label>ISBN:</label>
                    <input
                        type="text"
                        name="isbn"
                        value={this.state.isbn === false ? "" : this.state.isbn}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="field">
                    <label>Author:</label>
                    <select
                        name="authorId"
                        value={this.state.authorId}
                        onChange={this.handleChange}
                    >
                        <option value="">Select author</option>
                        {this.displayAuthors()}
                    </select>
                </div>
                <hr/>
                <div className="field">
                    <label>Book:</label>
                    <select
                        name="bookId"
                        value={this.state.bookId}
                        onChange={this.bookChange}
                    >
                        <option value="">Select book</option>
                        {this.displayBooks()}
                    </select>
                </div>
                <button
                    id="add-book-btn"
                    onClick={this.addBook}
                >+
                </button>
            </form>
        );
    }
}

export default compose(
    graphql(getAuthorsQuery, {name: "getAuthorsQuery"}),
    graphql(addBookMutation, {
        name: "addBookMutation",
        options: {
            refetchQueries: ['getBookQuery', 'getBooksQuery']
        }
    }),
    graphql(updateBookMutation, {
        name: "updateBookMutation",
        options: {
            refetchQueries: ['getBookQuery']
        }
    }),
    graphql(getBookQuery, {name: "getBookQuery"}),
    graphql(getBooksQuery, {name: "getBooksQuery"})
)(AddBook);