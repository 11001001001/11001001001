import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfettiCanvas from './ConfettiCanvas';


const LevelPage = () => {
  const [headerExpand, setHeaderExpand] = useState(false);
  const [elementsVisible, setElementsVisible] = useState(false);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [balance, setBalance] = useState(0);
  const [balanceRate, setBalanceRate] = useState(1);
  const [usersRate, setUsersRate] = useState(1);
  const [usersCount, setUsersCount] = useState(0);
  const [Ad, setAd] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [shake1, setShake1] = useState(false);
  const [pause, setPause] = useState(false);

  const navigate = useNavigate();

  
  const balanceThresholds = [100, 250, 500, 750, 1000, 2500, 5000, 10000, 25000, 50000, 75000, 100000, 200000, 350000, 500000, 750000, 1000000, 2000000, 5000000, 10000000, 20000000, 35000000, 50000000, 75000000, 100000000, 150000000, 250000000, 500000000, 1000000000, 100000000000, 200000000000, 500000000000, 1000000000000, 2000000000000, 5000000000000, 10000000000000, 10000000000001,10000000000002, 99999999999999999999999999];
  const usersThresholds = [1, 2, 3, 4, 5, 6, 7,10,13,16,19,22,25,28,31,34,37,40,50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 3000, 6000, 120000, 240000, 1000000000000];
  const levelThresholds = [10000, 50000, 100000, 250000, 450000, 650000, 850000, 1000000, 1500000, 2000000, 3000000, 4000000, 5000000, 7500000, 10000000, 12500000, 15000000, 20000000, 21000000, 22000000, 23000000, 24000000, 25000000 ];

  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged('light');
    } else if (navigator.vibrate) {
      navigator.vibrate(50); // Для Android устройств
    }
  };

  const triggerHapticFeedbackError = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    } else if (navigator.vibrate) {
      navigator.vibrate(50); // Для Android устройств
    }
  };

  const triggerHapticFeedbackSuccess = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    } else if (navigator.vibrate) {
      navigator.vibrate(50); // Для Android устройств
    }
  };


  useEffect(() => {
    // Получаем данные из cloudStorage при загрузке страницы
    const getInitialData = () => {
      window.Telegram.WebApp.CloudStorage.getItems(['balance', 'balanceRate011', 'level011', 'progress011', 'usersCount', 'usersRate011', 'AdTapDuck011'], (error, result) => {
        if (error) {
          console.error('Failed to get initial data from cloud storage:', error);
        } else {
          const initialBalance = result.balance ? parseInt(result.balance, 10) : 0;
          const initialRate = result.balanceRate011 ? parseInt(result.balanceRate011, 10) : 1;
          const initialUsersRate = result.usersRate011 ? parseInt(result.usersRate011, 10) : 1;
          const initialLevel = result.level011 ? parseInt(result.level011, 10) : 1;
          const initialProgress = result.progress011 ? parseInt(result.progress011, 10) : 0;
          const initialUsers = result.usersCount ? parseInt(result.usersCount, 10) : 0;
          const initialAd = result.AdTapDuck011 ? parseInt(result.AdTapDuck011, 10) : 0;

          setBalance(initialBalance);
          setBalanceRate(initialRate);
          setLevel(initialLevel);
          setProgress(initialProgress);
          setUsersCount(initialUsers)
          setUsersRate(initialUsersRate)
          setAd(initialAd)
        }
      });
    };

    getInitialData();
  }, []);

  useEffect(() => {
    const { Telegram } = window;
    if (Telegram.WebApp) {
      Telegram.WebApp.BackButton.show();
      Telegram.WebApp.BackButton.onClick(() => {
        setIsExiting(true);
        setTimeout(() => {
          navigate('/');
        }, 850);
      });
    }

    return () => {
      if (Telegram.WebApp) {
        Telegram.WebApp.BackButton.offClick();
        Telegram.WebApp.BackButton.hide();
      }
    };
  }, [navigate]);

  useEffect(() => {
    setTimeout(() => {
      setHeaderExpand(true);
    }, 100);
    setTimeout(() => {
      setElementsVisible(true);
    }, 550);
  }, []);

  const redirectToChannel = () => {
    if (Ad === 1) {
      triggerHapticFeedbackSuccess()

      if (progress >= 80) {
        setPause(true); // Активируем тряску
        setTimeout(() => setPause(false), 500); 
        setProgress(prev => prev + 20);
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setProgress(0);
          setAd(prev => prev + 1)
          setShowConfetti(true);
          triggerHapticFeedbackSuccess()
          setBalance(prev => prev + levelThresholds[level - 1])
          window.Telegram.WebApp.CloudStorage.setItem('balance', Math.floor(balance + levelThresholds[level - 1]).toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
          window.Telegram.WebApp.CloudStorage.setItem('progress011', (0).toString(), (error, success) => {
            if (error) {
              console.error('Error setting progress:', error);
            }
          });
          window.Telegram.WebApp.CloudStorage.setItem('level011', (level + 1).toString(), (error, success) => {
            if (error) {
              console.error('Error setting level:', error);
            }
          });
          window.Telegram.WebApp.CloudStorage.setItem('AdTapDuck011', (Ad + 1).toString(), (error, success) => {
          if (error) {
            console.error('Error setting balanceRate2:', error);
          }
        });
        
        }, 500);
        
      } else {
        setPause(true); // Активируем тряску
        setTimeout(() => setPause(false), 500); 
        
        setProgress(prev => prev + 20);
        setAd(prev => prev + 1)

        window.Telegram.WebApp.CloudStorage.setItem('progress011', (progress + 20).toString(), (error, success) => {
          if (error) {
            console.error('Error setting progress:', error);
          }
        });
          window.Telegram.WebApp.CloudStorage.setItem('AdTapDuck011', (Ad + 1).toString(), (error, success) => {
          if (error) {
            console.error('Error setting balanceRate2:', error);
          }
        });
      }
    } else {
      triggerHapticFeedback()

      if (Ad <= 0) {
        setAd(prev => prev + 1)
        window.open('https://t.me/tap_duck_official', '_blank');
      } else {
        window.open('https://t.me/tap_duck_official', '_blank');
      }
    }
    
  };

  const handleIncreaseProgressBalance = () => {
    if (balance >= balanceThresholds[balanceRate - 1]) {
      triggerHapticFeedbackSuccess()
      if (progress >= 80) {
        setPause(true); 
        setTimeout(() => setPause(false), 500); 
        setProgress(prev => prev + 20);
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setProgress(0);
          setShowConfetti(true);
          triggerHapticFeedbackSuccess()
          setBalance(prev => prev + levelThresholds[level - 1])

          window.Telegram.WebApp.CloudStorage.setItem('balance', Math.floor(balance + levelThresholds[level - 1]).toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
          window.Telegram.WebApp.CloudStorage.setItem('progress011', (0).toString(), (error, success) => {
            if (error) {
              console.error('Error setting progress:', error);
            }
          });
          window.Telegram.WebApp.CloudStorage.setItem('level011', (level + 1).toString(), (error, success) => {
            if (error) {
              console.error('Error setting level:', error);
            }
          });
          setBalanceRate(prev => prev + 1);
          window.Telegram.WebApp.CloudStorage.setItem('balanceRate011', (balanceRate + 1).toString(), (error, success) => {
          if (error) {
            console.error('Error setting balanceRate2:', error);
          }
        });
        }, 500);
        
      } else {
        setPause(true); // Активируем тряску
        setTimeout(() => setPause(false), 500); 
        setProgress(prev => prev + 20);
        window.Telegram.WebApp.CloudStorage.setItem('progress011', (progress + 20).toString(), (error, success) => {
          if (error) {
            console.error('Error setting progress:', error);
          }
        });
        setBalanceRate(prev => prev + 1);
          window.Telegram.WebApp.CloudStorage.setItem('balanceRate011', (balanceRate + 1).toString(), (error, success) => {
          if (error) {
            console.error('Error setting balanceRate2:', error);
          }
        });
      }
    } else {
      triggerHapticFeedbackError()
      setShake1(true); // Активируем тряску
      setTimeout(() => setShake1(false), 500); 
    }
  };

  const handleIncreaseProgressUsers = () => {
    if (usersCount >= usersThresholds[usersRate - 1]) {
      triggerHapticFeedbackSuccess()
      if (progress >= 80) {
        setPause(true); // Активируем тряску
        setTimeout(() => setPause(false), 500); 
        setProgress(prev => prev + 20);
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setProgress(0);
          setShowConfetti(true);
          triggerHapticFeedbackSuccess()
          setBalance(prev => prev + levelThresholds[level - 1])

          window.Telegram.WebApp.CloudStorage.setItem('balance', Math.floor(balance + levelThresholds[level - 1]).toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
          window.Telegram.WebApp.CloudStorage.setItem('progress011', (0).toString(), (error, success) => {
            if (error) {
              console.error('Error setting progress:', error);
            }
          });
          window.Telegram.WebApp.CloudStorage.setItem('level011', (level + 1).toString(), (error, success) => {
            if (error) {
              console.error('Error setting level:', error);
            }
          });
          setUsersRate(prev => prev + 1);
          window.Telegram.WebApp.CloudStorage.setItem('usersRate011', (usersRate + 1).toString(), (error, success) => {
          if (error) {
            console.error('Error setting balanceRate2:', error);
          }
        });
        }, 500);
        
      } else {
        setPause(true); // Активируем тряску
        setTimeout(() => setPause(false), 500); 
        setProgress(prev => prev + 20);
        window.Telegram.WebApp.CloudStorage.setItem('progress011', (progress + 20).toString(), (error, success) => {
          if (error) {
            console.error('Error setting progress:', error);
          }
        });
        setUsersRate(prev => prev + 1);
          window.Telegram.WebApp.CloudStorage.setItem('usersRate011', (usersRate + 1).toString(), (error, success) => {
          if (error) {
            console.error('Error setting balanceRate2:', error);
          }
        });
      }
    } else {
      triggerHapticFeedbackError()
      setShake(true); // Активируем тряску
      setTimeout(() => setShake(false), 500); 
    }
  };

  const getProgressColor = () => {
    const colors = [
      '#edfd1d', 
      '#5bf92e',  
      '#00fdff',  
      '#6582ff',  
      '#945fff',  
      '#fe0c7f',  
      '#fd0101', 
      '#fd6012',  
      '#fdb71e', 
      '#fde330'   
    ];
    
    return colors[(level - 1) % colors.length];
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100vh',
      textAlign: 'center',
      color: 'inherit',
      paddingBottom: '80px',
      fontFamily: "'Comfortaa', sans-serif",

      
    }}>
      <div className={`friends-display ${'slide-in-right'}`} style={{opacity: elementsVisible && !isExiting ? 1 : 0,
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out', fontFamily: '-apple-system'}}>
                <img src="https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png" alt="Balance Icon" className="balance-icon" />
                {usersCount.toLocaleString()}
            </div>
      <div className={`balance-display ${'slide-in-right'}`} style={{opacity: elementsVisible && !isExiting ? 1 : 0,
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out', fontFamily: '-apple-system'}}>
                <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Balance Icon" className="balance-icon" />
                {balance.toLocaleString()}
            </div>
      <div style={{
        width: '100%',
        height: headerExpand && !isExiting ? 'calc(65vh + 120px)' : '120px',
        boxShadow: '0 1px 50px rgba(93, 95, 98, 0.6)',
        backgroundColor: 'rgba(168, 8%, 91%, 0.76)',
        borderBottomLeftRadius: '50% 20%',
        borderBottomRightRadius: '50% 20%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        transition: 'height 0.75s ease-in-out',
        flexDirection: 'column'
      }}>
        <div style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: "url('https://www.transparenttextures.com/patterns/stardust.png') repeat",
          animation: 'level-moveBackground 20s linear infinite'
        }}></div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '-80px', opacity: elementsVisible && !isExiting ? 1 : 0,
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out'}}>
    <img src="https://static-00.iconduck.com/assets.00/medal-gold-winner-2-icon-986x1024-v2w53lw3.png" alt='e' style={{ width: '30px', marginRight: '5px' }} />
    <h1 style={{
      fontFamily: "'Audiowide', sans-serif",
      color: '#fff',
      fontSize: '36px',
      zIndex: '2',
      opacity: elementsVisible && !isExiting ? 1 : 0,
      transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out'
    }}>
      {level}
    </h1>
</div>

        
        <h1 style={{
          fontFamily: "'Audiowide', sans-serif",
          color: '#fff',
          fontSize: '65px',
          zIndex: '2',
          opacity: elementsVisible && !isExiting ? 1 : 0,
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out'
        }}>
          LEVEL
        </h1>

        <div style={{
          position: 'relative',
          width: '56%',
          height: '15px',
          marginBottom: '30px',
          marginTop: '-30px',
          borderRadius: '10px',
          overflow: 'hidden',
          zIndex: '2',
          opacity: elementsVisible && !isExiting ? 1 : 0,
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out',
          backgroundColor: 'rgba(0,0,0,0.5)',
          
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: getProgressColor(),
            transition: 'width 0.5s ease',
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                height: '100%',
                width: '2px',
                backgroundColor: 'rgba(221, 221, 221, 0.05)',
                left: `${(i + 1) * 20}%`,
                top: 0
              }} />
            ))}
          </div>
        </div>
        {showConfetti && <ConfettiCanvas trigger={showConfetti} />}

        <div style={{
          fontFamily: '-apple-system',
          color: '#fff',
          fontSize: '17px',
          zIndex: '2',
          marginBottom: '10px',
          opacity: elementsVisible && !isExiting ? 1 : 0,
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out'
        }}> Next Level Reward </div>
        <div style={{
          fontFamily: '-apple-system',
          color: '#fff',
          fontSize: '17px',
          zIndex: '2',
          opacity: elementsVisible && !isExiting ? 1 : 0,
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out'
        }}> +{levelThresholds[level - 1].toLocaleString()} <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Balance Icon" style={{height: '17px', marginBottom: '-2px'}} /></div>

        {/* Независимый блок с обработчиком клика для увеличения прогресса */}
        <div onClick={pause ? null : handleIncreaseProgressBalance} className={shake1 ? 'shake1' : ''} style={{
          marginTop: "20px",
          fontFamily: '-apple-system',

          borderRadius: '10px',
          height: '50px',
          width: '70%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          zIndex: '2',
          cursor: 'pointer',
          fontSize: '13px',
          opacity: elementsVisible && !isExiting ? 1 : 0,
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out 0.1s',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', 

        }}>
          <span style={{color: shake1 ? 'red' : 'white'}}>Reach {balanceThresholds[balanceRate - 1].toLocaleString()} Coins</span>
          <span style={{color: getProgressColor(), fontFamily: '-apple-system'}}>+20Xp</span>
        </div>

        <div 
          onClick={pause ? null : handleIncreaseProgressUsers} 
          className={shake ? 'shake' : ''}
          style={{
            marginTop: "20px",
            fontFamily: '-apple-system',

            borderRadius: '10px',
            height: '50px',
            width: '70%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 20px',
            zIndex: '2',
            fontSize: '13px',
            opacity: elementsVisible && !isExiting ? 1 : 0,
            transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out 0.1s',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        >
          <span style={{color: shake ? 'red' : 'white'}}>Invite {usersThresholds[usersRate - 1].toLocaleString()} {usersThresholds[usersRate - 1] > 1 ? 'friends' : 'friend'}</span>
          <span style={{color: getProgressColor(), fontFamily: '-apple-system'}}>+20Xp</span>
        </div>


        <div onClick={pause ? null : redirectToChannel} style={{
          marginTop: "20px",
          fontFamily: '-apple-system',

          borderRadius: '10px',
          height: '50px',
          width: '70%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          zIndex: '2',
          opacity: elementsVisible && !isExiting ? 1 : 0,
          fontSize: '13px',
          transition: isExiting ? 'opacity 0.5s ease-in-out' : 'opacity 0.5s ease-in-out 0.1s',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', 

        }}>
          <span>Subscribe on Duck Community</span>
          <span style={{color: getProgressColor(), fontFamily: '-apple-system'}}>+20Xp</span>
        </div>
        
      </div>

      <style>{`
      .shake {
      animation: shake-animation 0.5s ease;
    }

    @keyframes shake-animation {
      0% { transform: translate(0, 0); }
      10% { transform: translate(-5px, 0); }
      20% { transform: translate(5px, 0); }
      30% { transform: translate(-5px, 0); }
      40% { transform: translate(5px, 0); }
      50% { transform: translate(-5px, 0); }
      60% { transform: translate(5px, 0); }
      70% { transform: translate(-5px, 0); }
      80% { transform: translate(5px, 0); }
      90% { transform: translate(-5px, 0); }
      100% { transform: translate(0, 0); }
    }
      .shake1 {
      animation: shake1-animation 0.5s ease;
    }

    @keyframes shake1-animation {
      0% { transform: translate(0, 0); }
      10% { transform: translate(-5px, 0); }
      20% { transform: translate(5px, 0); }
      30% { transform: translate(-5px, 0); }
      40% { transform: translate(5px, 0); }
      50% { transform: translate(-5px, 0); }
      60% { transform: translate(5px, 0); }
      70% { transform: translate(-5px, 0); }
      80% { transform: translate(5px, 0); }
      90% { transform: translate(-5px, 0); }
      100% { transform: translate(0, 0); }
    }
        @keyframes level-moveBackground {
          0% { background-position: 0 0; }
          100% { background-position: -1000px -1000px; }
        }
          @keyframes pulse {
      0% {
        box-shadow: 0 0 10px 1px ${getProgressColor()}80;  // Начальная тень
      }
      50% {
        box-shadow: 0 0 10px 1px ${getProgressColor()}10;  // Светлая тень
      }
      100% {
        box-shadow: 0 0 10px 1px ${getProgressColor()}80;  // Обратно к начальной
      }
    }
      `}</style>
    </div>
  );
};

export default LevelPage;
