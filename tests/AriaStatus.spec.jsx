import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import AriaStatus from '../src/components/AriaStatus';

describe('<AriaStatus />', () => {

    it('sets text content in componentDidMount', () => {
        const message = 'test message';
        const wrapper = mount(<AriaStatus message={message} />);
        const actual = wrapper.text();
        expect(message).to.equal(actual);
    });

    it('updates text content in componentDidUpdate', () => {
        const message = 'test message 1';
        const updatedMessage = 'test message 2';
        const wrapper = mount(<AriaStatus message={message} />);
        wrapper.setProps({
            message: updatedMessage
        })
        const actual = wrapper.text();
        expect(updatedMessage).to.equal(actual);
    });

});
