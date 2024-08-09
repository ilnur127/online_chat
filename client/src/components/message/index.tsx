import React from 'react';

import { TMessage } from '../../types';

import classes from './Message.module.css'

type TMessageComponent = {
  message: TMessage,
  isCurrentUser: boolean;
}
const MessageComponent = ({ message, isCurrentUser }: TMessageComponent) => {
  return <div className={`${classes.message} ${isCurrentUser ? classes.me : classes.user}`}>
    <span className={classes.user}>{message.user.name}</span>
    <div className={classes.text}>{message.message}</div>
  </div>;
};

export default MessageComponent;
