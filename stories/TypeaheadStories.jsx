import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import BasicTypeahead from './examples/BasicTypeahead';

storiesOf('Typahead', module)
    .add('Basic Typeahead', () => (<BasicTypeahead />));
