import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

const style = {
    left: '-9999px',
    position: 'absolute'
};

export default class AriaStatus extends Component {

    static propTypes = {
        message: PropTypes.string
    }

    componentDidMount() {
        // This is needed as `componentDidUpdate`
        // does not fire on the initial render.
        this.setTextContent(this.props.message);
    }

    componentDidUpdate() {
        this.setTextContent(this.props.message);
    }

    setTextContent(textContent = '') {
        findDOMNode(this).textContent = textContent;
    }

    render() {
        return (
            <span role="status" aria-live="polite" style={style} />
        );
    }
}
