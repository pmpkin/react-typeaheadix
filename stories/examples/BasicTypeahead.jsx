import React from 'react';
import Typeahead from '../../src/components/Typeahead';
import options from './fake-data';

class OptionTemplate extends React.Component {
    render() {
        const { data, isSelected } = this.props;
        return (
            <span className={`dropdown-option ${isSelected ? 'selected' : ''}`}>
                {data.name}
            </span>
        )
    }

}

class BasicTypeahead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options,
            inputValue: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.onOptionChange = this.onOptionClick.bind(this);
    }

    onChange(e) {
        this.setState({
            inputValue: e.currentTarget.value
        })
    }

    onOptionClick(e, person, index) {
        console.log(person);
        this.setState({
            inputValue: person.name
        })
    }
    onOptionChange(e, person, index) {
        console.log(person);
        this.setState({
            inputValue: person.name
        })
    }

    render() {
        return (
            <div>
                <Typeahead
                    inputId="basic"
                    onChange={this.onChange}
                    onOptionClick={this.onOptionClick}
                    onOptionChange={this.onOptionChange}
                    inputValue={this.state.inputValue}
                    options={this.state.options}
                    optionTemplate={OptionTemplate}
                />
            </div>
        )
    }
}

export default BasicTypeahead;
