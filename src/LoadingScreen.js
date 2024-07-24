import React, { useEffect } from 'react';
import './LoadingScreen.css';
import loadingEgg from "./chpic.su_-_UtyaDuckFull_042-ezgif.com-gif-maker.gif"


const LoadingScreen = ({ onEnd }) => {
  useEffect(() => {
    const timer = setTimeout(onEnd, 2000); // Убираем экран загрузки через 4 секунды
    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <div className="loading-screen1">
        <img src={loadingEgg} className="centered-video" alt='Loading..' />
    </div>
  );
};

export default LoadingScreen;