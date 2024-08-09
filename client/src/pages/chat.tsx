import React, { useEffect } from 'react';

import ChatComponents from '../components/chat';
import { useSearchParamsStore } from '../store/searchParams.store';

const ChatPage = () => {
  const { changeSearchParams } = useSearchParamsStore()

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search))
    changeSearchParams(params);
  }, [changeSearchParams])

  return <ChatComponents />;
};

export default ChatPage;
