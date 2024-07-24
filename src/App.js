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
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  window.Telegram.WebApp.expand();
  window.Telegram.WebApp.setHeaderColor('#282c34');

  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
    } else if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();

    const fetchInternetTime = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await response.json();
        const internetUnixTime = data.unixtime;
        const localUnixTime = Math.floor(Date.now() / 1000);

        const allowedOffset = 100; // 100 seconds
        const timeDifference = Math.abs(localUnixTime - internetUnixTime);

        if (platform.includes("win") || platform.includes("mac")) {
          console.log("Open on your mobile device or check your device date");
          setPageLoaded(false);
        } else if (timeDifference > allowedOffset) {
          setNotTime(true);
        } else {
          setPageLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching time from the internet:', error);
        setNotTime(false);
      }
    };

    fetchInternetTime();
  }, []);

  useEffect(() => {
    if (loading) {
      const updateLoadingText = () => {
        const dotsCount = Math.random() < 0.5 ? 2 : 3;
        setLoadingText("Loading" + ".".repeat(dotsCount));
      };
      const interval = setInterval(updateLoadingText, 250); // Update every 500ms
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    const checkLastVisitTime = () => {
      window.Telegram.WebApp.CloudStorage.getItems(['lastVisit'], (error, result) => {
        if (error) {
          console.error('Failed to get lastVisit from cloud storage:', error);
          setLoading(false);
        } else {
          const lastVisit = result.lastVisit ? parseInt(result.lastVisit, 10) : null;
          const currentTime = Date.now();

          if (!lastVisit || currentTime - lastVisit > 3600000) { // 1 hour in milliseconds
            window.Telegram.WebApp.CloudStorage.setItem('lastVisit', currentTime.toString(), (error) => {
              if (error) {
                console.error('Failed to set lastVisit in cloud storage:', error);
              }
            });
            setLoading(true);
          } else {
            setLoading(false);
          }
        }
      });
    };

    checkLastVisitTime();
  }, []);

  useEffect(() => {
    if (pageLoaded === true) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [pageLoaded]);

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

  if (loading) {
    return (
      <div className="loading-screen">
        <img src='https://i.ibb.co/vHGj0nj/IMG-1599.webp' alt='Loading'/>
        <h3 className="loading-text">{loadingText}</h3>
      </div>
    );
  }

  return (
    <Router basename="/11001001001">
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/page1" element={<Page1 />} exact />
          <Route path="/page2" element={<Page2 />} exact />
          <Route path="/page3" element={<Page3 />} exact /> 
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
