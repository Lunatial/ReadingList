import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {getAuthorsQuery, addBookMutation, getBooksQuery, getBookQuery, updateBookMutation} from '../queries/queries';
import {NotificationManager} from "react-notifications";

class AddBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            genre: '',
            authorId: '',
            bookId: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.addBook = this.addBook.bind(this);
        this.bookChange = this.bookChange.bind(this);
    }

    displayAuthors() {
        let data = this.props.getAuthorsQuery;
        if (data.loading) {
            return (<option disabled>Loading authors</option>);
        } else {
            return data.authors.map(author => {
                return (<option key={author.id} value={author.id}>{author.name}</option>);
            });
        }
    }

    displayBooks() {
        let data = this.props.getBooksQuery;
        if (data.loading) {
            return (<option disabled>Loading books</option>);
        } else {
            return data.books.map(book => {
                return (<option key={book.id} value={book.id}>{book.name}</option>);
            });
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    addBook(e) {
        let data = this.props.getBooksQuery;
        e.preventDefault();
        if (this.state.bookId === '') {
            if (data.books.map(book => book.name).includes(this.state.name)) {
                NotificationManager.warning('Book already exists ...');
                return
            }
            this.props.addBookMutation({
                variables: {
                    name: this.state.name,
                    genre: this.state.genre,
                    authorId: this.state.authorId
                },
                refetchQueries: [
                    {query: getBooksQuery}
                ]
            });
            NotificationManager.success(`${this.state.name} is now in the database!`);
            this.setState({
                name: '',
                genre: '',
                authorId: ''
            })
        } else {
            this.props.updateBookMutation({
                variables: {
                    id: this.state.bookId,
                    authorId: this.state.authorId,
                    name: this.state.name,
                    genre: this.state.genre
                },
                refetchQueries: [{query: getBooksQuery}]
            });
            NotificationManager.success('Successful upgrade!');
        }
    }

    bookChange(e) {
        let data = this.props.getBooksQuery;
        this.setState({
            [e.target.name]: e.target.value,
            name: e.target.value !== '' ? data.books.find(book => book.id === e.target.value).name : '',
            genre: e.target.value !== '' ? data.books.find(book => book.id === e.target.value).genre : '',
            authorId: e.target.value !== '' ? data.books.find(book => book.id === e.target.value).author.id : '',
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
    graphql(addBookMutation, {name: "addBookMutation"}),
    graphql(updateBookMutation, {name: "updateBookMutation"}),
    graphql(getBookQuery, {name: "getBookQuery"}),
    graphql(getBooksQuery, {name: "getBooksQuery"})
)(AddBook);