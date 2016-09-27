import React, { Component, PropTypes } from 'react';
import Input from './Input';
import AriaStatus from './AriaStatus';
import getTextDirection from '../utils/text-direction';

const defaultStyles = {
    container: {
        position: 'relative'
    },
    inputContainer: {
        position: 'relative',
        width: '100%'
    },
    hint: {
        color: 'silver',
        WebkitTextFillColor: 'silver',
        position: 'absolute',
        width: '100%'
    },
    input: {
        position: 'relative',
        background: 'rgba(0,0,0,0)',
        width: '100%'
    },
    dropdown: {
        width: '100%',
        zIndex: 1200,
        background: '#fff',
        position: 'absolute',
        boxSizing: 'border-box',
        display: 'none'
    }
};

const defaultClassnames = {
    container: 'react-typeaheadix-container',
    dropdownOpen: 'dropdown-open',
    inputContainer: 'react-typeaheadix-input-container',
    hint: 'react-typeaheadix-hint',
    input: 'react-typeaheadix-input',
    dropdown: 'react-typeaheadix-dropdown'
};

function noop() {}

class Typeahead extends Component {

    static propTypes = {
        inputId: PropTypes.string,
        inputName: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        defaultClassnames: PropTypes.object,
        autoFocus: PropTypes.bool,
        selectOnOptionHover: PropTypes.bool,
        selectOnOptionNavigate: PropTypes.bool,
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
        onCompleteHint: PropTypes.func,
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
        defaultClassnames,
        style: defaultStyles,
        inputValue: '',
        options: [],
        selectOnOptionHover: false,
        selectOnOptionNavigate: false,
        onFocus: noop,
        onBlur: noop,
        onKeyDown: noop,
        onChange: noop,
        onInputClick: noop,
        handleHint: () => (''),
        onOptionClick: noop,
        onOptionChange: noop,
        onCompleteHint: noop,
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
        // bind methods
        this.showHint = this.showHint.bind(this);
        this.hideHint = this.hideHint.bind(this);
        this.showDropdown = this.showDropdown.bind(this);
        this.hideDropdown = this.hideDropdown.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleOptionMouseOver = this.handleOptionMouseOver.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleWindowClose = this.handleWindowClose.bind(this);
        this.focus = this.focus.bind(this);
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
        this.input.focus();
    }

    handleFocus(event) {
        this.showDropdown();
        this.props.onFocus(event);
    }

    handleClick(event) {
        this.showHint();
        if (!this.state.isDropdownVisible) this.showDropdown();
        this.props.onInputClick(event);
    }

    navigate(direction, callback) {
        const minIndex = 0;
        const maxIndex = this.props.options.length - 1;
        let index = this.state.selectedIndex + direction;

        if (index > maxIndex) {
            index = minIndex;
        } else if (index < minIndex) {
            index = maxIndex;
        }

        this.setState({
            selectedIndex: index
        }, callback);
    }

    handleKeyDown(event) {
        const { isHintVisible, isDropdownVisible } = this.state;
        const { inputValue, options, onCompleteHint, handleHint, onOptionChange, onKeyDown } = this.props;

        let hasHandledKeyDown = false;
        let index;
        let optionData;
        let dir;

        switch (event.key) {
        case 'End':
            if (isHintVisible && !event.shiftKey) {
                event.preventDefault();
                onCompleteHint(event, handleHint(inputValue, options));
            }
            break;
        case 'Tab':
            this.hideHint();
            this.hideDropdown();
            this.input.blur();
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            if (isHintVisible && !event.shiftKey && this.input.isCursorAtEnd()) {
                dir = getTextDirection(inputValue);

                if ((dir === 'ltr' && event.key === 'ArrowRight') || (dir === 'rtl' && event.key === 'ArrowLeft')) {
                    onCompleteHint(event, handleHint(inputValue, options));
                }
            }
            break;
        case 'Enter':
            if (this.state.isHintVisible && this.state.selectedIndex < 1) {
                onCompleteHint(event, handleHint(inputValue, options));
            } else if (this.state.selectedIndex > -1) {
                onOptionChange(event, options[this.state.selectedIndex], this.state.selectedIndex);
            }

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
                        let dropdown;
                        let selectedOption
                        let optionOffsetTop = 0;
                        optionData = this.previousInputValue;


                        // We're currently on an option.
                        if (this.state.selectedIndex >= 0) {
                            // Save the current `input` value,
                            // as we might arrow back to it later.
                            if (this.previousInputValue === null) {
                                this.previousInputValue = inputValue;
                            }

                            optionData = options[this.state.selectedIndex];

                            // Make selected option always scroll to visible
                            selectedOption = this.dropdown.children[this.state.selectedIndex];
                            optionOffsetTop = selectedOption.offsetTop;
                            if (optionOffsetTop + selectedOption.clientHeight > this.dropdown.clientHeight ||
                                optionOffsetTop < this.dropdown.scrollTop) {
                                dropdown.scrollTop = optionOffsetTop;
                            }
                        }
                        if (this.props.selectOnOptionNavigate) {
                            onOptionChange(event, optionData, this.state.selectedIndex);
                        }

                        onKeyDown(event, optionData, this.state.selectedIndex);
                    });
                }
            }
            break;
            default:
                break;
        }

        if (!hasHandledKeyDown) {
            optionData = this.state.selectedIndex < 0 ? inputValue : options[this.state.selectedIndex];
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
        if (this.props.selectOnOptionHover) {
            this.setSelectedIndex(selectedIndex);
        }
    }

    handleMouseOut() {
        if (this.props.selectOnOptionHover) {
            this.setSelectedIndex(-1);
        }
    }

    handleWindowClose(event) {
        const target = event.target;
        if (target !== window && !this.root.contains(target) && this.props.ignoreFocusLossFor.indexOf(target.id) < 0) {
            this.hideHint();
            this.hideDropdown();
        }
    }

    renderInput() {
        const { inputId, inputName, inputValue, autoFocus, placeholder, options, handleHint, onBlur, onSelect, onKeyUp, onKeyPress } = this.props;
        const { isDropdownVisible } = this.state;
        const inputDirection = getTextDirection(inputValue);

        return (
            <div style={this.props.style.inputContainer} className={`${this.props.defaultClassnames.inputContainer}`}>
                <Input
                    disabled
                    role="presentation"
                    aria-hidden
                    dir={inputDirection}
                    className={`${this.props.defaultClassnames.hint}`}
                    style={this.props.style.hint}
                    value={this.state.isHintVisible ? handleHint(inputValue, options) : ''}
                />
                <Input
                    ref={(c) => (this.input = c)}
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
                    className={`${this.props.defaultClassnames.input}`}
                    style={this.props.style.input}
                />
            </div>
        );
    }

    renderDropdownOption(props, option, index, selectedIndex) {
        const { inputValue, inputId } = props;
        const OptionTemplate = props.optionTemplate;
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
        const { inputId, options, inputValue } = this.props;
        const { selectedIndex, isDropdownVisible } = this.state;

        if (options.length < 1) {
            return null;
        }

        return (
            <ul
                id={`react-typeahead-options-${inputId}`}
                ref={(c) => (this.dropdown = c)}
                role="listbox"
                aria-hidden={!isDropdownVisible}
                className={`${this.props.defaultClassnames.dropdown}`}
                style={Object.assign({}, this.props.style.dropdown, { display: isDropdownVisible ? 'block' : 'none' })}
                onMouseOut={this.handleMouseOut}
            >
            {
                options.map((data, index) => this.renderDropdownOption(this.props, data, index, selectedIndex))
            }
            {
                inputValue && (!options || !options.length) && (
                    <li>Empty</li>
                )
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
            <div
                style={this.props.style.container}
                className={`${this.props.defaultClassnames.container} ${this.state.isDropdownVisible ? this.props.defaultClassnames.dropdownOpen : ''} ${this.props.className}`}
                ref={(c) => (this.root = c)}
            >
                {this.renderInput()}
                {this.renderDropdown()}
                {this.renderAriaMessageForOptions()}
                {this.renderAriaMessageForIncomingOptions()}
            </div>
        );
    }
}

export default Typeahead;
