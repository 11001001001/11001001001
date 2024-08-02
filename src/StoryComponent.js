import React, { useState, useEffect } from 'react';
import './StoryComponent.css';
import story1 from './chpic.su_-_UtyaDuckFull_055-ezgif.com-gif-maker.gif';
import story2 from './chpic.su_-_UtyaDuckFull_017-ezgif.com-gif-maker.gif';
import story3 from './chpic.su_-_UtyaDuckFull_078-ezgif.com-gif-maker.gif';

const stories = [
  {
    gif: story1,
    text1: 'Welcome',
    text2: 'TapDuck is a Web3 token that you can earn not only by minting it but also by taking risks. The more risks you take the more you can earn.',
  },
  {
    gif: story2,
    text1: 'Token supply',
    text2: "Web3 games keep the token supply at a level that doesn't exceed its market capitalization. This way some TapDuck users will get a chance to collect more tokens, and you might be one of them.",
  },
  {
    gif: story3,
    text1: "Base",
    text2: "You're at the foundation of something great so don't miss your chance.",
    buttons: true,
  },
];

const StoryComponent = ({ onComplete }) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000); // Duration of the animation
    return () => clearTimeout(timer);
  }, [currentStory]);

  const handleNextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
    }
  };

  const handleTelegramRedirect = () => {
    window.open('https://t.me/tap_duck_official', '_blank');
  };

  const current = stories[currentStory];

  return (
    <div className="story-container" onClick={current.buttons ? null : handleNextStory}>
      <img src={current.gif} alt="story gif" className="story-gif" />
      <div className={`story-text1 ${animate ? `story-text1-animate` : ''}`}>{current.text1}</div>
      <div className={`story-text2 ${animate ? `story-text2-animate` : ''}`}>{current.text2}</div>
      <div className="story-indicator">
        {stories.map((_, index) => (
          <span
            key={index}
            className={`indicator-dot ${index === currentStory ? 'active' : ''}`}
          />
        ))}
      </div>
      {current.buttons && (
        <div className="story-buttons">
          <button onClick={handleTelegramRedirect}>Channel</button>
          <button onClick={onComplete}>Play app</button>
        </div>
      )}
    </div>
  );
};

export default StoryComponent;
