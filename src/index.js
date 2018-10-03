require('./copy-box.scss');

import React, {PureComponent} from 'react';
import classNames from 'classnames';


export const STORAGE_KEY = '_copyBox';

export default class CopyBox extends PureComponent{

   static defaultProps = {
      animationPause: 500,
      content: ""
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
      let {content} = this.props;
      if (content){
         if (window.localStorage){
            // use localStorage
            localStorage.setItem(STORAGE_KEY, content);
         }
         else{
            // use clipboard
            let el = document.createElement('textarea');
            el.value = content;
            el.style.position = 'absolute';
            el.style.left = "-100vw";
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
         }
         this.flashState('copying');
      }
   }

   onPaste = (evt) => {
      let {onPaste} = this.props;

      let pasteText = window.localStorage
         ? localStorage.getItem(STORAGE_KEY)
         : evt.clipboardData.getData('Text');

      if (typeof onPaste === 'function'){
         onPaste(pasteText);
         this.flashState('pasting');
      }
      evt.preventDefault();
   }

   render(){
      let {
         children
      } = this.props;
      let {
         copying,
         pasting
      } = this.state;

      return (
         <div className={classNames(
            'copy-box',
            {copying, pasting}
         )}>
            <input
               readOnly
               title="Click here and copy or paste to duplicate settings"
               onPaste={this.onPaste}
               onCopy={this.copyContent}
               placeholder={'\uf24d'}
            />
         </div>
      );
   }
}
