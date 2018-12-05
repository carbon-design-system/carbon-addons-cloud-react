import React from 'react';
import Checkbox from '../Checkbox';
import CheckboxSkeleton from '../Checkbox/Checkbox.Skeleton';
import { mount } from 'enzyme';

describe('Checkbox', () => {
  describe('Renders as expected', () => {
    const wrapper = mount(
      <Checkbox id="testing" labelText="testingLabel" className="extra-class" />
    );
    const label = wrapper.find('label');

    describe('label', () => {
      it('renders a label', () => {
        expect(label.length).toEqual(1);
        expect(label.prop('htmlFor')).toEqual('testing');
      });

      it('renders label text', () => {
        expect(wrapper.containsMatchingElement(<span>testingLabel</span>)).toBe(
          true
        );
      });

      it('has the expected classes', () => {
        expect(label.hasClass('bx--checkbox-label')).toEqual(true);
      });

      it('applies extra classes to label', () => {
        expect(label.hasClass('extra-class')).toEqual(true);
      });

      describe('input', () => {
        const input = () => wrapper.find('input');

        it('has id set as expected', () => {
          expect(input().props().id).toEqual('testing');
        });

        it('defaultChecked prop sets defaultChecked on input', () => {
          expect(input().props().defaultChecked).toBeUndefined();
          wrapper.setProps({ defaultChecked: true });
          expect(input().props().defaultChecked).toEqual(true);
        });
      });
    });
  });

  it('renders with tooltip', () => {
    const wrapper = mount(
      <Checkbox
        id="testing"
        labelText="testingLabel"
        className="extra-class"
        tooltipText="testingTooltip"
      />
    );

    expect(wrapper.find('MouseOverTooltip').exists()).toBe(true);
    expect(wrapper.find('MouseOverTooltip').prop('tabIndex')).toEqual('-1');
    expect(wrapper.find('MouseOverTooltip').prop('triggerText')).toEqual(
      'testingLabel'
    );
    expect(wrapper.find('MouseOverTooltip').prop('className')).toEqual(
      'bx--checkbox--tooltip'
    );
    expect(
      wrapper
        .find('MouseOverTooltip')
        .children()
        .text()
    ).toEqual('testingLabel');
    expect(wrapper.find('CheckBoxIcon').exists()).toBe(false);

    wrapper.setProps({ hasGroups: true });
    wrapper.update();

    expect(wrapper.find('MouseOverTooltip').prop('tabIndex')).toEqual('0');
    expect(wrapper.find('CheckBoxIcon').exists()).toBe(true);
  });

  it('disabled prop on component sets disabled prop on input', () => {
    const wrapper = mount(
      <Checkbox id="test" labelText="testlabel" disabled />
    );

    const input = () => wrapper.find('input');
    expect(input().props().disabled).toEqual(true);

    wrapper.setProps({ disabled: false });
    expect(input().props().disabled).toEqual(false);
  });

  it('checked prop on component sets checked prop on input', () => {
    const wrapper = mount(<Checkbox id="test" labelText="testlabel" checked />);

    const input = () => wrapper.find('input');
    expect(input().props().checked).toEqual(true);

    wrapper.setProps({ checked: false });
    expect(input().props().checked).toEqual(false);
  });

  it('hideLabel hides the label visually', () => {
    const wrapper = mount(
      <Checkbox id="test" labelText="testlabel" hideLabel />
    );

    const label = wrapper.find('label');
    expect(label.length).toEqual(1);
    const span = wrapper.find('span');
    expect(span.hasClass('bx--visually-hidden')).toEqual(true);
  });

  describe('events', () => {
    it('should invoke onChange with expected arguments', () => {
      const onChange = jest.fn();
      const id = 'test-input';
      const wrapper = mount(
        <Checkbox labelText="testlabel" id={id} onChange={onChange} />
      );

      const input = wrapper.find('input');
      const inputElement = input.instance();

      inputElement.checked = true;
      wrapper.find('input').simulate('change');

      const call = onChange.mock.calls[0];

      expect(call[0]).toEqual(true);
      expect(call[1]).toEqual(id);
      expect(call[2].target).toBe(inputElement);
    });
  });
});

describe('CheckboxSkeleton', () => {
  describe('Renders as expected', () => {
    const wrapper = mount(<CheckboxSkeleton />);
    const label = wrapper.find('label');

    describe('label', () => {
      it('renders a label', () => {
        expect(label.length).toEqual(1);
      });

      it('has the expected classes', () => {
        expect(label.hasClass('bx--checkbox-label')).toEqual(true);
        expect(label.hasClass('bx--skeleton')).toEqual(true);
      });
    });
  });
});
