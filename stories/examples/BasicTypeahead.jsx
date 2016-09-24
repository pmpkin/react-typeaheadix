import React from 'react';
import Typeahead from '../../src/components/Typeahead';
import data from './fake-data';

class OptionTemplate extends React.Component {
    render() {
        return <span>{this.props.data.name}{this.props.isSelected ? 'SEL' : ''}</span>
    }

}

class BasicTypeahead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: data,
            inputValue: ''
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({
            inputValue: e.currentTarget.value
        })
    }

    render() {
        return (
            <div>
                <Typeahead
                    inputId="basic"
                    onChange={this.onChange}
                    inputValue={this.state.inputValue}
                    options={this.state.options}
                    optionTemplate={OptionTemplate}
                />
            </div>
        )
    }
}

export default BasicTypeahead;
