// require('./copy-box.scss');

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * functions to handle how the data
 * is copied and pasted
 */
export const copyPasteHandler = {
   copy: (data, storageKey, useClipboard=false) => {
      if (window.localStorage && !useClipboard){
         // use localStorage
         localStorage.setItem(storageKey, data);
      }
      else{
         // use clipboard
         let el = document.createElement('textarea');
         el.value = data;
         el.style.position = 'absolute';
         el.style.left = "-100vw";
         document.body.appendChild(el);
         el.select();
         document.execCommand('copy');
         document.body.removeChild(el);
      }
   },
   paste: (storageKey, evt, useClipboard=false) => {
      return window.localStorage && !useClipboard
         ? localStorage.getItem(storageKey)
         : evt.clipboardData.getData('Text');
   }
}

export default class CopyBox extends PureComponent{

   static defaultProps = {
      storageKey: '_copyBox',
      animationPause: 500,
      copyPaste: copyPasteHandler,
      title: "Click here and copy or paste to duplicate settings",
      content: "",
      placeholder: "\uf24d",
      useClipboard: false,
      clipboardWithShift: true
   }

   static propTypes = {
      title: PropTypes.string,
      storageKey: PropTypes.string,
      copyData: PropTypes.func,
      pasteData: PropTypes.func,
      animationPause: PropTypes.number,
      content: PropTypes.oneOfType([
         PropTypes.object,
         PropTypes.array,
         PropTypes.number,
         PropTypes.string
      ]),
      copyPaste: PropTypes.shape({
         copy: PropTypes.func.isRequired,
         paste: PropTypes.func.isRequired
      }),
      className: PropTypes.string,
      placeholder: PropTypes.string,
      useClipboard: PropTypes.bool,
      clipboardWithShift: PropTypes.bool
   }

   constructor(props){
      super(props);
      this.state = {
         copying: false,
         pasting: false
      }
   }

   flashState = stateKey => {
      let {animationPause} = this.props;
      this.setState({
         [stateKey]: true
      }, () => {
         setTimeout(() => {
            this.setState({
               [stateKey]: false
            })
         }, animationPause);
      })
   }

   copyContent = (evt) => {
      let {
         content,
         storageKey,
         useClipboard,
         copyPaste: {copy}
      } = this.props;
      if (content){
         copy(
            content,
            storageKey,
            evt && evt.shiftKey || useClipboard
         );
         this.flashState('copying');
      }
      if (typeof evt.preventDefault === 'function'){
         evt.preventDefault();
      }
   }

   onPaste = (evt) => {
      let {
         onPaste,
         storageKey,
         useClipboard,
         copyPaste: {paste}
      } = this.props;
      let pasteText = paste(
         storageKey,
         evt,
         evt && evt.shiftKey || useClipboard
      );
      if (typeof onPaste === 'function'){
         onPaste(pasteText, evt);
         this.flashState('pasting');
      }
      if (typeof evt.preventDefault === 'function'){
         evt.preventDefault();
      }
   }

   stopPropagation = e => e.stopPropagation()

   render(){
      let {
         children,
         title,
         className,
         placeholder
      } = this.props;
      let {
         copying,
         pasting
      } = this.state;

      return (
         <div
            className={classNames(
               'copy-box',
               className,
               {copying, pasting}
            )}
            onClick={this.stopPropagation}
         >
            <input
               readOnly
               title={title}
               onPaste={this.onPaste}
               onCopy={this.copyContent}
               placeholder={placeholder}
            />
            {children}
         </div>
      );
   }

}
