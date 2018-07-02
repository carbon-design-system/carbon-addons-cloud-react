import React from 'react';
import TagList from '../TagList';
import { shallow, mount } from 'enzyme';
import { Icon } from 'carbon-components-react';
import Tag from '../Tag';

const onIconClickMock = jest.fn();

describe('TagList', () => {
  let mockProps;

  beforeEach(() => {
    mockProps = {
      tags: [
        { name: 'test1', type: 'functional' },
        { name: 'test2', type: 'functional' },
      ],
      className: 'some-class',
    };
  });
  it('should render as expected', () => {
    const wrapper = shallow(<TagList {...mockProps} />);
    expect(wrapper.length).toEqual(1);
    expect(wrapper.find(Tag)).toHaveLength(2);
  });

  it('should display all tags by default', () => {
    mockProps = {
      ...mockProps,
    };
    const wrapper = shallow(<TagList {...mockProps} />);
    expect(wrapper.find(Tag)).toHaveLength(2);
  });

  it('should display condensed state', () => {
    mockProps = {
      ...mockProps,
      maxTagsDisplayed: 0,
    };
    const wrapper = shallow(<TagList {...mockProps} />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('.bx--tag-list--tag-counter'));
  });

  it('should display 1 tag and 1 condensed tag', () => {
    mockProps = {
      ...mockProps,
      maxTagsDisplayed: 1,
    };

    const wrapper = shallow(<TagList {...mockProps} />);
    expect(wrapper.find(Tag)).toHaveLength(2);
    expect(wrapper.find('.bx--tag-list--tag-counter')).toHaveLength(1);
    expect(wrapper.find(Icon)).toHaveLength(1);
  });

  it('should display edit state when isEditable is true', () => {
    mockProps = {
      ...mockProps,
      isEditable: true,
      onIconClick: onIconClickMock,
    };

    const wrapper = shallow(<TagList {...mockProps} />);
    expect(wrapper.find(Icon)).toHaveLength(1);
    wrapper.find(Icon).simulate('click');
    expect(onIconClickMock).toHaveBeenCalled;
  });

  it('should limit characters when passing maxCharacters through otherProps', () => {
    mockProps = {
      tags: [
        {
          name: 'super long tag',
          type: 'functional',
          otherProps: { maxCharacters: 3 },
        },
      ],
    };

    const wrapper = mount(<TagList {...mockProps} />);
    expect(wrapper.find(Tag).text()).toEqual('sup...');
    expect(
      wrapper
        .find(Tag)
        .text()
        .replace('...', '').length
    ).toEqual(3);
  });

  it('should apply classes for tag counter when specified', () => {
    mockProps = {
      ...mockProps,
      maxTagsDisplayed: 1,
      counterTagClassName: 'bx--tag--functional__hovered',
    };

    const wrapper = mount(<TagList {...mockProps} />);
    expect(wrapper.find('Tag.bx--tag--functional__hovered')).toHaveLength(1);
  });
});
