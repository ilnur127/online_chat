import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { rooms } from '../../data/rooms';

import classes from './Home.module.css';

const HomeComponents = () => {
  const navigate  = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')

  const goToRoom = (e: FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.target as HTMLFormElement)
    const roomName = form.get('room');
    const userName = form.get('username');
    const room = rooms.find(room => room.name === roomName);
    if (!room) {
      setErrorMessage('Такой комнаты не существует!');
      return
    }
    navigate(`/room?userName=${userName}&roomName=${roomName}`);
  }

  return (
    <div className={classes.wrap}>
      <div className={classes.container}>
        <h1 className={classes.heading}>Join</h1>
        <form className={classes.form} onSubmit={goToRoom}>
          {[
            { name: 'username', placeholder: 'Username' },
            { name: 'room', placeholder: 'Room' },
          ].map((el, i) => (
            <div className={classes.group} key={i}>
              <span>{el.placeholder}</span>
              <input
                type='text'
                name={el.name}
                placeholder={el.placeholder}
                className={classes.input}
                autoComplete='off'
                required
              />
            </div>
          ))}
          <button className={classes.button} type='submit'>join</button>
          {errorMessage && <small className={classes.error}>{errorMessage}</small>}
        </form>
      </div>
    </div>
  );
};

export default HomeComponents;
