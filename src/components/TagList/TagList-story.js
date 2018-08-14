import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TagList from '../TagList';

const tagListEvents = {
  className: 'some-class',
  tags: [
    { name: 'test:tag', type: 'functional' },
    { name: 'tag:test', type: 'functional' },
    { name: 'tag', type: 'functional' },
  ],
};

const tagListEventsWithTagProps = {
  className: 'some-class',
  tags: [
    { name: 'test:tag', type: 'functional', otherProps: { maxCharacters: 3 } },
    {
      name: 'tag:test',
      type: 'functional',
      otherProps: {
        className: 'bx--tag--functional__hovered bx--tag-list--tag',
      },
    },
    {
      name: 'really long tag',
      type: 'functional',
      otherProps: { maxCharacters: 5, isRemovable: true },
    },
  ],
};

const tagListEventsWithTagClassName = {
  className: 'some-class',
  tags: [
    {
      name: 'test:tag',
      type: 'functional',
      otherProps: {
        className: 'bx--tag--functional__hovered bx--tag-list--tag',
      },
    },
    {
      name: 'tag:test',
      type: 'functional',
      otherProps: {
        className: 'bx--tag--functional__hovered bx--tag-list--tag',
      },
    },
    {
      name: 'tag',
      type: 'functional',
      otherProps: {
        className: 'bx--tag--functional__hovered bx--tag-list--tag',
      },
    },
  ],
  counterTagClassName: 'bx--tag--functional__hovered',
};

storiesOf('TagList', module)
  .addWithInfo(
    'Default',
    `
    A TagList is used to manage multiple tags at once. The example below shows how the TagList component is displayed in a default state.
  `,
    () => <TagList {...tagListEvents} />
  )
  .addWithInfo(
    'Display All Editable Always',
    `
    A TagList is used to manage multiple tags at once. The example below shows how the TagList component can be used in an editable state.
  `,
    () => (
      <TagList {...tagListEvents} numTagsDisplayed={3} isEditable="always" />
    )
  )
  .addWithInfo(
    'Display All Editable Only On Hover',
    `
    A TagList is used to manage multiple tags at once. The example below shows how the TagList component can be used in an editable state, only when the TagList is hovered.
  `,
    () => (
      <TagList {...tagListEvents} numTagsDisplayed={3} isEditable="on-hover" />
    )
  )
  .addWithInfo(
    'Display 1 Editable',
    `
    A TagList is used to manage multiple tags at once. The example below shows how the TagList component can be used to condense a list.
  `,
    () => (
      <TagList {...tagListEvents} numTagsDisplayed={1} isEditable="always" />
    )
  )
  .addWithInfo(
    'Fully Condensed',
    `
    A TagList is used to manage multiple tags at once. The example below shows how the TagList component can be used in a fully condensed state.
  `,
    () => <TagList {...tagListEvents} numTagsDisplayed={0} />
  )
  .addWithInfo(
    'Display all tags with a maximum of 5 characters',
    `
    A TagList is used to manage multiple tags at once. The example below shows how the TagList component can be used with a maximum number of characters per tag.
  `,
    () => <TagList {...tagListEvents} numTagsDisplayed={3} maxCharacters={5} />
  )
  .addWithInfo(
    'Display 2 Editable with Tag Properties Applied',
    `
    A TagList is used to manage multiple tags at once. The example below shows how the TagList component can be used to condense a list.
    Custom Tag properties have also been applied.
  `,
    () => <TagList {...tagListEventsWithTagProps} numTagsDisplayed={2} />
  )
  .addWithInfo(
    'Default with Class Applied to all Tags',
    `
    A TagList is used to manage multiple tags at once. The example below shows how the TagList component is displayed in a default state with a class applied to all tags.
  `,
    () => <TagList {...tagListEventsWithTagClassName} />
  );
