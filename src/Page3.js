import React, { useState, useEffect, useRef } from 'react';
import './Page3.css';
import ConfettiCanvas from './ConfettiCanvas';
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';

function Page3() {
  const [value, setValue] = useState(0.00);
  const [balance, setBalance] = useState(0.00);
  const [bet, setBet] = useState('');
  const [tickets, setTickets] = useState(9);
  const [message, setMessage] = useState('Введите ставку');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateInput, setAnimateInput] = useState(false);
  const [animateValue, setAnimateValue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate(); // Хук для навигации

  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
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
    const { Telegram } = window;
    if (Telegram.WebApp) {
      Telegram.WebApp.BackButton.show();
      Telegram.WebApp.BackButton.onClick(() => {
        navigate('/page1'); 
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
    const betAmount = parseFloat(bet);
    if (bet === '') {
      setMessage('Select your bet');
    } else if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
      setMessage('Not enough tokens');
    } else if (!tickets) {
      setMessage('Need more tickets');
    } else {
      setMessage('Hold on')
    }
  }, [bet, balance, tickets]);

  useEffect(() => {
    setAnimateInput(true);
    setAnimateValue(true);
  }, []);

  useEffect(() => {
    

    const getTicketsFromCloud = () => {
      window.Telegram.WebApp.CloudStorage.getItem('tickets', (error, value) => {
        if (error) {
          console.error('Failed to get tickets from cloud storage:', error);
        } else {
          const savedTickets = value ? parseInt(value, 10) : 9;
          setTickets(savedTickets);
        }
      });
    };

    getTicketsFromCloud();

  }, []);

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
    const loadingTimeout = setTimeout(() => setLoading(false), 4000); // Hide loading screen after 4 seconds
    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    if (tickets === 0) {
      const calculateTimeLeft = () => {
        const now = new Date();
        const nextReset = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const difference = 0

        let hours = Math.floor(difference / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (timeLeft == "00:00:00") {
          setTickets(9)
        } else {
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      };

      calculateTimeLeft();
      const timeInterval = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timeInterval);
    } 
  }, [tickets]);

  const handle10 = (cef) => {
    const betValue = Math.floor(balance * cef);
    setBet(betValue);
  }

  const handleButtonPress = () => {
    const betAmount = parseFloat(bet);
    if (!isNaN(betAmount) && betAmount <= balance && betAmount > 0 && tickets > 0 && !isPlaying) {
      setIsPlaying(true);
      setValue(1.00);
      setGameOver(false);
      setResult(null);
      setShowConfetti(false);
      setTickets((prevTickets) => {
        const newTickets = prevTickets - 1;
        window.Telegram.WebApp.CloudStorage.setItem('tickets', newTickets.toString(), (error, success) => {
          if (error) {
            console.error('Failed to update tickets in cloud storage:', error);
          } else {
            console.log('Tickets updated successfully in cloud storage:', success);
          }
        });
        return newTickets;
      });
      setBalance((prevBalance) => {
        const newBalance = parseFloat((prevBalance - betAmount).toFixed(2));
        return isNaN(newBalance) || newBalance < 0 ? 0 : newBalance;
      });

      intervalRef.current = setInterval(() => {
        setValue((prevValue) => parseFloat((prevValue + 0.01).toFixed(2)));
        triggerHapticFeedback();
      }, 100); // Увеличиваем коэффициент каждые 100 мс

      const randomFactor = Math.random();
      let randomTime;

      if (randomFactor < 0.1) {
        // 10% случаев - от 0 до 1000
        randomTime = Math.floor(Math.random() * 1001);
      } else if (randomFactor < 0.2) {
        // Следующие 10% - от 1100 до 2000
        randomTime = Math.floor(Math.random() * 901) + 1100;
      } else if (randomFactor < 0.3) {
        // Следующие 10% - от 2100 до 3000
        randomTime = Math.floor(Math.random() * 901) + 2100;
      } else if (randomFactor < 0.4) {
        // Следующие 10% - от 3100 до 4000
        randomTime = Math.floor(Math.random() * 901) + 30100;
      } else if (randomFactor < 0.5) {
        // Следующие 10% - от 4100 до 5000
        randomTime = Math.floor(Math.random() * 901) + 4100;
      } else if (randomFactor < 0.6) {
        // Следующие 10% - от 5100 до 6000
        randomTime = Math.floor(Math.random() * 901) + 55100;
      } else if (randomFactor < 0.7) {
        // Следующие 10% - от 6100 до 7000
        randomTime = Math.floor(Math.random() * 901) + 66100;
      } else if (randomFactor < 0.8) {
        // Следующие 10% - от 7100 до 8000
        randomTime = Math.floor(Math.random() * 901) + 7100;
      } else if (randomFactor < 0.9) {
        // Следующие 10% - от 8100 до 9000
        randomTime = Math.floor(Math.random() * 901) + 28100;
      } else {
        // Последние 10% - от 9100 до 10000
        randomTime = Math.floor(Math.random() * 901) + 99100;
      }




      timeoutRef.current = setTimeout(() => {
        clearInterval(intervalRef.current);
        setGameOver(true);
        setResult(`-${betAmount.toFixed(2)} coin`);
        setIsPlaying(false);
        setBet(''); // Сбрасываем ставку
        triggerHapticFeedbackError();
        setTimeout(() => {
          setGameOver(false);
          setResult(null);
          
        }, 1000); // 1 секунда задержки
      }, randomTime);
    }
  };

  const handleButtonRelease = () => {
    if (!gameOver && isPlaying) {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      const betAmount = parseFloat(bet);
      const winnings = parseFloat((betAmount * value).toFixed(2));
      const newBalance = parseFloat((balance + winnings).toFixed(2));
      setBalance(isNaN(newBalance) || newBalance < 0 ? 0 : Math.floor(newBalance));
      window.Telegram.WebApp.CloudStorage.setItem('balance', Math.floor(newBalance).toString(), (error) => {
        if (error) {
          console.error('Failed to update balance in cloud storage:', error);
        }
      });
      setResult(`+${winnings.toFixed(2)} coin`);
      setBet('');
      setValue(0.00);
      setIsPlaying(false);
      setShowConfetti(true);
      triggerHapticFeedbackSuccess();

      setTimeout(() => {
        setGameOver(false);
        setResult(null);
      }, 1000);
    }
  };

  useEffect(() => {
    if (gameOver) {
      window.Telegram.WebApp.CloudStorage.setItem('balance', (balance).toString(), (error) => {
        if (error) {
          console.error('Failed to update balance in cloud storage:', error);
        }
      });
    }
  }, [gameOver, balance]);

  if (loading) {
    return <LoadingScreen onEnd={() => setLoading(false)} />;
  }

  return (
    <div className="page3">
      <div className="ticket-display">
        {tickets ? tickets : timeLeft} 🎫

      </div>
      <div className={`balance-display ${'slide-in-right'}`}>
        <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Balance Icon" className="balance-icon" />
        {balance.toLocaleString()}
      </div>
      <div className={`value-display ${animateValue ? 'slide-in-value' : ''}`}>
        {gameOver ? <span style={{ color: 'red' }}>You lose</span> : `x ${value.toFixed(2)}`}
      </div>
      <button
        className="fingerprint-button"
        onMouseDown={handleButtonPress}
        onMouseUp={handleButtonRelease}
        onTouchStart={handleButtonPress}
        onTouchEnd={handleButtonRelease}
        disabled={parseFloat(bet) > balance || isNaN(parseFloat(bet)) || parseFloat(bet) <= 0 || isPlaying || tickets <= 0}
        
      >
        <img
          src="https://pngimg.com/uploads/fingerprint/fingerprint_PNG96.png"
          alt="Fingerprint"
          className="fingerprint-image"
          style={{opacity: parseFloat(bet) > balance || isNaN(parseFloat(bet)) || parseFloat(bet) <= 0 || isPlaying || tickets <= 0 ? "0.1" : "1"}}
        />
      </button>
      <div className={`input-container ${animateInput ? 'slide-in' : ''} ${isPlaying ? 'slide-out' : ''}`} >
        <label htmlFor="bet-input" style={{ color: message === 'Вы не можете играть' ? 'red' : 'white' }}>
          {message}
        </label>
        <div className='bet-value' style={{ fontSize: bet ? "40px" : "20px", fontWeight: bet ? "bold" : "", marginBottom: "10px", height: "50px" }}>{bet}</div>
      </div>
      <div className="bet-buttons">
        <button onClick={() => handle10(0.1)}>10%</button>
        <button onClick={() => handle10(0.2)}>20%</button>
        <button onClick={() => handle10(0.5)}>50%</button>
        <button onClick={() => handle10(1)}>100%</button>
      </div>
      <nav className={`nav ${isPlaying ? 'slide-out' : 'slide-in'}`}>
        {/* Вставьте сюда ваш HTML для меню */}
      </nav>
      {result && <div className={`result ${result.startsWith('+') ? 'win' : 'lose'}`}>{result}</div>}
      {showConfetti && <ConfettiCanvas trigger={showConfetti} />}
    </div>
  );
}

export default Page3;
