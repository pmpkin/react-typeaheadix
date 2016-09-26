import React from 'react';
import { storiesOf } from '@kadira/storybook';
import BasicTypeahead from './examples/BasicTypeahead';

storiesOf('Typahead', module)
    .add('Basic Typeahead', () => (<BasicTypeahead />));
