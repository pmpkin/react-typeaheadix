A react typeahead component (WIP)
==============================================
Fork of [react-typeahead-component](https://github.com/ezequiel/react-typeahead-component/issues)

Installation
---------------
```
npm i react-typeahead-component
```
Usage
---------------
```jsx
import React from 'react';
import Typeahead from 'react-typeaheadix';

export const App = () => (
    <Typeahead
        inputId="someId"
        placeholder="Search..."
        ... more props
    />
)
```

Storybook
-----------
To run the stories on your computer:
- ``` npm install ```
- ``` npm run storybook ```
- Visit http://localhost:9001

Class names
-----------

These are the default class names provided by the component. The component does not have a stylesheet on it's own, so
it is your responsibility to define the styles as you like. You can customize the styles even further by overriding the names
of these classes (see below the prop defaultClassnames).

**react-typeaheadix-container**
  * A `div` element containing the entire Typeahead.

**dropdown-open**
  * Appended to the root element's classList of the compnent, when the dropdown is opened.

**react-typeaheadix-input-container**
  * A `div` element containing the usertext and hint.

**react-typeaheadix-input**
  * An `input` element containing the usertext.

**react-typeaheadix-hint**
  * An `input` element containing the hint.

**react-typeaheadix-dropdown**
  * A `ul` element containing the rendered list of options.

Available props:
----------------

#### *ReactElement* optionTemplate ***required***
This determines how to render each option. It is required. It should a reference to a ReactElement. It is instantiated for every item in `options`.

When instantiated, it is passed these props:

 * `index` - The position of this option in the `options` list.
 * `data` - The raw data of this option.
 * `userInputValue` - The value the user has **actually typed**.
 * `inputValue` - Typeahead's current input value. Note: this may be different than `userInputValue`.
 * `isSelected` - Is this option currently selected? This will be `true` on when hovered over, or arrowed to.

**Example**:

```jsx
const OptionTemplate = ({ data, isSelected }) => {
    let bgColor = null;

    // If this option is currently selected, render it with a green background.
    if (this.props.isSelected) {
        bgColor = {
            color: 'green'
        };
    }

    return (
        <div style={bgColor}>
            <p>My name is {this.props.data.name}!</p>
        </div>
    );
}

// Then in your main app...

<Typeahead
    optionTemplate={OptionTemplate}
/>
```
#### *string* inputId ***required***
This input id is used for the Typeahead's input element and to calculate a unique id.
For example, this allows us to associate a label with the Typeahead's input element. Screen readers will then be able to read the label once the Typeahead is focused.

```jsx
<label for="message-to-field">To</label>

<Typeahead
    inputId="message-to-field"
    ...
/>
```

#### *string* inputName ***optional***
* This input name is used for the Typeahead's input element. Useful if the Typeahead happens to be inside of a `form` element.

#### *string* className ***optional***
* This class name is used for the Typeahead's container.

#### *string* inputValue ***optional***
* The input element's `value` attribute. **NOTE**: You must pass this prop to Typeahead display the value. You have control of the current input value.

#### *array* options ***optional***
* These options are used when rendering the options list. It can contain data of any type.

#### *boolean* autoFocus ***optional***
* If true, the input element is focused on the initial render.

#### *string* placeholder ***optional***
* The input element's `placeholder` attribute.

#### *boolean* selectOnOptionHover ***optional, defaults to false***
* If true, hovering over an option causes it to be selected.

#### *boolean* selectOnOptionNavigate ***optional, defaults to false***
* If true, navigating through the dropdown via arrow keys causes the highlighted option to be selected.

#### *object* defaultClassnames ***optional***
You can provide your own set of classnames, which should be user for the component. The default classnames are as follows:
```
const defaultClassnames = {
    container: 'react-typeaheadix-container',
    dropdownOpen: 'dropdown-open',
    inputContainer: 'react-typeaheadix-input-container',
    hint: 'react-typeaheadix-hint',
    input: 'react-typeaheadix-input',
    dropdown: 'react-typeaheadix-dropdown'
};

```
#### *function* onCompleteHint(*event*, *completedInputValue*) ***optional***
Fires when the user is attempting to complete the input element's hint. If there is no hint, it will not be called.
This function is called when the user presses the `ArrowRight`, `Tab`, or `End` keys. `ArrowLeft` is used instead of `ArrowRight` **if** the input value is RTL.

**Example**:

```jsx
handleComplete: function(event, completedInputValue) {
    this.setState({
        inputValue: completedInputValue
    });
}

<Typeahead
    inputValue={this.state.inputValue}
    onCompleteHint={this.handleComplete}
/>
```

#### *function* onDropdownOpen() ***optional***
* Fires when the dropdown is opened. The dropdown opens as soon as something is typed, or up/down arrow keys are pressed, or when the input is focused.

#### *function* onDropdownClose() ***optional***
* Fires when the dropdown is closed. The dropdown may be closed when `Escape` or `Enter` is pressed, or if any option is clicked on, or if anywhere outside the Typeahead is clicked.

#### *function* onChange(*event*) ***optional***
* Fires when a change occurs on the input element.

#### *function* onInputClick(*event*) ***optional***
* Fires when the input element is clicked.

#### *function* onKeyDown(*event*, optionData, selectedIndex) ***optional***
Fires when a key down occurs on the input element.
It is also passed the currently selected option, and its index.
If no option is selected, `optionData` is the input value, and `selectedIndex` is `-1`.

#### *function* onKeyPress(*event*) ***optional***
* Fires when a key press occurs on the input element.

#### *function* onKeyUp(*event*) ***optional***
* Fires when a key up occurs on the input element.

#### *function* onFocus(*event*) ***optional***
* Fires when the input element is focused.

#### *function* onBlur(*event*) ***optional***
* Fires when the input element is blurred.

#### *function* onSelect(*event*) ***optional***
* Fires when the input element's text is selected.

#### *function* onOptionClick(*event*, optionData, index) ***optional***
* Fires when an option is clicked. `optionData` is the option that was clicked.

#### *function* onOptionChange(*event*, optionData, index) ***optional***
* Fires when the user arrows up or down to an option. It is also called if the user arrows back to the input element, and in that case `index` is `-1`. `optionData` is the option, or input text, data that has been navigated to.

#### *function* handleHint(inputValue, options) ***optional***
This function determines what the hint is. It is called whenever the input has changed. If a hint is considered available, it should return the entire string, otherwise return a default string.

**Example**:

```jsx
handleHint: function(inputValue, options) {
    // If the current input value matches the first option,
    // return that option. It will be used to display the hint.
    if (new RegExp('^' + inputValue).test(options[0].first_name)) {

        // This must return a string!
        return options[0].first_name;
    }

    // No hint is available.
    return '';
}

// Now pass it as a prop...
<Typeahead
    handleHint={this.handleHint}
/>
```

#### *function* getMessageForOption(*optionData*) ***optional***
This is for accessibility. It is called when an option is clicked or arrowed to. `optionData` is the option we're currently on. The return value is then read by the screen reader. It is also called if the user arrows back to the input element. The string returned should be localized so it is read in the correct language.

```js
getMessageForOption: function(optionData) {

    switch (optionData.type) {
    case 'PERSON':
        return 'Search for the person ' + optionData.name;

    case 'PLACE':
        return 'Search for the place ' + optionData.name;

    default:
        return 'Search for the thing ' + optionData.name;
    }
}
```

#### *function* getMessageForIncomingOptions() ***optional***
This is for accessibility. It is called when a new set of options is passed into Typeahead. The return value is then read by the screen reader. The string returned should be localized so it is read in the correct language.

```js
getMessageForIncomingOptions: function() {
    return 'There are new options available. Use the up and down arrows to navigate.';
}
```

Testing
-------
Currently none, but this is coming soon.

Issues
------
Please [file an issue](https://github.com/pmpkin/react-typeaheadix/issues/new) if you find a bug, or need help.

License
-------
The MIT License (MIT)
Copyright (c) 2016 Michael Wibmer
