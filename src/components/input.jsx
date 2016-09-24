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
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate() {
        const dir = this.props.dir;

        if (dir === null || dir === undefined) {
            // When setting an attribute to null/undefined,
            // React instead sets the attribute to an empty string.

            // This is not desired because of a possible bug in Chrome.
            // If the page is RTL, and the input's `dir` attribute is set
            // to an empty string, Chrome assumes LTR, which isn't what we want.
            this.input.removeAttribute('dir');
        }
    }

    handleChange(event) {
        // There are several React bugs in IE,
        // where the `input`'s `onChange` event is
        // fired even when the value didn't change.
        // https://github.com/facebook/react/issues/2185
        // https://github.com/facebook/react/issues/3377
        if (event.target.value !== this.props.value) {
            this.props.onChange(event);
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
            <input {...this.props} onChange={this.handleChange} ref={c => (this.input = c)} />
        );
    }
}
