import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {getAuthorsQuery, addBookMutation, getBooksQuery} from '../queries/queries';

class AddBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            genre: '',
            authorId: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
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

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    submitForm(e) {
        e.preventDefault();
        this.props.addBookMutation({
            variables: {
                name: this.state.name,
                genre: this.state.genre,
                authorId: this.state.authorId
            },
            refetchQueries: [
                {query: getBooksQuery},
                {query: getAuthorsQuery}
                ]
        });
        this.setState({
            name: '',
            genre: '',
            authorId: ''
        })
    }

    render() {
        return (
            <form id="add-book" onSubmit={this.submitForm}>
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
                        <option>Select author</option>
                        {this.displayAuthors()}
                    </select>
                </div>

                <button>+</button>

            </form>
        );
    }
}

export default compose(
    graphql(getAuthorsQuery, {name: "getAuthorsQuery"}),
    graphql(addBookMutation, {name: "addBookMutation"})
)(AddBook);