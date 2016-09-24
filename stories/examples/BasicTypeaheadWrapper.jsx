import React from 'react';
import data from './fake-data';

class BasicTypeaheadWrapper extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: data,
            inputValue: ''
        }
    }

    render() {
        return (
            <div style={{ margin: '30px' }}>
                story
            </div>
        )
    }
}

export default BasicTypeahead;
