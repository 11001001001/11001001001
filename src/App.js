import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3'; // Импортируем Page3
import './App.css';
import './Navigation.css';

function App() {
  const [pageLoaded, setPageLoaded] = useState(null);
  const [notTime, setNotTime] = useState(null);


  window.Telegram.WebApp.setHeaderColor('#282c34');

  

  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
    } else if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  useEffect(() => {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    const platform = navigator.platform.toLowerCase();
    const fetchInternetTime = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await response.json();
        const internetUnixTime = data.unixtime;
        const localUnixTime = Math.floor(Date.now() / 1000); 

        // Устанавливаем допустимое отклонение времени (например, 100 секунд)
        const allowedOffset = 100; // 100 секунд
        const timeDifference = Math.abs(localUnixTime - internetUnixTime);

        if (platform.includes("win") || platform.includes("mac")) {
          console.log("Open on your mobile device or check your device date");
          setPageLoaded(true);
        } else if (timeDifference > allowedOffset) {
          setNotTime(true);
        } else {
          setPageLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching time from the internet:', error);
        setNotTime(true);
      }
    };

    fetchInternetTime();
  }, []);

  if (pageLoaded === false) {
    return (
      <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Denied</h1>
      </div>
    );
  }

  if (notTime === true) {
    return (
      <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Little hacker</h1>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes basename="/11001001001">
          <Route path="/" element={<Home />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} /> {/* Добавляем маршрут для Page3 */}
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
