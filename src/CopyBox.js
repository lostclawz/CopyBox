// require('./copy-box.scss');

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * functions to handle how the data
 * is copied and pasted
 */
export const copyPasteHandler = {
   copy: (data, storageKey) => {
      if (window.localStorage){
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
   paste: (storageKey) => {
      return window.localStorage
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
      placeholder: "\uf24d"
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
      placeholder: PropTypes.string
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

   copyContent = () => {
      let {
         content,
         storageKey,
         copyPaste: {copy}
      } = this.props;
      if (content){
         copy(content, storageKey);
         this.flashState('copying');
      }
   }

   onPaste = (evt) => {
      let {
         onPaste,
         storageKey,
         copyPaste: {paste}
      } = this.props;

      let pasteText = paste(storageKey);
      if (typeof onPaste === 'function'){
         onPaste(pasteText);
         this.flashState('pasting');
      }
      evt.preventDefault();
   }

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
         <div className={classNames(
            'copy-box',
            className,
            {copying, pasting}
         )}>
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
