import React, { useEffect, useState } from 'react';
import './Page2.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import ConfettiCanvas from './ConfettiCanvas';
import friendsImage from "./chpic.su_-_UtyaDuckFull_027-ezgif.com-gif-maker.gif";

function Page2() {
  const [promoCode, setPromoCode] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [availableCoins, setAvailableCoins] = useState(0);
  const [claimedCoins, setClaimedCoins] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [balance1, setBalance1] = useState(0.00);
  const [balanceIconVisible, setBalanceIconVisible] = useState(false);

  const triggerHapticFeedbackSuccess = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    } else if (navigator.vibrate) {
      navigator.vibrate(50); 
    }
  };

  useEffect(() => {
    const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
    setBalanceIconVisible(true);

    window.Telegram.WebApp.CloudStorage.getItems(['promo', 'balance', 'claimedCoins'], (error, result) => {
      if (error) {
        console.error('Failed to get items from cloud storage:', error);
      } else {
        let promo = result.promo;
        setBalance1(parseFloat(result.balance) || 0.00);
        if (!promo) {
          promo = generatePromoCode(userId);
          window.Telegram.WebApp.CloudStorage.setItem('promo', promo, (error) => {
            if (error) {
              console.error('Failed to set promo in cloud storage:', error);
            }
          });
        }
        setPromoCode(promo);

        const balance = parseFloat(result.balance || '0');
        const claimedCoins = parseInt(result.claimedCoins || '0', 10);
        setClaimedCoins(claimedCoins);
        fetchPromoData(userId, balance, claimedCoins);
      }
    });
  }, []);

  const fetchPromoData = (userId, balance, claimedCoins) => {
    fetch(`https://tapduck-3d49976b17d2.herokuapp.com/api/promo-count/${userId}`)
      .then(response => response.json())
      .then(data => {
        const { promo_count, premium_count } = data;
        setUsersCount(promo_count);
        const newAvailableCoins = (promo_count * 500) + (premium_count * 1500) - claimedCoins;
        setAvailableCoins(newAvailableCoins > 0 ? newAvailableCoins : 0);
      })
      .catch(error => console.error('Failed to fetch promo data:', error));
  };

  const claimCoins = () => {
    window.Telegram.WebApp.CloudStorage.getItems(['balance'], (error, result) => {
      if (error) {
        console.error('Failed to get balance from cloud storage:', error);
      } else {
        const balance = parseFloat(result.balance || '0');
        const newBalance = balance + availableCoins;
        setBalance1(newBalance);
        window.Telegram.WebApp.CloudStorage.setItem('balance', newBalance.toString(), (error) => {
          if (error) {
            console.error('Failed to update balance in cloud storage:', error);
          } else {
            triggerHapticFeedbackSuccess();
            setAvailableCoins(0);
            setShowConfetti(true);
            setClaimedCoins(claimedCoins + availableCoins);
            window.Telegram.WebApp.CloudStorage.setItem('claimedCoins', (claimedCoins + availableCoins).toString(), (error) => {
              if (error) {
                console.error('Failed to update claimed coins in cloud storage:', error);
              }
            });
          }
        });
      }
    });
  };

  const shareMessage = () => {
    triggerHapticFeedbackSuccess();
    const text = encodeURIComponent("");
    const url = encodeURIComponent(`https://t.me/TapDuckRobot/play?startapp=${promoCode}`);
    const telegramShareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(telegramShareUrl, '_blank');
  };

  const copyToClipboard = () => {
    triggerHapticFeedbackSuccess();
    const url = `https://t.me/TapDuckRobot/play?startapp=${promoCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyMessage('');
      setTimeout(() => setCopyMessage(''), 2000);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  function generatePromoCode(userId) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const userIdStr = userId.toString();
    let promoCode = '';
    for (let i = 0; i < userIdStr.length; i++) {
      promoCode += chars.charAt(Math.floor(Math.random() * chars.length));
      promoCode += userIdStr[i];
    }
    while (promoCode.length < 22) {
      promoCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return promoCode;
  }

  return (
    <div className="page2">
      <div className={`friends-display ${'slide-in-right'}`} style={{ fontFamily: '-apple-system'}}>
                <img src="https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png" alt="Balance Icon" className="balance-icon" />
                {usersCount.toLocaleString()}
            </div>
      <div className={`balance-display ${balanceIconVisible ? 'slide-in-right' : ''}`}>
        <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Balance Icon" className="balance-icon" />
        {balance1.toLocaleString()}
      </div>
      <div className="video-container">
        <img src={friendsImage} className="centered-video" alt='Loading..' />
      </div>
      <div className="welcome-text">Friends</div>
      <div className="bonus-text">Invite friends and you'll both receive a reward</div>
      <div className="friend-section">
        <div className="friend-container">
          <img src="https://cdn-icons-png.flaticon.com/512/4423/4423663.png" alt="icon" className="friend-icon" />
          <div className="friend-text">Regular</div>
          <div className="friend-bonus">
            <img src="https://static.vecteezy.com/system/resources/previews/019/051/642/original/gold-coins-symbol-png.png" alt="small icon" className="small-icon" />
            <div>+500</div>
          </div>
        </div>
        <div className="friend-container premium">
          <img src="https://s3.getstickerpack.com/storage/uploads/sticker-pack/telegram-premium/tray_large.png?1b9970f7c6b9a75d8733911336ffaff1&d=100x100" alt="icon" className="friend-icon" />
          <div className="friend-text">Premium</div>
          <div className="friend-bonus">
            <img src="https://static.vecteezy.com/system/resources/previews/019/051/642/original/gold-coins-symbol-png.png" alt="small icon" className="small-icon" />
            <div>+2 000</div>
          </div>
        </div>
      </div>
      <div className="centered-content">
        <div className="centered-number">{availableCoins.toLocaleString()}</div>
        <button className="number-button" onClick={claimCoins} disabled={availableCoins <= 0}>Claim</button>
      </div>
      {showConfetti && <ConfettiCanvas trigger={showConfetti} />}
      <div className="button-container">
        <button className="invite-button" onClick={shareMessage}>Invite</button>
        <button className="copy-button" onClick={copyToClipboard}>
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>
      {claimedCoins && (
        <div className="copy-message">
          
          Rewarded {claimedCoins.toLocaleString()} {copyMessage}
          <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Balance Icon" className="balance-icon" />
        </div>
      )}
    </div>
  );
}

export default Page2;
