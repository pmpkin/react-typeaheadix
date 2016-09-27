import React, { Component, PropTypes } from 'react';

export default class Input extends Component {

    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func
    }

    static defaultProps = {
        value: '',
        onChange() {}
    }

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const dir = this.props.dir;
        if (dir === null || dir === undefined) {
            this.input.removeAttribute('dir');
        }
    }

    blur() {
        this.input.blur();
    }

    focus() {
        this.input.focus();
    }

    isCursorAtEnd() {
        const valueLength = this.props.value.length;
        return this.input.selectionStart === valueLength &&
               this.input.selectionEnd === valueLength;
    }

    render() {
        return (
            <input {...this.props} onChange={this.props.onChange} ref={c => (this.input = c)} />
        );
    }
}
