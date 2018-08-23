import React, {Component} from 'react';
import {graphql,} from 'react-apollo';
import {getBooksQuery,} from '../queries/queries';

// components
import BookDetails from './BookDetails';

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
    }

    displayBooks() {
        const data = this.props.data;
        if (data.loading) {
            return (<div>Loading books...</div>);
        } else {
            return data.books.map(book => {
                return (
                    <li key={book.id}
                        onClick={(event) => {
                            this.setState({selected: book.id});
                        }}
                        style={{
                            backgroundColor: this.state.selected === book.id ? "pink" : ""
                        }}
                    >
                        {book.name}
                    </li>
                );
            })
        }
    }

    render() {
        const showSideBar = this.props.data.books
            && this.props.data.books.findIndex(book => book.id === this.state.selected) !== -1;
        return (
            <div>
                <ul id="book-list">
                    {this.displayBooks()}
                </ul>
                {showSideBar && <BookDetails bookId={this.state.selected}/>}
            </div>
        );
    }
}

export default graphql(getBooksQuery)(BookList);