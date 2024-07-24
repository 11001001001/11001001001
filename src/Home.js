  import React, { useState, useEffect } from 'react';
  import './Home.css';
  import walletImg from "./coins.png"
  import appsImg from "./exclamation.png"
  import badgeImg from "./badge.png"


  function Home() {
    const [balance, setBalance] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isScrolling, setIsScrolling] = useState(false);
    const [timer, setTimer] = useState(0);
    const [showAnimation, setShowAnimation] = useState(false);
    const [animationValue, setAnimationValue] = useState(0);
    const [connected, setConnected] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  const togglePopup = () => {
    triggerHapticFeedback();
    setIsPopupVisible(!isPopupVisible);
  };
    const getUserFirstName = window.Telegram.WebApp.initDataUnsafe.user.first_name;
    const getUserLastName = window.Telegram.WebApp.initDataUnsafe.user.last_name;


    const triggerHapticFeedback = () => {
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      } else if (navigator.vibrate) {
        navigator.vibrate(50); // Для Android устройств
      }
    };

    const params = {
      title: "Connect Wallet",
      message: "Do you want to connect wallet?",
      buttons: [
        {
          id: "yes",
          type: "default",
          text: "Yes"
        },
        {
          id: "no",
          type: "destructive",
          text: "No"
        }
      ]
    };
    

    function handlePopupResponse(buttonId) {
      if (buttonId === "yes") {
        setConnected(true);
        window.Telegram.WebApp.CloudStorage.setItem('connected', 'true', (error) => {
          if (error) {
            console.error('Failed to set connected in cloud storage:', error);
          }
        });
        window.Telegram.WebApp.openTelegramLink('https://t.me/wallet?startattach');
      } else if (buttonId === "no") {
        console.log("Connection denied");
      }
    }

    
    const walletHandler = () => {
      if (!connected) {
        window.Telegram.WebApp.showPopup(params, handlePopupResponse);
      } else {
        window.Telegram.WebApp.openTelegramLink('https://t.me/wallet?startattach');
      }
    }

    useEffect(() => {
      const getInitialData = () => {
        window.Telegram.WebApp.CloudStorage.getItems(['balance', 'endTime', 'timer', 'connected'], (error, result) => {
          if (error) {
            console.error('Failed to get initial data from cloud storage:', error);
          } else {
            const initialBalance = result.balance ? parseInt(result.balance, 10) : 0;
            const savedEndTime = result.endTime ? new Date(result.endTime) : null;
            const initialTimer = savedEndTime ? Math.max((savedEndTime - new Date()) / 1000, 0) : 0;
            const initialConnected = result.connected === 'true';

            setBalance(initialBalance);
            setTimer(initialTimer);
            setConnected(initialConnected);
            console.log(initialBalance, savedEndTime, initialTimer, initialConnected);
          }
        });
      };

      getInitialData();
    }, []);



    useEffect(() => {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prevTimer) => {
            const newTimer = Math.max(prevTimer - 1, 0);
            if (newTimer <= 0) {
              clearInterval(interval);
              setDisplayText('Refilled');
              setIsScrolling(false);
              window.Telegram.WebApp.CloudStorage.removeItem('endTime', (error) => {
                if (error) {
                  console.error('Failed to remove endTime from cloud storage:', error);
                }
              });
            }
            return newTimer;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [timer]);

    useEffect(() => {
      if (timer > 0) {
        setIsScrolling(true);
        setDisplayText('wait');
      }
    }, [timer]);

    

    const startScrolling = () => {
      setIsScrolling(true);
      const endTime = new Date(Date.now() + 14400 * 1000); // 4 hours from now
      window.Telegram.WebApp.CloudStorage.setItem('endTime', endTime.toISOString(), (error) => {
        if (error) {
          console.error('Failed to set endTime in cloud storage:', error);
        }
      });

      setTimer(14400); // 4 hours in seconds
      let randomNum = Math.floor(Math.random() * 901) + 100;

      setDisplayText(randomNum.toString());

      const interval = setInterval(() => {
        randomNum = Math.floor(Math.random() * 901) + 100;
        triggerHapticFeedback();
        setDisplayText(randomNum.toString());
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setBalance((prevBalance) => {
          const newBalance = prevBalance + randomNum;
          window.Telegram.WebApp.CloudStorage.setItem('balance', newBalance.toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
          setAnimationValue(randomNum); // Устанавливаем значение для анимации
          setShowAnimation(true); // Показываем анимацию
          setTimeout(() => setShowAnimation(false), 2000); // Скрываем анимацию через 2 секунды
          return newBalance;
        });
        setDisplayText('wait');
      }, 3000);
    };

    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      return `${h}h ${m}m ${s}s`;
    };

    return (
      <div className="home">
        <div className="header">
          <div className="stars"></div>
          <button className="toggle-button" onClick={togglePopup}>
            <img 
              src={appsImg} 
              alt="Toggle" 
            />
          </button>

          <div className={`popup ${isPopupVisible ? 'visible' : ''}`}>
          <button className="close-button" onClick={togglePopup}>Close</button>

            <div className="popup-content">
              <h1>TapDuck</h1>
              <h2 style={{fontSize: "30px", marginTop: "-25px"}}>Welcome to Tap Duck 🐣</h2>
              <p>Our famous duck will give you a random number of coins every day ☝️
              </p>
              <p>You can use these coins in various games within the app to increase your balance 🐥
              </p>
              <p>But be careful! Games can both increase and decrease your balance 🫳
              </p>
              <p>Stay active by inviting your friends to play. For each friend you’ll get extra coins 🪙
              </p>
              <p>We’ll make sure Tap Duck becomes valuable 🐤
              </p>
              





            </div>
          </div>

          <div className="nickname-container">
            <img src={badgeImg} alt="Icon" className="nickname-icon" />
            <div className="nickname">{getUserFirstName ? getUserFirstName : getUserLastName}</div>
          </div>
          <button className="settings-button" onClick={walletHandler}>
            <img src={walletImg} alt="Settings" />
          </button>
        </div>
        <div className="balance-container">
          <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Icon" className="balance-icon" />
          <div className="balance">
            {balance.toLocaleString()}
          </div>
        </div>
        <div className="random-container">
          <div className={`random-title ${displayText.toLowerCase()}`}>
            {displayText.toLowerCase() === 'wait' ? (
              <div className="gif-container">
                <img src="https://media.tenor.com/DyB0LzkMkGQAAAAi/ultimate-uyta-ultimate-duck.gif" alt="Loading" className="gif" />
              </div>
            ) : displayText}
          </div>
          <button className="random-button" onClick={startScrolling} disabled={isScrolling || timer > 0}>
            {timer > 0 ? `${formatTime(timer)}` : 
              <>
                <img src="https://static.vecteezy.com/system/resources/previews/013/079/348/original/3d-illustration-mysteri-box-png.png" alt="Mining Icon" className="button-icon" />
                Mining
              </>
            }
          </button>
        </div>
        {showAnimation && (
          <div className="animation">
            +{animationValue}
          </div>
        )}
       
      </div>
    );
  }

  export default Home;
