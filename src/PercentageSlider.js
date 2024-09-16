import React, { useState } from 'react';

const PercentageSlider = ({ balance }) => {
  const [value, setValue] = useState(10);

  const handleSliderChange = (e) => {
    setValue(Number(e.target.value));
  };

  const calculatedAmount = Math.floor((balance * value) / 100);

  return (
    <div style={{ width: '70%', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', fontSize: '40px', fontWeight: 'bold', color: 'white' }}>
         {calculatedAmount.toLocaleString()}
        <img 
          src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" 
          alt="Coins" 
          style={{ height: '30px', marginLeft: '10px' }} 
        />
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        step="5" 
        value={value} 
        onChange={handleSliderChange} 
        style={{
          width: '100%',
          background: `linear-gradient(to right, orange 0%, orange ${value}%, darkgrey ${value}%, darkgrey 100%)`,
          height: '10px',
          borderRadius: '5px',
          outline: 'none',
          appearance: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '12px' }}>
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default PercentageSlider;
