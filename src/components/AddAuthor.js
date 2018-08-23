import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {getAuthorsQuery, addAuthorMutation} from '../queries/queries';

class AddAuthor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorName: '',
            authorAge: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    submitForm(e) {
        e.preventDefault();
        this.props.addAuthorMutation({
            variables: {
                name: this.state.authorName,
                age: this.state.authorAge,
            },
            refetchQueries: [{query: getAuthorsQuery}]
        });
        this.setState({
            authorName: '',
            authorAge: '',
        })
    }

    render() {
        return (
            <form id="add-author" onSubmit={this.submitForm}>
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

                <button>+</button>

            </form>
        );
    }
}

export default graphql(addAuthorMutation, {name: "addAuthorMutation"})(AddAuthor);