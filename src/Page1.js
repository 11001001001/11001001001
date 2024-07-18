import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import xGame from "./chpic.su_-_UtyaDuckFull_025-ezgif.com-gif-maker.gif"

function Page1() {
  const [balance, setBalance] = useState(0);
  const [iconVisible, setIconVisible] = useState(false);
  const [balanceIconVisible, setBalanceIconVisible] = useState(false);
  const [swiped, setSwiped] = useState(false);

  const navigate = useNavigate();

  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    } else if (navigator.vibrate) {
      navigator.vibrate(50); // Для Android устройств
    }
  };

  useEffect(() => {
    const getInitialData = () => {
      window.Telegram.WebApp.CloudStorage.getItems(['balance'], (error, result) => {
        if (error) {
          console.error('Failed to get initial data from cloud storage:', error);
        } else {
          const initialBalance = result.balance ? parseInt(result.balance, 10) : 0;
          setBalance(initialBalance);
        }
      });
    };

    getInitialData();

  }, []);

  useEffect(() => {
    setIconVisible(true);
    setBalanceIconVisible(true);
  }, []);

  const handleStartClick = () => {
    triggerHapticFeedback();
    navigate('/page3'); // Переход на страницу Page3 при нажатии на кнопку Start
  };

  const handleSwipeClick = () => {
    triggerHapticFeedback();
    setSwiped(!swiped);
  };

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchMove = (e) => {
      touchEndX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
      if (touchStartX - touchEndX > 50) {
        // Свайп влево
        setSwiped(true);
        triggerHapticFeedback();
      }

      if (touchEndX - touchStartX > 50) {
        // Свайп вправо
        setSwiped(false);
        triggerHapticFeedback();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className={`page1 ${swiped ? 'swiped' : ''}`}>
      <button className={`icon-button ${iconVisible ? 'slide-in' : ''}`}>
        <img src="https://cdn-icons-png.flaticon.com/512/5930/5930147.png" alt="Icon" />
      </button>
      <div className={`balance-display ${balanceIconVisible ? 'slide-in-right' : ''}`}>
        <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Balance Icon" className="balance-icon" />
        {balance.toLocaleString()}
      </div>
      <div className={`content ${swiped ? 'hidden' : ''}`}>
        <div className="above-text">Duck-X</div>
        <div className="video-container">
          <img src={xGame} className="centered-video" alt='Loading..' />
        </div>
        <button className="start-button" onClick={handleStartClick}>Start</button>
      </div>
      <div className={`swipe-content ${swiped ? '' : 'hidden'}`}>
        <div className="above-text">Duck theft</div>
        <div className="video-container">
        <img src="/chpic.su_-_UtyaDuckFull_002-ezgif.com-gif-maker.gif" className="centered-video" alt='Loading..' />
        </div>
        <button className="start-button coming-soon-button" disabled>Coming soon</button>
      </div>
      <div className="arrow-icon" onClick={handleSwipeClick}>
        {swiped ? <FontAwesomeIcon icon={faArrowLeft} /> : <FontAwesomeIcon icon={faArrowRight} />}
      </div>
    </div>
  );
}

export default Page1;
