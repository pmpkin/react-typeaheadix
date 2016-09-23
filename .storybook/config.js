import { configure, addDecorator } from '@kadira/storybook';
import '../scss/style.scss';

addDecorator((story) => {
  return (story());
});

function loadStories() {
  require('../stories/TypeaheadStories');
}

configure(loadStories, module);
