import React, { Component, PropTypes } from 'react';

const style = {
    left: '-9999px',
    position: 'absolute'
};

export default class AriaStatus extends Component {

    static propTypes = {
        message: PropTypes.string
    }

    componentDidMount() {
        this.setTextContent(this.props.message);
    }

    componentDidUpdate() {
        this.setTextContent(this.props.message);
    }

    setTextContent(textContent = '') {
        this.span.textContent = textContent;
    }

    render() {
        return (
            <span role="status" aria-live="polite" style={style} ref={c => (this.span = c)} />
        );
    }
}
