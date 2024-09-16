import React, { useState, useEffect, useRef } from 'react';

const Page4 = () => {
  const [currentValue, setCurrentValue] = useState(0);
  const [targetValue, setTargetValue] = useState(0);
  const [baseValue, setBaseValue] = useState(0);
  const [dataPoints, setDataPoints] = useState([]);
  const [centerValue, setCenterValue] = useState(0);
  const [range, setRange] = useState(120);
  const canvasRef = useRef(null);

  const fetchBitcoinPrice = async () => {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
      const data = await response.json();
      const price = data.bpi.USD.rate_float;
      return Math.round(price);
    } catch (error) {
      console.error('Ошибка при получении цены биткоина:', error);
      return currentValue;
    }
  };

  const getRandomPriceChange = () => {
    let currentSeconds = new Date().getSeconds();
    if (currentSeconds === 0) {
      currentSeconds = 10;
    } else if (currentSeconds < 10) {
      currentSeconds *= 7;
    }
    return currentSeconds % 2 === 0 ? currentSeconds : -currentSeconds;
  };

  const updateTargetValue = async () => {
    const currentPrice = await fetchBitcoinPrice();
    const priceChange = getRandomPriceChange();
    setTargetValue(currentPrice + priceChange);
  };

  useEffect(() => {
    const updatePrice = async () => {
      const initialPrice = await fetchBitcoinPrice();
      setCurrentValue(initialPrice);
      setBaseValue(initialPrice);
      setCenterValue(initialPrice);
      setTargetValue(initialPrice);
    };

    updatePrice();
  }, []);

  useEffect(() => {
    const priceDifference = Math.abs(targetValue - currentValue);
    let step = 0.05;

    if (priceDifference < 1) {
      step = priceDifference / 2;
    }

    let currentSeconds = new Date().getSeconds();
    if (currentSeconds === 0) {
      currentSeconds = 10;
    } else if (currentSeconds < 10) {
      currentSeconds *= 7;
    }

    const intervalDuration = priceDifference > 0 ? currentSeconds : 40;

    const interval = setInterval(() => {
      setCurrentValue(prevValue => {
        if (prevValue < targetValue) {
          return Math.min(prevValue + step, targetValue);
        } else if (prevValue > targetValue) {
          return Math.max(prevValue - step, targetValue);
        } else {
          setDataPoints(prev => [...prev, prevValue]);
          updateTargetValue();
          return prevValue;
        }
      });
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [currentValue, targetValue]);

  useEffect(() => {
    if (currentValue < centerValue - range / 2 || currentValue > centerValue + range / 2) {
      setCenterValue(currentValue);
    }
  }, [currentValue, centerValue, range]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const scale = window.devicePixelRatio || 1;
    canvas.width = 500 * scale;
    canvas.height = 300 * scale;
    ctx.scale(scale, scale);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (dataPoints.length > 1) {
      dataPoints.forEach((value, index) => {
        const x = (canvas.width / scale / 2) + index * 5 - dataPoints.length * 5;
        const y = canvas.height / scale - ((value - (centerValue - range / 2)) / range) * canvas.height / scale;
        const prevValue = dataPoints[index - 1] || value;

        ctx.fillStyle = value > prevValue ? 'green' : 'red';
        ctx.fillRect(x, y, 5, canvas.height / scale - y);
      });

      const fixedY = canvas.height / scale - ((currentValue - (centerValue - range / 2)) / range) * canvas.height / scale;
      ctx.strokeStyle = 'lightblue';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, fixedY);
      ctx.lineTo(canvas.width / scale, fixedY);
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillStyle = 'lightblue';
      ctx.fillText(`${currentValue.toFixed(2)} BTC`, canvas.width / scale - 150, fixedY - 10);
    }
  }, [dataPoints, centerValue, range, currentValue]);

  const handleFixValue = () => {
    setCenterValue(currentValue);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{ width: 500, height: 300, border: '1px solid black', marginBottom: '20px' }}
      ></canvas>
      <button
        onClick={handleFixValue}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}>
        Зафиксировать текущее значение
      </button>
    </div>
  );
};

export default Page4;
