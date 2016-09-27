import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Input from '../src/components/Input';

describe('<Input />', () => {

    it('renders with value and text direction set', () => {
        const value = 'value';
        const dir = 'ltr';
        const wrapper = mount(<Input value={value} dir={dir} />);
        const actual = wrapper.props();
        expect(value).to.equal(actual.value);
        expect(dir).to.equal(actual.dir);
    });

    it('removes dir attribute of rendered input element if dir is not set', () => {

        const dir = 'something';
        const wrapper = mount(<Input dir={dir} />);
        wrapper.setProps({
            dir: null
        })
        const actual = wrapper.find('input').at(0).node;
        expect(actual.dir).to.be.equal('');
    });

    describe('isCursorAtEnd()', () => {
        it('returns true, if cursor is at the end of the input value.', () => {

            const wrapper = mount(<Input value="value" />);
            const before = wrapper.instance().isCursorAtEnd();

            wrapper.find('input').at(0).node.selectionStart = 5;
            const after = wrapper.instance().isCursorAtEnd();
            expect(before).to.not.be.ok;
            expect(after).to.be.ok;
        });
    });
});
