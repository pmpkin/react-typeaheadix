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
        this.onOptionChange = this.onOptionChange.bind(this);
        this.handleHint = this.handleHint.bind(this);
        this.handleCompleteHint = this.handleCompleteHint.bind(this);
    }

    onChange(e) {
        this.setState({
            inputValue: e.currentTarget.value,
            options: options.filter(person => e.currentTarget.value && new RegExp(`^${e.currentTarget.value}`).test(person.name))
        });
    }

    onOptionClick(e, person, index) {
        console.log('click', person, index);
        this.setState({
            inputValue: person.name
        })
    }
    onOptionChange(e, person, index) {
        console.log('optionChange', person, index);
        this.setState({
            inputValue: person.name
        })
    }

    handleHint(inputValue, items) {
        if (items && items.length && new RegExp(`^${inputValue}`).test(items[0].name)) {
            return items[0].name;
        }
        return '';
    }

    handleCompleteHint(event, completedInputValue) {
        this.setState({
            inputValue: completedInputValue
        });
    }

    render() {
        return (
            <div>
                <p>Typeahead with hint</p>
                <Typeahead
                    inputId="basic"
                    onChange={this.onChange}
                    onOptionClick={this.onOptionClick}
                    onOptionChange={this.onOptionChange}
                    onCompleteHint={this.handleCompleteHint}
                    inputValue={this.state.inputValue}
                    handleHint={this.handleHint}
                    options={this.state.options}
                    optionTemplate={OptionTemplate}
                />
                <p>Typeahead without hint</p>
                <Typeahead
                    inputId="basicNoHint"
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
