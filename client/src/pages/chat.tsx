import React, { useEffect, useState } from 'react';

import ChatComponents from '../components/chat';

const ChatPage = () => {
  const [roomName, setRoomName] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(window.location.search))
    setUserName(searchParams.userName)
    setRoomName(searchParams.roomName);
  }, [])

  return roomName && userName ? <ChatComponents roomName={roomName} userName={userName} /> : <>Не удалось присоедениться к комнате</>;
};

export default ChatPage;
