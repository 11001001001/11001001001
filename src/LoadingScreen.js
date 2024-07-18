import React, { useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onEnd }) => {
  useEffect(() => {
    const timer = setTimeout(onEnd, 2000); // Убираем экран загрузки через 4 секунды
    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <div className="loading-screen">
        <img src="/chpic.su_-_UtyaDuckFull_042-ezgif.com-gif-maker.gif" className="centered-video" alt='Loading..' />
    </div>
  );
};

export default LoadingScreen;