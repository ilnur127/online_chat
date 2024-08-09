import React, { FormEvent, memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import icon from '../../images/emoji.svg';

import classes from './Chat.module.css'
import { TMessage } from '../../types';
import MessageComponent from '../message';
import { useSearchParamsStore } from '../../store/searchParams.store';

const socket = io("http://localhost:5000")
socket.connect()

const ChatComponents = memo(() => {
  const { searchParams } = useSearchParamsStore()
  const navigate  = useNavigate()
  const [messages, setMessages] = useState<TMessage[]>([])
  const [enterMessage, setEnterMessage] = useState('')
  const [isOpenEmojis, setIsOpenEmojis] = useState(false)
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    if (searchParams.userName && searchParams.roomName) {
      console.log('join')
      socket.emit('joinRoom', { userName: searchParams.userName, roomName: searchParams.roomName })
      socket.on('message', ({ data }: any) => {
        setMessages(old => [...old, data]);
      })
    }
  }, [searchParams])

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      setUsersCount(users.length);
    });
  }, []);

  const onEmojiClick = ({ emoji }: EmojiClickData) => setEnterMessage((old) => old + emoji)

  const leftRoom = () => {
    socket.emit('leaveRoom', { userName: searchParams.userName, roomName: searchParams.roomName })
    navigate('/');
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!enterMessage) return

    socket.emit('sendMessage', { message: enterMessage, params: { userName: searchParams.userName, roomName: searchParams.roomName } })

    setEnterMessage('');
  }

  return <div className={classes.wrap}>
    <div className={classes.header}>
      <div className={classes.title}>{searchParams?.roomName}</div>
      <div className={classes.users}>{usersCount} users in this room</div>
      <button className={classes.left} onClick={leftRoom}>Left the room</button>
    </div>
    <div className={classes.messages}>
      {messages.map((message, i) => <MessageComponent key={i} message={message} isCurrentUser={searchParams?.userName === message.user.name} />)}
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
});

export default ChatComponents;
