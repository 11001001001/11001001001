import React from 'react';
import './Page2.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import friendsImage from "./chpic.su_-_UtyaDuckFull_027-ezgif.com-gif-maker.gif"

function Page2() {
  const shareMessage = () => {
    const text = encodeURIComponent("Ваше сообщение для Telegram");
    const url = encodeURIComponent("https://example.com"); // URL, которым хотите поделиться
    const telegramShareUrl = `https://t.me/share/url?url=${url}&text=${text}`;

    window.open(telegramShareUrl, '_blank');
  };
  return (
    <div className="page2">
      <div className="video-container">
      <img src={friendsImage} className="centered-video" alt='Loading..' />

        </div>


      <div className="welcome-text">Friends</div>
      <div className="bonus-text">Your friends will make you richer</div>
      <div className="friend-section">
        <div className="friend-container">
          <img src="https://cdn-icons-png.flaticon.com/512/4423/4423663.png" alt="icon" className="friend-icon" />
          <div className="friend-text">Simple</div>
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
            <div>+2000</div>
          </div>
        </div>
      </div>
      <div className="centered-content">
        <div className="centered-number">0</div>
        <button className="number-button">Claim</button>
      </div>
      <div className="button-container">
        <button className="invite-button" onClick={shareMessage}>Invite</button>
        <button className="copy-button">
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>
    </div>
  );
}

export default Page2;
