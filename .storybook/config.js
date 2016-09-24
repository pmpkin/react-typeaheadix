import { configure, addDecorator } from '@kadira/storybook';
import '../stories/scss/styles.scss';

addDecorator((story) => {
  return (story());
});

function loadStories() {
  require('../stories/TypeaheadStories');
}

configure(loadStories, module);
