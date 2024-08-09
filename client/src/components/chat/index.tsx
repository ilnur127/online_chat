import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import icon from '../../images/emoji.svg';

import classes from './Chat.module.css'
import { TMessage } from '../../types';
import MessageComponent from '../message';

const socket = io("http://localhost:5000")
socket.connect()

const ChatComponents = ({ roomName, userName }: { roomName: string; userName: string }) => {
  const navigate  = useNavigate()
  const [messages, setMessages] = useState<TMessage[]>([])
  const [enterMessage, setEnterMessage] = useState('')
  const [isOpenEmojis, setIsOpenEmojis] = useState(false)
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    debugger
    socket.emit('joinRoom', { userName, roomName })
  }, [userName, roomName])

  useEffect(() => {
    socket.on('message', ({ data }: any) => {
      setMessages(old => [...old, data]);
    })
  }, [])

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      setUsersCount(users.length);
    });
  }, []);

  const onEmojiClick = ({ emoji }: EmojiClickData) => setEnterMessage((old) => old + emoji)

  const leftRoom = () => {
    socket.emit('leaveRoom', { userName, roomName })
    navigate('/');
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!enterMessage) return

    socket.emit('sendMessage', { message: enterMessage, params: { userName, roomName } })

    setEnterMessage('');
  }

  return <div className={classes.wrap}>
    <div className={classes.header}>
      <div className={classes.title}>{roomName}</div>
      <div className={classes.users}>{usersCount} users in this room</div>
      <button className={classes.left} onClick={leftRoom}>Left the room</button>
    </div>
    <div className={classes.messages}>
      {messages.map((message, i) => <MessageComponent key={i} message={message} isCurrentUser={userName === message.user.name} />)}
    </div>
    <form className={classes.form} onSubmit={handleSubmit}>
      <input
        type='text'
        name="message"
        placeholder="Enter you message"
        className={classes.input}
        value={enterMessage}
        onChange={(e) => setEnterMessage(e.target.value)}
        autoComplete='off'
        required
      />
      <div className={classes.emoji}>
        <img src={icon} alt='' onClick={() => setIsOpenEmojis(old => !old)}/>
        {isOpenEmojis && <div className={classes.emojis}>
          <EmojiPicker onEmojiClick={onEmojiClick}/>
        </div>}
      </div>
      <button className={classes.button} type='submit'>Send</button>
    </form>
  </div>;
};

export default ChatComponents;
