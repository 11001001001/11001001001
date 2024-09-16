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
  const [isAnimating, setIsAnimating] = useState(false);



  

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
    if (popupPage1) {
      // Запускаем анимацию закрытия
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setPopupPage1(!popupPage1);
      }, 500); // Длительность анимации (0.5s)
    } else {
    setPopupPage1(!popupPage1);
  }
  };
  const togglePopup2 = () => {
    triggerHapticFeedback();
    if (popupPage2) {
      // Запускаем анимацию закрытия
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setPopupPage2(!popupPage2);
      }, 500); // Длительность анимации (0.5s)
    } else {
    setPopupPage2(!popupPage2);
  }
} ;

  const handleStartClick = () => {
    triggerHapticFeedback();
    navigate('/page3'); 
  };
  const handleStartClick2 = () => {
    triggerHapticFeedback();
    navigate('/page4'); 
  };

  const handleSwipeClick = () => {
    triggerHapticFeedback();
    setSwiped(!swiped);
  };



  return (
    <div className={`page1 ${swiped ? 'swiped' : ''}`}>
      <button className={`icon-button ${iconVisible ? 'slide-in' : ''}`} onClick={!swiped ? togglePopup2 : togglePopup} >
        <img src="https://cdn-icons-png.flaticon.com/512/5930/5930147.png" alt="Icon" />
      </button>


        <div>
           

{popupPage1 && (
  <div
    id="modal-background"
    onClick={togglePopup}
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 1000,
      animation: isAnimating ? 'fadeOut 0.5s, slideDown 0.5s' : 'fadeIn 0.5s, slideUp 0.5s',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '70%',
        backgroundColor: '#16181c',
        boxShadow: '0 -4px 10px rgb(255, 255, 255)',
        borderRadius: '40px 40px 0 0',
        position: 'relative',
        padding: '20px',
      }}
    >
      <div
        style={{
          marginTop: '5px',
          textAlign: 'center',
          fontSize: '40px',
          color: 'white',
        }}
      >
        Duck-X
      </div>

      <div
        style={{
          marginTop: '30px',
          marginLeft: '5px',
          fontSize: '24px',
          color: 'white',
          textAlign: 'left'
        }}
      >
        Rules
      </div>

      <div
        style={{
          marginTop: '20px',
          marginLeft: '5px',
          fontSize: '18px',
          color: 'white',
          textAlign: 'left'

        }}
      >
        You can risk a certain number of tokens to multiply them. Each ticket gives you one attempt. Be careful not to lose everything. Good luck, Ducker🍀! 
      </div>

      <button
        className="start-button"
        style={{
          width: '90%',
          height: '80px',
          marginTop: '50px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        onClick={handleStartClick}
      >
        Start
      </button>
    </div>
  </div>
)}

{popupPage2 && (
  <div
    id="modal-background"
    onClick={togglePopup2}
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 1000,
      animation: isAnimating ? 'fadeOut 0.5s, slideDown 0.5s' : 'fadeIn 0.5s, slideUp 0.5s',
    }}
  >
    <div
      style={{
        width: '100%',
        height: '70%',
        backgroundColor: '#16181c',
        boxShadow: '0 -4px 10px rgb(255, 255, 255)',
        borderRadius: '40px 40px 0 0',
        position: 'relative',
        padding: '20px',
      }}
    >
      <div
        style={{
          marginTop: '5px',
          textAlign: 'center',
          fontSize: '40px',
          color: 'white',
        }}
      >
        DuckTrade
      </div>

      <div
        style={{
          marginTop: '30px',
          marginLeft: '5px',
          fontSize: '24px',
          color: 'white',
          textAlign: 'left'
        }}
      >
        Rules
      </div>

      <div
        style={{
          marginTop: '20px',
          marginLeft: '5px',
          fontSize: '18px',
          color: 'white',
          textAlign: 'left'

        }}
      >
        Guess the 📈direction📉 the price will move and hold out for 30 seconds. Each successful trade earns you a 45% profit. Level up and unlock full access to trading at 100%! 
      </div>

      <button
        className="start-button coming-soon-button"
        style={{
          width: '90%',
          height: '80px',
          marginTop: '50px',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        onClick={handleStartClick2}
      >
        Start
      </button>
    </div>
  </div>
)}


          

        </div>



      <div className={`balance-display ${balanceIconVisible ? 'slide-in-right' : ''}`}>
        <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Balance Icon" className="balance-icon" />
        {balance.toLocaleString()}
      </div>
      <div className={`content ${swiped ? '' : 'hidden'}`}>
        <div className="above-text">DuckTrade</div>
        <div className="video-container">
          <img src={comingGame} className="centered-video" alt='Loading..' />
        </div>
        <button className="start-button coming-soon-button" onClick={handleStartClick2}>Start</button>
      </div>
      <div className={`swipe-content ${swiped ? 'hidden' : ''}`}>
        <div className="above-text">Duck-X</div>
        <div className="video-container">
        <img src={xGame} className="centered-video" alt='Loading..' />
        </div>
        <button className="start-button " onClick={handleStartClick}>Start</button>
      </div>
      <div className="arrow-icon" onClick={handleSwipeClick}>
        {swiped ? <FontAwesomeIcon icon={faArrowLeft} /> : <FontAwesomeIcon icon={faArrowRight} />}
      </div>

      <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            @keyframes slideDown {
                from { transform: translateY(0); }
                to { transform: translateY(100%); }
            }
            `}</style>

    </div>
  );
}

export default Page1;
