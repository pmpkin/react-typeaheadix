import React from 'react';
import data from './fake-data';

class BasicTypeahead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data
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
