import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import xGame from "./chpic.su_-_UtyaDuckFull_025-ezgif.com-gif-maker.gif"
import comingGame from "./chpic.su_-_UtyaDuckFull_002-ezgif.com-gif-maker.gif"

function Page1() {
  const [balance, setBalance] = useState(0);
  const [iconVisible, setIconVisible] = useState(false);
  const [balanceIconVisible, setBalanceIconVisible] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [popupPage1, setPopupPage1] = useState(false);
  const [popupPage2, setPopupPage2] = useState(false);


  

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

  const togglePopup = () => {
    triggerHapticFeedback();
    setPopupPage1(!popupPage1);
  };
  const togglePopup2 = () => {
    triggerHapticFeedback();
    setPopupPage2(!popupPage2);
  };

  const handleStartClick = () => {
    triggerHapticFeedback();
    navigate('/page3'); 
  };

  const handleSwipeClick = () => {
    triggerHapticFeedback();
    setSwiped(!swiped);
  };



  return (
    <div className={`page1 ${swiped ? 'swiped' : ''}`}>
      <button className={`icon-button ${iconVisible ? 'slide-in' : ''}`} onClick={!swiped ? togglePopup : togglePopup2} >
        <img src="https://cdn-icons-png.flaticon.com/512/5930/5930147.png" alt="Icon" />
      </button>


        <div>

            <div className={`popupPage1 ${popupPage1 ? 'visible' : ''}`}>
              <div className="popup-content-game1">
                <button className="close-button-game1" onClick={togglePopup}>Close</button>
                <div className='cc1'>Duck-X</div>
                <div className="rules-game1">
                  <h3>Rules</h3>

                  <ul>
                    <li>You can risk a certain amount of coins to earn multiplied profits💰 It's very simple! 
                    </li>
                    <li>Choose a percentage of your balance and hold your finger on the indicated spot 😁
                    </li>
                    <h3>Every second you'll earn multiplied profits.
                    The game can end in two ways:</h3>
                    <li>1. If you lift your finger - you take the additional profit for the time you held it
                    </li>
                    <li>2. The game can automatically end, which means you need to lift your finger off the screen in time
                    </li>
                    <li>The multiplier starts from 1.00x and can go up to 20.00x</li>
                    <li>And don’t forget you get 9 tickets each 8 hours.
                    </li>
                    <li>Good luck 🍀
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={`popupPage2 ${popupPage2 ? 'visible' : ''}`}>
              <div className="popup-conten-game2">
                <button className="close-button-game2" onClick={togglePopup2}>Close</button>
                <div className='cc2'>Duck theft</div>

                <div className="rules-game2">
                  <h3>Is comming</h3>
                  <ul>
                    <li>Soon</li>

                  </ul>
                </div>
              </div>
            </div>

        </div>



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
        <img src={comingGame} className="centered-video" alt='Loading..' />
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
