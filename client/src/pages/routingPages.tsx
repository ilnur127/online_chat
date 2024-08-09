import React from 'react';
import { Route, Routes } from 'react-router-dom';

import HomePage from './home';
import ChatPage from './chat';

const RoutingPages = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/room' element={<ChatPage />} />
    </Routes>
  );
};

export default RoutingPages;
