import React, { Component, PropTypes } from 'react';
import Input from './Input';
import AriaStatus from './AriaStatus';
import getTextDirection from '../utils/get_text_direction';

function noop() {}

export default class Typeahead extends Component {

    static propTypes = {
        inputId: PropTypes.string,
        inputName: PropTypes.string,
        className: PropTypes.string,
        autoFocus: PropTypes.bool,
        hoverSelect: PropTypes.bool,
        inputValue: PropTypes.string,
        options: PropTypes.array,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        onKeyDown: PropTypes.func,
        onKeyPress: PropTypes.func,
        onKeyUp: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onSelect: PropTypes.func,
        onInputClick: PropTypes.func,
        handleHint: PropTypes.func,
        onComplete: PropTypes.func,
        onOptionClick: PropTypes.func,
        onOptionChange: PropTypes.func,
        onDropdownOpen: PropTypes.func,
        onDropdownClose: PropTypes.func,
        optionTemplate: PropTypes.func.isRequired,
        getMessageForOption: PropTypes.func,
        getMessageForIncomingOptions: PropTypes.func,
        ignoreFocusLossFor: PropTypes.array
    }

    static defaultProps = {
        className: '',
        inputValue: '',
        options: [],
        hoverSelect: true,
        onFocus: noop,
        onKeyDown: noop,
        onChange: noop,
        onInputClick: noop,
        handleHint: () => (''),
        onOptionClick: noop,
        onOptionChange: noop,
        onComplete: noop,
        onDropdownOpen: noop,
        onDropdownClose: noop,
        ignoreFocusLossFor: [],
        getMessageForOption: () => (''),
        getMessageForIncomingOptions: (number) => (`${number} suggestions are available. Use up and down arrows to select.`)
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1,
            isHintVisible: false,
            isDropdownVisible: false
        };
    }

    componentDidMount() {
        // The `focus` event does not bubble, so we must capture it instead.
        // This closes Typeahead's dropdown whenever something else gains focus.
        window.addEventListener('focus', this.handleWindowClose, true);

        // If we click anywhere outside of Typeahead, close the dropdown.
        window.addEventListener('click', this.handleWindowClose, false);
    }

    componentWillReceiveProps(nextProps) {
        const { inputValue, options } = nextProps;
        const valueLength = inputValue.length;

        // A visible part of the hint must be
        // available for us to complete it.
        const isHintVisible = valueLength > 0 &&
            nextProps.handleHint(inputValue, options).slice(valueLength).length > 0;

        this.setState({
            isHintVisible
        });
    }

    componentWillUnmount() {
        window.removeEventListener('focus', this.handleWindowClose, true);
        window.removeEventListener('click', this.handleWindowClose, false);
    }

    setSelectedIndex(index, callback) {
        this.setState({
            selectedIndex: index
        }, callback);
    }

    hideHint() {
        this.setState({
            isHintVisible: false
        });
    }

    showHint() {
        const { inputValue, options, handleHint } = this.props;
        const inputValueLength = inputValue.length;

        // A visible part of the hint must be
        // available for us to complete it.
        const isHintVisible = inputValueLength > 0 &&
                handleHint(inputValue, options).slice(inputValueLength).length > 0;

        this.setState({
            isHintVisible
        });
    }

    hideDropdown() {
        if (this.state.isDropdownVisible) {
            this.setState({
                isDropdownVisible: false
            }, () => {
                this.props.onDropdownClose();
            });
        }
    }

    showDropdown() {
        if (!this.state.isDropdownVisible) {
            this.setState({
                isDropdownVisible: true
            }, () => {
                this.props.onDropdownOpen();
            });
        }
    }

    handleChange(event) {
        this.showHint();
        this.showDropdown();
        this.setSelectedIndex(-1);
        this.props.onChange(event);
        this.userInputValue = event.target.value;
    }

    focus() {
        this.refs.input.focus();
    }

    handleFocus(event) {
        this.showDropdown();
        this.props.onFocus(event);
    }

    handleClick(event) {
        this.showHint();
        this.props.onInputClick(event);
    }

    navigate(direction, callback) {
        const minIndex = -1;
        const maxIndex = this.props.options.length - 1;
        let index = this.state.selectedIndex + direction;

        if (index > maxIndex) {
            index = minIndex;
        } else if (index < minIndex) {
            index = maxIndex;
        }

        this.setSelectedIndex(index, callback);
    }

    handleKeyDown(event) {
        const { isHintVisible, isDropdownVisible, selectedIndex } = this.state;
        const { inputValue, options, onComplete, handleHint, onOptionChange, onKeyDown } = this.props;
        const input = this.refs.input;


        let hasHandledKeyDown = false;
        let index;
        let optionData;
        let dir;

        switch (event.key) {
        case 'End':
        case 'Tab':
            if (isHintVisible && !event.shiftKey) {
                event.preventDefault();
                onComplete(event, handleHint(inputValue, options));
            }
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            if (isHintVisible && !event.shiftKey && input.isCursorAtEnd()) {
                dir = getTextDirection(inputValue);

                if ((dir === 'ltr' && event.key === 'ArrowRight') || (dir === 'rtl' && event.key === 'ArrowLeft')) {
                    onComplete(event, handleHint(inputValue, options));
                }
            }
            break;
        case 'Enter':
            this.focus();
            this.hideHint();
            this.hideDropdown();
            break;
        case 'Escape':
            this.hideHint();
            this.hideDropdown();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            if (options.length > 0) {
                event.preventDefault();

                this.showHint();
                this.showDropdown();

                if (isDropdownVisible) {
                    dir = event.key === 'ArrowUp' ? -1 : 1;
                    hasHandledKeyDown = true;

                    this.navigate(dir, () => {
                        let dropdown, selectedOption, optionOffsetTop = 0;
                        optionData = this.previousInputValue;


                        // We're currently on an option.
                        if (selectedIndex >= 0) {
                            // Save the current `input` value,
                            // as we might arrow back to it later.
                            if (this.previousInputValue === null) {
                                this.previousInputValue = inputValue;
                            }

                            optionData = options[selectedIndex];

                            // Make selected option always scroll to visible
                            dropdown = React.findDOMNode(this.refs.dropdown);
                            selectedOption = dropdown.children[selectedIndex];
                            optionOffsetTop = selectedOption.offsetTop;
                            if (optionOffsetTop + selectedOption.clientHeight > dropdown.clientHeight ||
                                optionOffsetTop < dropdown.scrollTop) {
                                dropdown.scrollTop = optionOffsetTop;
                            }
                        }

                        onOptionChange(event, optionData, selectedIndex);
                        onKeyDown(event, optionData, selectedIndex);
                    });
                }
            }

            break;
        }

        if (!hasHandledKeyDown) {
            optionData = selectedIndex < 0 ? inputValue : options[selectedIndex];
            onKeyDown(event, optionData, index);
        }
    }

    handleOptionClick(selectedIndex, event) {
        const { options, onOptionClick } = this.props;

        this.focus();
        this.hideHint();
        this.hideDropdown();
        this.setSelectedIndex(selectedIndex);
        onOptionClick(event, options[selectedIndex], selectedIndex);
    }

    handleOptionMouseOver(selectedIndex) {
        if (this.props.hoverSelect) {
            this.setSelectedIndex(selectedIndex);
        }
    }

    handleMouseOut() {
        if (this.props.hoverSelect) {
            this.setSelectedIndex(-1);
        }
    }

    handleWindowClose(event) {
        const target = event.target;

        if (target !== window && !this.getDOMNode().contains(target) && this.props.ignoreFocusLossFor.indexOf(target.id) < 0) {
            this.hideHint();
            this.hideDropdown();
        }
    }

    renderInput() {
        const { inputId, inputName, inputValue, autoFocus, placeholder, options, handleHint, onBlur, onSelect, onKeyUp, onKeyPress } = this.props;
        const { isDropdownVisible } = this.state;
        const className = 'react-typeahead-input';
        const inputDirection = getTextDirection(inputValue);

        return (
            <div className="react-typeahead-input-container">
                <Input
                    disabled
                    role="presentation"
                    aria-hidden
                    dir={inputDirection}
                    className="react-typeahead-input react-typeahead-hint"
                    style={{
                        color: 'silver',
                        WebkitTextFillColor: 'silver',
                        position: 'absolute'
                    }}
                    value={this.state.isHintVisible ? handleHint(inputValue, options) : null}
                />
                <Input
                    ref="input"
                    role="combobox"
                    aria-owns={`react-typeahead-options-${inputId}`}
                    aria-expanded={isDropdownVisible}
                    aria-autocomplete="both"
                    aria-activedescendant={`react-typeahead-activedescendant-${inputId}`}
                    value={inputValue}
                    spellCheck={false}
                    autoComplete={false}
                    autoCorrect={false}
                    dir={inputDirection}
                    onClick={this.handleClick}
                    onFocus={this.handleFocus}
                    onBlur={onBlur}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    id={inputId}
                    name={inputName}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    onSelect={onSelect}
                    onKeyUp={onKeyUp}
                    onKeyPress={onKeyPress}
                    className={`${className} react-typeahead-usertext`}
                    style={{
                        position: 'relative',
                        background: 'transparent'
                    }}
                />
            </div>
        );
    }

    renderDropdownOption(props, option, index, selectedIndex) {
        const { OptionTemplate, inputValue, inputId } = props;
        const isSelected = index === selectedIndex;
        return (
            <li
                id={isSelected ? `react-typeahead-activedescendant-${inputId}` : null}
                aria-selected={isSelected}
                role="option"
                key={index}
                onClick={() => this.handleOptionClick(index)}
                onMouseOver={() => this.handleOptionMouseOver(index)}
            >

                <OptionTemplate
                    data={option}
                    index={index}
                    userInputValue={this.userInputValue}
                    inputValue={inputValue}
                    isSelected={isSelected}
                />
            </li>
        );
    }

    renderDropdown() {
        const { inputId, options } = this.props;
        const { selectedIndex, isDropdownVisible } = this.state;

        if (options.length < 1) {
            return null;
        }

        const className = `react-typeahead-options ${isDropdownVisible ? 'open' : ''}`;

        return (
            <ul
                id={`react-typeahead-options-${inputId}`}
                ref="dropdown"
                role="listbox"
                aria-hidden={!isDropdownVisible}
                className={className}
                onMouseOut={this.handleMouseOut}
            >
                {
                    options.map((data, index) => this.renderDropdownOption(this.props, data, index, selectedIndex))
                }
            </ul>
        );
    }

    renderAriaMessageForOptions() {
        const { inputValue, options, getMessageForOption } = this.props;
        const { selectedIndex } = this.state;
        const option = options[selectedIndex] || inputValue;

        return <AriaStatus message={getMessageForOption(option) || inputValue} />
    }

    renderAriaMessageForIncomingOptions() {
        const { options, getMessageForIncomingOptions } = this.props;

        return <AriaStatus message={getMessageForIncomingOptions(options.length)} />
    }

    render() {
        return (
            <div className={`react-typeahead-container ${this.props.className}`}>
                {this.renderInput()}
                {this.renderDropdown()}
                {this.renderAriaMessageForOptions()}
                {this.renderAriaMessageForIncomingOptions()}
            </div>
        );
    }
}
