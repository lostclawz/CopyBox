import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import CopyBox from '../CopyBox';


describe('<CopyBox/>', function(){
   var wrapper;
   
   let data = {};
   var testProps = {
      animationPause: 75,
      storageKey: '_copyBox',
      copyPaste: {
         copy: (c, key) =>  data[key] = c,
         paste: key => data[key]
      },
      content: {
         test: "data"
      },
      title: "copy and paste here",
      className: "test-class",
      placeholder: "test",
      useClipboard: true
   }
   var onPaste;
   var copier, paster;
   let input;

	beforeEach(function(){
      onPaste = sinon.spy();
      copier = sinon.spy(testProps.copyPaste, 'copy');
      paster = sinon.spy(testProps.copyPaste, 'paste');
      wrapper = shallow(
			<CopyBox
            {...testProps}
            onPaste={onPaste}
			>
            <div className="test-child">Test</div>
         </CopyBox>
      );
      input = wrapper.find('.copy-box input');
      this.clock = sinon.useFakeTimers();
   })

   afterEach(function(){
      sinon.restore();
      // this.clock.restore();
   })
   
   it(`renders one div.copy-box`, () => {
      expect(
         wrapper.find('.copy-box')
      ).to.have.lengthOf(1);
   })
   it(`can render a custom className to the container div`, () => {
      expect(
         wrapper.find(`.copy-box.${testProps.className}`)
      ).to.have.lengthOf(1);
   })
   it(`renders an input inside .copy-box`, () => {
      expect(input).to.have.lengthOf(1);
   })
   it(`renders the input as readOnly`, () => {
      expect(
         input.prop('readOnly')
      ).to.be.true;
   })
   it(`renders an input with placeholder props.placeholder`, () => {
      expect(
         input.prop('placeholder')
      ).to.equal(testProps.placeholder);
   })
   it(`renders the input with a title property of props.title`, () => {
      expect(
         input.prop('title')
      ).to.equal(testProps.title)
   })
   it(`renders any children next to the input component`, () => {
      expect(wrapper.children()).to.have.lengthOf(2);
      expect(
         wrapper.childAt(0).is('input')
      ).to.be.true;
      expect(
         wrapper.childAt(1).is('.test-child')
      ).to.be.true;
   })
   it(`gives .copy-box .copying class after cmd+c, and removes it after props.animationPause ms`, function() {
      expect(input).to.have.lengthOf(1);
      input.simulate('copy', {e: {shiftKey: false}});
      expect(wrapper.exists('.copy-box.copying')).to.be.true;
      this.clock.tick(testProps.animationPause - 1);
      expect(wrapper.exists('.copy-box.copying')).to.be.true;
      this.clock.tick(1);
      expect(wrapper.exists('.copy-box.copying')).to.be.false;
   })
   it(`passes the content and props.storageKey to copyPaste.copy on copy`, () => {
      expect(input).to.have.lengthOf(1);
      input.simulate('copy', {e: {shiftKey: false}});
      expect(
         copier.calledWith(testProps.content, testProps.storageKey)
      ).to.be.true;
      expect(data[testProps.storageKey]).to.equal(testProps.content);
   })
   it(`calls onPaste with content when cmd+v is pressed`, () => {
      const e = {preventDefault: sinon.spy()};
      input.simulate('paste', e);
      expect(e.preventDefault.calledOnce).to.be.true;
      expect(
         paster.calledWith(testProps.storageKey)
      ).to.be.true;
      expect(
         onPaste.calledWith(testProps.content)
      ).to.be.true;
   });
   it(`passes the useClipboard prop to the copy and paste functions if provided`, () => {
      expect(input).to.have.lengthOf(1);
      input.simulate('copy', {shiftKey: false});
      expect(
         copier.calledWith(testProps.content, testProps.storageKey, true)
      ).to.be.true;
      expect(data[testProps.storageKey]).to.equal(testProps.content);
      const e = {preventDefault: sinon.spy()};
      input.simulate('paste', e);
      expect(e.preventDefault.calledOnce).to.be.true;
      expect(
         paster.calledWith(testProps.storageKey)
      ).to.be.true;
      expect(
         onPaste.calledWith(testProps.content, e)
      ).to.be.true;
   })
   it(`gives .copy-box .pasting class after cmd+v, and removes it after props.animationPause ms`, function(){
      expect(input).to.have.lengthOf(1);
      const e = {preventDefault: sinon.spy()};
      input.simulate('paste', e);
      expect(wrapper.find('.copy-box.pasting')).to.have.lengthOf(1);
      this.clock.tick(testProps.animationPause - 1);
      expect(wrapper.find('.copy-box.pasting')).to.have.lengthOf(1);
      this.clock.tick(2);
      expect(wrapper.find('.copy-box.pasting')).to.have.lengthOf(0);
   })
   it(`passes true for useClipboard if shift is help while copying or pasting`, () => {
      expect(input).to.have.lengthOf(1);
      input.simulate('copy', {shiftKey: true});
      expect(
         copier.calledWith(testProps.content, testProps.storageKey, true)
      ).to.be.true;
      expect(data[testProps.storageKey]).to.equal(testProps.content);
      const e = {
         shiftKey: true
      };
      input.simulate('paste', e);
      expect(paster.calledWith(
         testProps.storageKey,
         e,
         true
      )).to.be.true;
   })
   it(`stops click event propagation from .copy-box wrapper`, () => {
      const e = {stopPropagation: sinon.spy()};
      wrapper.find('.copy-box').simulate('click', e);
      expect(e.stopPropagation.calledOnce).to.be.true;
   })

})