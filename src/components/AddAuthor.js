import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {
    getAuthorsQuery,
    addAuthorMutation,
    deleteAuthorMutation,
    updateAuthorMutation
} from '../queries/queries';
import {NotificationManager,} from 'react-notifications';

import Select from 'react-select';

class AddAuthor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorName: '',
            authorAge: '',
            authorId: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.authorChange = this.authorChange.bind(this);
        this.addAuthor = this.addAuthor.bind(this);
        this.removeAuthor = this.removeAuthor.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    authorChange(e) {
        let data = this.props.getAuthorsQuery;

        this.setState({
            [e.target.name]: e.target.value,
            authorName: e.target.value !== '' ? data.authors.find(author => author.id === e.target.value).name : '',
            authorAge: e.target.value !== '' ? data.authors.find(author => author.id === e.target.value).age : '',
        });
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

    displayAuthors() {
        let data = this.props.getAuthorsQuery;
        if (data.loading) {
            return (<option disabled>Loading authors</option>);
        } else {
            let myObject = Object.assign([], data.authors);
            myObject.sort(this.compare);
            return myObject.map(author => {
                return (<option key={author.id} value={author.id}>{author.name}</option>);
            });
        }
    }

    addAuthor(e) {
        let data = this.props.getAuthorsQuery;
        e.preventDefault();
        if (this.state.authorId === '') {
            if (data.authors.map(author => author.name).includes(this.state.authorName)) {
                NotificationManager.warning('Author already exists ...');
                return
            }
            this.props.addAuthorMutation({
                variables: {
                    name: this.state.authorName,
                    age: this.state.authorAge
                },
                refetchQueries: [{query: getAuthorsQuery}]
            });
            NotificationManager.success(`${this.state.authorName} is now in the database!`);
            this.setState({
                authorName: '',
                authorAge: '',
                authorId: '',
            });
        } else {
            this.props.updateAuthorMutation({
                variables: {
                    id: this.state.authorId,
                    name: this.state.authorName,
                    age: this.state.authorAge
                },
                refetchQueries: [{query: getAuthorsQuery}]
            });
            NotificationManager.success('Successful upgrade!');
        }
    }

    removeAuthor(e) {
        e.preventDefault();
        this.props.deleteAuthorMutation({
            variables: {
                id: this.state.authorId
            },
            refetchQueries: [
                {query: getAuthorsQuery},
            ]
        });
        NotificationManager.info('Successfully deleted');
        this.setState({
            authorName: '',
            authorAge: '',
            authorId: "",
        })
    }

    render() {
        return (
            <form id="add-author">
                <div className="field">
                    <label>Author name:</label>
                    <input
                        type="text"
                        name="authorName"
                        value={this.state.authorName}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="field">
                    <label>Author age:</label>
                    <input
                        type="text"
                        name="authorAge"
                        value={this.state.authorAge}
                        onChange={this.handleChange}
                    />
                </div>
                <hr/>
                <div className="field">
                    <label>Author:</label>
                    <select
                        name="authorId"
                        value={this.state.authorId}
                        onChange={this.authorChange}
                    >
                        <option value="">Select author</option>
                        {this.displayAuthors()}
                    </select>
                </div>

                <div
                    className="field"
                >
                    <label>Author:</label>
                    <Select
                        options={
                            this.props.getAuthorsQuery.authors
                            && this.props.getAuthorsQuery.authors.map(author => ({
                                label: author.name,
                                value: author.id
                            }))}
                        placeholder="Select author"
                        isClearable
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                                ...theme.colors,
                                text: 'orangered',
                                primary25: 'hotpink',
                                primary: 'black',
                            },
                        })}
                    />
                </div>

                <button
                    id="add-author-btn"
                    onClick={this.addAuthor}
                >+
                </button>
                <button
                    id="rmv-author-btn"
                    onClick={this.removeAuthor}
                >-
                </button>

            </form>
        );
    }
}

export default compose(
    graphql(addAuthorMutation, {name: "addAuthorMutation"}),
    graphql(getAuthorsQuery, {name: "getAuthorsQuery"}),
    graphql(deleteAuthorMutation, {name: "deleteAuthorMutation"}),
    graphql(updateAuthorMutation, {name: "updateAuthorMutation"}),
)(AddAuthor);