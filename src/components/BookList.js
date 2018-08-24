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

    compare = (a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        let comparison = 0;
        if (nameA > nameB) {
            comparison = 1;
        } else if (nameA < nameB) {
            comparison = -1;
        }
        return comparison;
    };

    displayBooks() {
        const data = this.props.data;
        if (data.loading) {
            return (<div>Loading books...</div>);
        } else {
            let myObject = Object.assign([], data.books);
            myObject.sort(this.compare);
            return myObject.map(book => {
                return (
                    <li key={book.id}
                        onClick={() => this.setState({selected: book.id})}
                        style={{
                            backgroundColor: this.state.selected === book.id ? "#B0E0E6" : ""
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