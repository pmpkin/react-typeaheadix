import React from 'react';
import Typeahead from '../../src/components/Typeahead';
import options from './fake-data';

const OptionTemplate = ({ data, isSelected }) => (
    <span className={`dropdown-option ${isSelected ? 'selected' : ''}`}>
        {data.name}
    </span>
)

class BasicTypeahead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            inputValue: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
        this.onOptionChange = this.onOptionClick.bind(this);
        this.handleHint = this.handleHint.bind(this);
    }

    onChange(e) {
        this.setState({
            inputValue: e.currentTarget.value,
            options: options.filter(person => person.name.indexOf(e.currentTarget.value) > -1)
        });
    }

    onOptionClick(e, person, index) {
        console.log('click', person);
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

    handleHint(inputValue, items) {
        if (new RegExp('^' + inputValue).test(items[0].name)) {
            return items[0].name;
        }
        return '';
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
