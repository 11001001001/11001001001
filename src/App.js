import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3'; 
import Page4 from './Page4'; 
import LevelPage from './LevelPage';
import StoryComponent from './StoryComponent'; // Import the StoryComponent
import './App.css';
import './Navigation.css';
import hackerImg from "./chpic.su_-_UtyaDuckFull_027-ezgif.com-gif-maker.gif"

const API_BASE_URL = 'https://tapduck-3d49976b17d2.herokuapp.com/api';

function App() {
  const [notTime, setNotTime] = useState(null);
  const [loadingText, setLoadingText] = useState("Loading");
  const [checksCompleted, setChecksCompleted] = useState(false);
  const [storyCompleted, setStoryCompleted] = useState(null);
  const [dots, setDots] = useState("");
  const [usersCount, setUsersCount] = useState(0);


  window.Telegram.WebApp.expand();
  window.Telegram.WebApp.setHeaderColor('#282c34');
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();


  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
    } else if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  function decodePromoCode(promoCode) {
    return promoCode.replace(/[a-zA-Z]/g, '');
  }

  const handleStoryCompletion = () => {
    window.Telegram.WebApp.CloudStorage.setItem('storySeen', 'true', (error) => {
      if (error) {
        console.error('Failed to set storySeen in cloud storage:', error);
      }
    });
    setStoryCompleted(true);
  };

  useEffect(() => {
    const platform = window.Telegram.WebApp.platform;
    window.Telegram.WebApp.CloudStorage.getItems(['storySeen'], (error, result) => {
      if (error) {
        console.error('Failed to get storySeen from cloud storage:', error);
      } else {
        const seen = result.storySeen === 'true'; 
        setStoryCompleted(seen);
      }
    });

    if (platform !== "ios" && platform !== "android") {
      window.location.replace('https://hdr2029.github.io/monofacture/');    
    }

      const fetchInternetTime = async (retryCount = 3) => {
        try {
          const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC', { timeout: 5000 });
          const data = await response.json();
      
          // Проверка, есть ли данные о времени в ответе
          if (!data.unixtime) {
            throw new Error('No time data in response');
          }
      
          const internetUnixTime = data.unixtime;
          const localUnixTime = Math.floor(Date.now() / 1000);
      
          const allowedOffset = 100;
          const timeDifference = Math.abs(localUnixTime - internetUnixTime);
          if (timeDifference > allowedOffset) {
            setNotTime(true);
          }
      
        } catch (error) {
          console.error('Error fetching time from the internet:', error);
      
          // Если ошибка и еще есть попытки
          if (retryCount > 0) {
            console.log(`Retrying... ${retryCount} attempts left`);
      
            // Таймаут перед повторным запросом
            setTimeout(() => fetchInternetTime(retryCount - 1), 5000);
          }
        } finally {
          setChecksCompleted(true);
        }
      };
      
  
    fetchInternetTime();
  }, []);

  const fetchPromoData = (userId) => {
    fetch(`https://tapduck-3d49976b17d2.herokuapp.com/api/promo-count/${userId}`)
      .then(response => response.json())
      .then(data => {
        const { promo_count } = data;
        setUsersCount(promo_count);
        window.Telegram.WebApp.CloudStorage.setItem('usersCount', promo_count, (error) => {
          if (error) {
            console.error('Failed to set promo in cloud storage:', error);
          }
        });
      })
      .catch(error => console.error('Failed to fetch promo data:', error));
  };

  useEffect(() => {
    const checkUserExistence = async () => {
      const userId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
      const promoCode = window.Telegram.WebApp.initDataUnsafe.start_param;
      const isPremium = window.Telegram.WebApp.initDataUnsafe.user.is_premium;
  
      try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}/`);
        if (response.status === 404) {
          // New user, create and update balance
          const userData = {
            user_id: userId,
            username: window.Telegram.WebApp.initDataUnsafe.user.username,
            first_name: window.Telegram.WebApp.initDataUnsafe.user.first_name,
            last_name: window.Telegram.WebApp.initDataUnsafe.user.last_name,
            last_date: new Date().toISOString(),
            promo_code: decodePromoCode(promoCode),
            is_premium: isPremium,
          };
  
          const createUserResponse = await fetch(`${API_BASE_URL}/user/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
  
          if (createUserResponse.ok) {
            // Determine initial balance
            let initialBalance = 0;
            if (promoCode && isPremium) {
              initialBalance = 2000;
            } else if (promoCode) {
              initialBalance = 500;
            }
  
            window.Telegram.WebApp.CloudStorage.setItem('balance', initialBalance.toString(), (error) => {
              if (error) {
                console.error('Failed to set initial balance in cloud storage:', error);
              }
            });
  
            window.Telegram.WebApp.CloudStorage.setItem('existed001', 'true', (error) => {
              if (error) {
                console.error('Failed to set exist1 in cloud storage:', error);
              }
            });
          } else {
            console.error('Failed to create user');
          }
        } else if (response.ok) {
          // Existing user
          window.Telegram.WebApp.CloudStorage.setItem('existed001', 'true', (error) => {
            if (error) {
              console.error('Failed to set exist1 in cloud storage:', error);
            }
          });
        }
      } catch (error) {
        console.error('Error checking user existence:', error);
      }
    };
  
    window.Telegram.WebApp.CloudStorage.getItems(['existed001'], (error, result) => {
      if (error) {
        console.error('Failed to get exist1 from cloud storage:', error);
      } else {
        const exist1 = result.existed001 ? result.existed001 === 'true' : false;
        if (!exist1) {
          checkUserExistence();
        } else {
          fetchPromoData(userId)
        }
      }
    });
  }, []);

  
  useEffect(() => {
    if (!checksCompleted) {
      const interval = setInterval(() => {
        setDots((prevDots) => {
          // Если точек уже 3, убираем все и начинаем заново, иначе добавляем точку
          return prevDots.length < 3 ? prevDots + "." : "";
        });
      }, 250); // Используем случайное время для добавления точки

      return () => clearInterval(interval); // Очищаем интервал при завершении
    }
  }, [checksCompleted]);




  if (!checksCompleted) {
    return (
      <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-screen">
        <img src='https://i.ibb.co/jkm133P/photo-output.jpg' alt='Loading'/>
        <h3 className="loading-text">{loadingText}<span style={{ display: 'inline-block', width: '20px', textAlign: 'left' }}>{dots}</span> {/* Точки всегда остаются справа */}</h3>
      </div>
      </div>
    );
  }
  

  if (notTime === true) {
    return (
      <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <img src={hackerImg} alt="Suspicious activity detected" style={{ marginBottom: '20px', width: '100px' }} />
        <h1>Hah.. Little hacker :)</h1>
        <div style={{ fontStyle: 'italic', fontSize: '11px', textAlign: 'center', marginTop: '20px' }}>
          Good try but let's play fair. Any suspicious activity may lead to blockage of the account.
        </div>
      </div>
    );
  }
  
  
  if (!storyCompleted && checksCompleted === true)  {
    return <StoryComponent onComplete={handleStoryCompletion} />;
  }
  

  

  return (
    <Router basename="/11001001001">
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/page1" element={<Page1 />} exact />
          <Route path="/page2" element={<Page2 />} exact />
          <Route path="/page3" element={<Page3 />} exact /> 
          <Route path="/page4" element={<Page4 />} exact /> 
          <Route path="/levelpage" element={<LevelPage />} exact /> 
        </Routes>
        <nav className="nav">
          <Link to="/" className="nav-link" onClick={triggerHapticFeedback}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Sodium-crystal-3D-vdW.png" alt="Home" className="nav-icon" />
            <span>Mining</span>
          </Link>
          <Link to="/page1" className="nav-link" onClick={triggerHapticFeedback}>
            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/game-controller-4035922-3342601.png" alt="Page 1" className="nav-icon" />
            <span>Game</span>
          </Link>
          <Link to="/page2" className="nav-link" onClick={triggerHapticFeedback}>
            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/magnetic-power-7074108-5752015.png?f=webp" alt="Page 2" className="nav-icon" />
            <span>Friends</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
