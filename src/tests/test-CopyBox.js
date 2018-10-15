import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import CopyBox from '../CopyBox';

// ms buffer when we test timing
const MS_ALLOWANCE = 5;

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
      className: "test-class"
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
			/>
      );
      input = wrapper.find('.copy-box input');
      
   })

   afterEach(function(){
      copier.restore();
      paster.restore();
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
      expect(input.props().readOnly).to.be.true;
      expect(input.props().placeholder).to.equal('\uf24d');
   })
   it(`renders the input as readOnly`, () => {
      expect(
         input.prop('readOnly')
      ).to.be.true;
   })
   it(`renders the input as readOnly and with a title property of props.title`, () => {
      expect(
         input.props().title
      ).to.equal(testProps.title)
   })
   it(`gives .copy-box .copying class after cmd+c, and removes it after props.animationPause ms`, (done) => {
      expect(input).to.have.lengthOf(1);
      input.simulate('copy');
      expect(wrapper.find('.copy-box.copying')).to.have.lengthOf(1);
      setTimeout(() => {
         expect(wrapper.find('.copy-box.copying')).to.have.lengthOf(1);
         setTimeout(() => {
            expect(wrapper.find('.copy-box.copying')).to.have.lengthOf(0);
            done();
         }, MS_ALLOWANCE * 2)
      }, testProps.animationPause - MS_ALLOWANCE)
   })
   it(`passes the content and props.storageKey to copyPaste.copy on copy`, () => {
      expect(input).to.have.lengthOf(1);
      input.simulate('copy');
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
   it(`gives .copy-box .pasting class after cmd+v, and removes it after props.animationPause ms`, (done) => {
      expect(input).to.have.lengthOf(1);
      const e = {preventDefault: sinon.spy()};
      input.simulate('paste', e);
      expect(wrapper.find('.copy-box.pasting')).to.have.lengthOf(1);
      setTimeout(() => {
         expect(wrapper.find('.copy-box.pasting')).to.have.lengthOf(1);
         setTimeout(() => {
            expect(wrapper.find('.copy-box.pasting')).to.have.lengthOf(0);
            done();
         }, MS_ALLOWANCE * 2)
      }, testProps.animationPause - MS_ALLOWANCE)
   })

})