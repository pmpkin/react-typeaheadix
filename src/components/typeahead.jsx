import React, { Component, PropTypes } from 'react';
import Input from './input';
import AriaStatus from './aria_status';
import getTextDirection from '../utils/get_text_direction';
const noop = function() {};

export default class Typeahead extends Component {

    static getInstanceCount = () => {
        var count = 0;
        return () => (++count);
    }

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
        onComplete:  noop,
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

    componentWillMount() {
        const uniqueId = this.constructor.getInstanceCount();
        this.userInputValue = null;
        this.previousInputValue = null;
        this.activeDescendantId = `react-typeahead-activedescendant-${uniqueId}`;
        this.optionsId = `react-typeahead-options-${uniqueId}`;
    }

    componentDidMount() {
        // The `focus` event does not bubble, so we must capture it instead.
        // This closes Typeahead's dropdown whenever something else gains focus.
        window.addEventListener('focus', this.handleWindowClose, true);

        // If we click anywhere outside of Typeahead, close the dropdown.
        window.addEventListener('click', this.handleWindowClose, false);
    }

    componentWillUnmount() {
        window.removeEventListener('focus', this.handleWindowClose, true);
        window.removeEventListener('click', this.handleWindowClose, false);
    }

    componentWillReceiveProps(nextProps) {
        const { inputValue, options} = nextProps;
        const valueLength = inputValue.length;

        // A visible part of the hint must be
        // available for us to complete it.
        const isHintVisible = valueLength > 0 &&
            nextProps.handleHint(inputValue, options).slice(valueLength).length > 0;

        this.setState({
            isHintVisible
        });
    }



    render() {

        return (
            <div
                style={{ position: 'relative' }}
                className={`react-typeahead-container ${this.props.className}`}>
                {this.renderInput()}
                {this.renderDropdown()}
                {this.renderAriaMessageForOptions()}
                {this.renderAriaMessageForIncomingOptions()}
            </div>
        );
    },
}

module.exports = React.createClass({
    displayName: 'Typeahead',



    renderInput: function() {
        var _this = this,
            state = _this.state,
            props = _this.props,
            inputValue = props.inputValue,
            className = 'react-typeahead-input',
            inputDirection = getTextDirection(inputValue);

        return (
            <div
                style={{
                    position: 'relative'
                }}
                className='react-typeahead-input-container'>
                <Input
                    disabled={true}
                    role='presentation'
                    aria-hidden={true}
                    dir={inputDirection}
                    className={className + ' react-typeahead-hint'}
                    style={{
                        color: 'silver',
                        WebkitTextFillColor: 'silver',
                        position: 'absolute'
                    }}
                    value={state.isHintVisible ? props.handleHint(inputValue, props.options) : null}
                />
                <Input
                    ref='input'
                    role='combobox'
                    aria-owns={_this.optionsId}
                    aria-expanded={state.isDropdownVisible}
                    aria-autocomplete='both'
                    aria-activedescendant={_this.activeDescendantId}
                    value={inputValue}
                    spellCheck={false}
                    autoComplete={false}
                    autoCorrect={false}
                    dir={inputDirection}
                    onClick={_this.handleClick}
                    onFocus={_this.handleFocus}
                    onBlur={props.onBlur}
                    onChange={_this.handleChange}
                    onKeyDown={_this.handleKeyDown}
                    id={props.inputId}
                    name={props.inputName}
                    autoFocus={props.autoFocus}
                    placeholder={props.placeholder}
                    onSelect={props.onSelect}
                    onKeyUp={props.onKeyUp}
                    onKeyPress={props.onKeyPress}
                    className={className + ' react-typeahead-usertext'}
                    style={{
                        position: 'relative',
                        background: 'transparent'
                    }}
                />
            </div>
        );
    },

    renderDropdown: function() {
        var _this = this,
            state = _this.state,
            props = _this.props,
            OptionTemplate = props.optionTemplate,
            selectedIndex = state.selectedIndex,
            isDropdownVisible = state.isDropdownVisible,
            activeDescendantId = _this.activeDescendantId;

        if (this.props.options.length < 1) {
            return null;
        }

        return (
            <ul id={_this.optionsId}
                ref='dropdown'
                role='listbox'
                aria-hidden={!isDropdownVisible}
                style={{
                    width: '100%',
                    background: '#fff',
                    position: 'absolute',
                    boxSizing: 'border-box',
                    display: isDropdownVisible ? 'block' : 'none'
                }}
                className='react-typeahead-options'
                onMouseOut={this.handleMouseOut}>
                {
                    props.options.map(function(data, index) {
                        var isSelected = selectedIndex === index;

                        return (
                            <li id={isSelected ? activeDescendantId : null}
                                aria-selected={isSelected}
                                role='option'
                                key={index}
                                onClick={_this.handleOptionClick.bind(_this, index)}
                                onMouseOver={_this.handleOptionMouseOver.bind(_this, index)}>

                                <OptionTemplate
                                    data={data}
                                    index={index}
                                    userInputValue={_this.userInputValue}
                                    inputValue={props.inputValue}
                                    isSelected={isSelected}
                                />
                            </li>
                        );
                    })
                }
            </ul>
        );
    },

    renderAriaMessageForOptions: function() {
        var _this = this,
            props = _this.props,
            inputValue = props.inputValue,
            option = props.options[_this.state.selectedIndex] || inputValue;

        return (
            <AriaStatus
                message={props.getMessageForOption(option) || inputValue}
            />
        );
    },

    renderAriaMessageForIncomingOptions: function() {
        var props = this.props;

        return (
            <AriaStatus
                message={props.getMessageForIncomingOptions(props.options.length)}
            />
        );
    },

    showDropdown: function() {
        var _this = this;

        if (!_this.state.isDropdownVisible) {
            _this.setState({
                isDropdownVisible: true
            }, function() {
                _this.props.onDropdownOpen();
            });
        }
    },

    hideDropdown: function() {
        var _this = this;

        if (_this.state.isDropdownVisible) {
            _this.setState({
                isDropdownVisible: false
            }, function() {
                _this.props.onDropdownClose();
            });
        }
    },

    showHint: function() {
        var _this = this,
            props = _this.props,
            inputValue = props.inputValue,
            inputValueLength = inputValue.length,
            isHintVisible = inputValueLength > 0 &&
                // A visible part of the hint must be
                // available for us to complete it.
                props.handleHint(inputValue, props.options).slice(inputValueLength).length > 0;

        _this.setState({
            isHintVisible: isHintVisible
        });
    },

    hideHint: function() {
        this.setState({
            isHintVisible: false
        });
    },

    setSelectedIndex: function(index, callback) {
        this.setState({
            selectedIndex: index
        }, callback);
    },

    handleChange: function(event) {
        var _this = this;

        _this.showHint();
        _this.showDropdown();
        _this.setSelectedIndex(-1);
        _this.props.onChange(event);
        _this.userInputValue = event.target.value;
    },

    focus: function() {
        this.refs.input.getDOMNode().focus();
    },

    handleFocus: function(event) {
        var _this = this;

        _this.showDropdown();
        _this.props.onFocus(event);
    },

    handleClick: function(event) {
        var _this = this;

        _this.showHint();
        _this.props.onInputClick(event);
    },

    navigate: function(direction, callback) {
        var _this = this,
            minIndex = -1,
            maxIndex = _this.props.options.length - 1,
            index = _this.state.selectedIndex + direction;

        if (index > maxIndex) {
            index = minIndex;
        } else if (index < minIndex) {
            index = maxIndex;
        }

        _this.setSelectedIndex(index, callback);
    },

    handleKeyDown: function(event) {
        var _this = this,
            key = event.key,
            props = _this.props,
            input = _this.refs.input,
            isDropdownVisible = _this.state.isDropdownVisible,
            isHintVisible = _this.state.isHintVisible,
            hasHandledKeyDown = false,
            index,
            optionData,
            dir;

        switch (key) {
        case 'End':
        case 'Tab':
            if (isHintVisible && !event.shiftKey) {
                event.preventDefault();
                props.onComplete(event, props.handleHint(props.inputValue, props.options));
            }
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            if (isHintVisible && !event.shiftKey && input.isCursorAtEnd()) {
                dir = getTextDirection(props.inputValue);

                if ((dir === 'ltr' && key === 'ArrowRight') || (dir === 'rtl' && key === 'ArrowLeft')) {
                    props.onComplete(event, props.handleHint(props.inputValue, props.options));
                }
            }
            break;
        case 'Enter':
            _this.focus();
            _this.hideHint();
            _this.hideDropdown();
            break;
        case 'Escape':
            _this.hideHint();
            _this.hideDropdown();
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            if (props.options.length > 0) {
                event.preventDefault();

                _this.showHint();
                _this.showDropdown();

                if (isDropdownVisible) {
                    dir = key === 'ArrowUp' ? -1: 1;
                    hasHandledKeyDown = true;

                    _this.navigate(dir, function() {
                        var selectedIndex = _this.state.selectedIndex,
                            previousInputValue = _this.previousInputValue,
                            optionData = previousInputValue,
                            optionOffsetTop = 0,
                            selectedOption,
                            dropdown;

                        // We're currently on an option.
                        if (selectedIndex >= 0) {
                            // Save the current `input` value,
                            // as we might arrow back to it later.
                            if (previousInputValue === null) {
                                _this.previousInputValue = props.inputValue;
                            }

                            optionData = props.options[selectedIndex];
                            // Make selected option always scroll to visible
                            dropdown = React.findDOMNode(_this.refs.dropdown);
                            selectedOption = dropdown.children[selectedIndex];
                            optionOffsetTop = selectedOption.offsetTop;
                            if(optionOffsetTop + selectedOption.clientHeight > dropdown.clientHeight ||
                                optionOffsetTop < dropdown.scrollTop) {
                                dropdown.scrollTop = optionOffsetTop;
                            }
                        }

                        props.onOptionChange(event, optionData, selectedIndex);
                        props.onKeyDown(event, optionData, selectedIndex);
                    });
                }
            }

            break;
        }

        if (!hasHandledKeyDown) {
            index = this.state.selectedIndex;
            optionData = index < 0 ? props.inputValue : props.options[index];
            props.onKeyDown(event, optionData, index);
        }
    },

    handleOptionClick: function(selectedIndex, event) {
        var _this = this,
            props = _this.props;

        _this.focus();
        _this.hideHint();
        _this.hideDropdown();
        _this.setSelectedIndex(selectedIndex);
        props.onOptionClick(event, props.options[selectedIndex], selectedIndex);
    },

    handleOptionMouseOver: function(selectedIndex) {
        var _this = this;

        if (_this.props.hoverSelect) {
            _this.setSelectedIndex(selectedIndex);
        }
    },

    handleMouseOut: function() {
        var _this = this;

        if (_this.props.hoverSelect) {
            _this.setSelectedIndex(-1);
        }
    },

    handleWindowClose: function(event) {
        var _this = this,
            target = event.target;

        if (target !== window && !this.getDOMNode().contains(target) && this.props.ignoreFocusLossFor.indexOf(target.id) < 0) {
            _this.hideHint();
            _this.hideDropdown();
        }
    }
});
