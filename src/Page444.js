import React, { useState, useEffect, useRef } from 'react';
import loadingEgg from "./chpic.su_-_UtyaDuckFull_042-ezgif.com-gif-maker.gif"
import { useNavigate } from 'react-router-dom';



const Page4 = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const [bet, setBet] = useState(0);
    const [bet2, setBet2] = useState(0);
    const [six, setSix] = useState(0);
    const [won, setWon] = useState(false);
    const [lose, setLose] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState('0:05');
    const [centerValue, setCenterValue] = useState(null);
    const [previousValue, setPreviousValue] = useState(null);
    const [currentValue, setCurrentValue] = useState(null);
    const [currentValueShow, setCurrentValueShow] = useState(1);
    const [rectangles, setRectangles] = useState([]);
    const [value, setValue] = useState(10);
    const [lastY, setLastY] = useState(null);
    const [timer, setTimer] = useState(0);
    const [nextRectangleTime, setNextRectangleTime] = useState(0);
    const [pointB, setPointB] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [b, setB] = useState(false);
    const [s, setS] = useState(false);
    const [f, setF] = useState(false);
    const [bColor, setBColor] = useState(false);
    const [sColor, setSColor] = useState(false);
    const canvasRef = useRef(null);
    const lineCanvasRef = useRef(null);
    const fixedLineCanvasRef = useRef(null);
    const animationTimeoutRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const navigate = useNavigate(); // Хук для навигации


    const fetchBitcoinPrice = async () => {
        try {
            const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
            const data = await response.json();
            const price = parseFloat(data.bpi.USD.rate.replace(',', ''));
            return price;
        } catch (error) {
            console.error('Ошибка при получении цены биткоина:', error);
            return 56000;
        }
    };

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
    const { Telegram } = window;
    if (Telegram.WebApp) {
        Telegram.WebApp.BackButton.show();
        Telegram.WebApp.BackButton.onClick(() => {
        navigate('/page1'); // Переход на Page1 при нажатии на кнопку назад
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
        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const formatDateTime = (date) => {
        const day = date.getDate(); // Получаем день месяца
        const month = date.toLocaleString('en-US', { month: 'short' }); // Получаем короткое название месяца (например, Sep)
        const year = date.getFullYear(); // Получаем год
        const hours = String(date.getHours()).padStart(2, '0'); // Получаем часы с ведущим нулем
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Получаем минуты с ведущим нулем
        const seconds = String(date.getSeconds()).padStart(2, '0'); // Получаем секунды с ведущим нулем
    
        return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    };
    

    const generateValue = () => {
        if (centerValue !== null) {
            const min = centerValue - 700;
            const max = centerValue + 700;
            const newValue = Math.floor(Math.random() * (max - min + 1)) + min;

           

            setCurrentValue(newValue);
        }
    };

    const handleSliderChange = (e) => {
        triggerHapticFeedback()
        setValue(Number(e.target.value));
        
      };
    
    const calculatedAmount = Math.floor((balance * value) / 100);

    const generateRandomMultiplier = () => {
        const rangeSelector = Math.random();

        if (rangeSelector <= 0.4) {
            return Math.random() * (0.1 - 0.01) + 0.01;
        } else if (rangeSelector <= 0.6) {
            return Math.random() * (0.5 - 0.11) + 0.11;
        } else if (rangeSelector <= 0.8) {
            return Math.random() * (0.9 - 0.51) + 0.51;
        } else {
            return Math.random() * (2 - 0.91) + 0.91;
        }
    };

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
        const initialize = async () => {
            const price = await fetchBitcoinPrice();
            setCenterValue(price);
            setPreviousValue(price);
            setCurrentValue(price);
            setCurrentValueShow(price);
        };

        initialize();
    }, []);

    useEffect(() => {
        if (centerValue !== null) {
            generateValue();
        }
    }, [centerValue]);

    const startTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        setTimer(30);
        
        timerIntervalRef.current = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(timerIntervalRef.current);
                    setButtonDisabled(false);
                    setPointB(0);
                    setBColor(false)
                    setSColor(false)
                    setValue(10)
                    clearFixedLine(); // Убираем линию по завершению таймера
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };
    useEffect(() => {
        if (nextRectangleTime) {
            const timer = setInterval(() => {
                const timeRemainingInMs = nextRectangleTime - Date.now();
                const secondsRemaining = Math.max(Math.floor(timeRemainingInMs / 1000), 0);
                const formattedTime = `0:${secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}`;
                setTimeRemaining(formattedTime);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [nextRectangleTime]);

    const drawFixedLine = () => {
        const fixedLineCanvas = fixedLineCanvasRef.current;
        const fixedLineCtx = fixedLineCanvas.getContext('2d');
        const scale = window.devicePixelRatio || 1;
    
        // Устанавливаем размеры холста под устройство
        fixedLineCanvas.width = window.innerWidth * scale;
        fixedLineCanvas.height = 300 * scale;
        fixedLineCtx.scale(scale, scale);
    
        const independentLineY = lastY || 150 - ((previousValue - centerValue) / 1111) * 120;
        const pointBValue = currentValueShow.toFixed(2);
        setPointB(pointBValue);
    
        // Вычисляем ширину текста pointB
        fixedLineCtx.font = '9px Arial';
        const textWidth = fixedLineCtx.measureText(pointBValue).width;
    
        // Линия заканчивается за 5 пикселей до текста pointB
        const lineEndX = fixedLineCanvas.width / scale - textWidth - 10; // 5 пикселей отступ для текста и 5 пикселей до текста
    
        fixedLineCtx.clearRect(0, 0, fixedLineCanvas.width / scale, fixedLineCanvas.height / scale);
    
        fixedLineCtx.strokeStyle = 'yellow';
        fixedLineCtx.lineWidth = 0.5;
        fixedLineCtx.beginPath();
        fixedLineCtx.moveTo(0, independentLineY);
        fixedLineCtx.lineTo(lineEndX, independentLineY);
        fixedLineCtx.stroke();
    
        // Размещаем текст pointB на 5 пикселей справа от линии
        fixedLineCtx.fillStyle = 'white';
        fixedLineCtx.fillText(pointBValue, lineEndX + 5, independentLineY + 3);
    
        setB(false);
        setS(false);
    
        startTimer();
    };
    

    const clearFixedLine = () => {
        const fixedLineCanvas = fixedLineCanvasRef.current;
        const fixedLineCtx = fixedLineCanvas.getContext('2d');
        fixedLineCtx.clearRect(0, 0, fixedLineCanvas.width, fixedLineCanvas.height);
    };

    const handleButtonClickB = () => {
        const calculated = Math.floor((balance * value) / 100);
        if (calculated) {setSix(5)
        setBet(calculated)
        setBet2(calculated)
        setButtonDisabled(true);
        setB(true)
        setF(true)
        setBColor(true)
        triggerHapticFeedback()
        
        const newBalance = Math.floor(balance - calculated)
        window.Telegram.WebApp.CloudStorage.setItem('balance', Math.floor(newBalance).toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
        setBalance(newBalance)}
    };  
    
    const handleButtonClickS = () => {
        const calculated = Math.floor((balance * value) / 100);
        if (calculated) {
        setSix(5)
        setBet(calculated)
        setBet2(calculated)
        setButtonDisabled(true);
        setS(true)
        setF(true)
        setSColor(true)
        triggerHapticFeedback()
        const newBalance = Math.floor(balance - calculated)
        window.Telegram.WebApp.CloudStorage.setItem('balance', Math.floor(newBalance).toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
        setBalance(newBalance)}
    };

    useEffect(() => {
        const startDrawing = () => {
            const drawRectangle = () => {
                if (currentValue !== previousValue && previousValue !== null) {
                    const canvas = canvasRef.current;
                    const lineCanvas = lineCanvasRef.current;
                    const ctx = canvas.getContext('2d');
                    const lineCtx = lineCanvas.getContext('2d');

                    const scale = window.devicePixelRatio || 1;
                    canvas.width = window.innerWidth * scale;
                    canvas.height = 300 * scale;
                    lineCanvas.width = window.innerWidth * scale;
                    lineCanvas.height = 300 * scale;
                    ctx.scale(scale, scale);
                    lineCtx.scale(scale, scale);

                    // Рисуем фон с линиями
                    const drawBackgroundGrid = () => {
                        const width = canvas.width / scale;
                        const height = canvas.height / scale;

                        // Цвет линий и ширина
                        const gridColor = '#333'; // Серый цвет
                        const lineWidth = 1;

                        // Устанавливаем цвет и ширину линий
                        ctx.strokeStyle = gridColor;
                        ctx.lineWidth = lineWidth;

                        // Рисуем 3 горизонтальные линии
                        const horizontalGap = height / 4; // Разделяем на 4 части
                        for (let i = 1; i <= 3; i++) {
                            const y = i * horizontalGap;
                            ctx.beginPath();
                            ctx.moveTo(0, y);
                            ctx.lineTo(width, y);
                            ctx.stroke();
                        }

                        // Рисуем 5 вертикальных линий
                        const verticalGap = width / 5; // Разделяем на 6 частей
                        for (let i = 1; i <= 4; i++) {
                            const x = i * verticalGap;
                            ctx.beginPath();
                            ctx.moveTo(x, 0);
                            ctx.lineTo(x, height);
                            ctx.stroke();
                        }
                    };

                    // Рисуем фон
                    drawBackgroundGrid();

                    const difference = currentValue - previousValue;
                    let step = difference > 0 ? 1 : -1;
                    let progress = 0;

                    const startY = lastY !== null ? lastY : 150 - ((previousValue - centerValue) / 1111) * 120;
                    const targetY = 150 - ((currentValue - centerValue) / 1111) * 120;
                    const rectWidth = 20;

                    if (b || s) {
                        drawFixedLine();
                    }

                    let animationDirection = 1;
                    let hasReachedTarget = false;
                    const startTime = Date.now();
                    const nextRectangleTime = startTime + 5000;

                    setNextRectangleTime(nextRectangleTime);

                    const interval = setInterval(() => {
                        const randomMultiplier = generateRandomMultiplier();
                        progress += step * animationDirection * randomMultiplier;
                        const updatedCurrentValueShow = currentValueShow + progress;
                        const text = updatedCurrentValueShow.toFixed(2);
                        ctx.clearRect(0, 0, canvas.width / scale, canvas.height / scale);
                        lineCtx.clearRect(0, 0, lineCanvas.width / scale, lineCanvas.height / scale);

                        const updatedRectangles = rectangles.map((rect) => ({
                            ...rect,
                            x: rect.x - rectWidth,
                        }));

                        drawBackgroundGrid();

                        updatedRectangles.forEach((rect) => {
                            ctx.fillStyle = rect.color;
                            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
                        });

                        const height = Math.abs(progress);
                        let rectY;

                        if (difference > 0) {
                            rectY = startY - height;
                        } else {
                            rectY = startY;
                        }

                        ctx.fillStyle = difference > 0 ? 'green' : 'red';
                        ctx.fillRect(canvas.width / scale / 2 - 15, rectY, rectWidth, height);

                        let strokeColor = 'lightblue'; // Default color

                        if (bColor && updatedCurrentValueShow >= (f ? currentValueShow : pointB)) {
                            strokeColor = 'green';
                        } else if (sColor && updatedCurrentValueShow <= (f ? currentValueShow : pointB)) {
                            strokeColor = 'green';
                        } else if (bColor && updatedCurrentValueShow < (f ? currentValueShow : pointB)) {
                            strokeColor = 'red';
                        } else if (sColor && updatedCurrentValueShow > (f ? currentValueShow : pointB)) {
                            strokeColor = 'red';
                        }

                        lineCtx.strokeStyle = strokeColor;
                        lineCtx.lineWidth = 0.5;
                        lineCtx.setLineDash([5, 5]);
                        lineCtx.beginPath();
                        
                        const textWidth = lineCtx.measureText(text).width;
                        const lineEndX = canvas.width / scale - textWidth - 10;
                        if (difference > 0) {
                            lineCtx.moveTo(0, rectY);
                            lineCtx.lineTo(lineEndX, rectY);
                        } else {
                            lineCtx.moveTo(0, rectY + height);
                            lineCtx.lineTo(lineEndX, rectY + height);
                        }

                        lineCtx.stroke();

                        
                        const textX = lineEndX + 5;
                        const textY = difference > 0 ? rectY + 3 : rectY + height + 3;
                        
                        lineCtx.font = '9px Arial';
                        lineCtx.fillStyle = strokeColor;
                        lineCtx.fillText(text, textX, textY);

                        if (textX + lineCtx.measureText(text).width > canvas.width / scale) {
                            ctx.clearRect(canvas.width / scale - 60, textY - 10, 60, 15);
                            lineCtx.fillText(text, canvas.width / scale - 60, textY);
                        }

                        if (!hasReachedTarget && Math.abs(progress) >= Math.abs(targetY - startY)) {
                            animationDirection *= -1;
                            hasReachedTarget = true;
                        } else if (hasReachedTarget && Math.abs(progress) <= 2) {
                            animationDirection *= -1;
                            hasReachedTarget = false;
                        }

                        if (Date.now() - startTime >= (loading ? 400 : 5000)) {
                            clearInterval(interval);

                            updatedRectangles.push({
                                x: canvas.width / scale / 2 - 15,
                                y: rectY,
                                width: rectWidth,
                                height: height,
                                color: difference > 0 ? 'green' : 'red',
                            });
                            setRectangles(updatedRectangles);
                            setLastY(difference > 0 ? rectY : rectY + height);
                            setPreviousValue(currentValue);
                            setCurrentValueShow(updatedCurrentValueShow);
                            if (f) {
                                setF(false)
                            }
                            if (six) {
                                setSix(prev => prev - 1)
                                
                            } else {
                                if (bColor && pointB < updatedCurrentValueShow) {
                                    const newBalance = bet * 1.45 + balance
                                    window.Telegram.WebApp.CloudStorage.setItem('balance', Math.floor(newBalance).toString(), (error) => {
                                        if (error) {
                                        console.error('Failed to update balance in cloud storage:', error);
                                        }
                                    });
                                    setBalance(Math.floor(newBalance))
                                    setWon(true);
                                    triggerHapticFeedbackSuccess()

                                    setTimeout(() => {
                                        setBet(0)
                                        setWon(false);
                                    }, 3000);

                                } else if (sColor && pointB > updatedCurrentValueShow) {
                                    const newBalance = bet * 1.45 + balance
                                    window.Telegram.WebApp.CloudStorage.setItem('balance', Math.floor(newBalance).toString(), (error) => {
                                        if (error) {
                                        console.error('Failed to update balance in cloud storage:', error);
                                        }
                                    });
                                    setBalance(Math.floor(newBalance))
                                    
                                    setWon(true);
                                    triggerHapticFeedbackSuccess()

                                    setTimeout(() => {
                                        setBet(0)
                                        setWon(false);
                                    }, 3000);

                                } else if (sColor && pointB < updatedCurrentValueShow) {
                                    setLose(true);
                                    triggerHapticFeedbackError()


                                    setTimeout(() => {
                                        setBet(0)
                                        setLose(false);
                                    }, 3000);
                                
                                } else if (bColor && pointB > updatedCurrentValueShow) {
                                    setLose(true);
                                    triggerHapticFeedbackError()

                                    setTimeout(() => {
                                        setBet(0)
                                        setLose(false);
                                    }, 3000);
                                }
                                
                            }
                            generateValue();
                        }
                    }, 40);

                    animationTimeoutRef.current = interval;

                    return () => clearInterval(interval);
                }
            };

            drawRectangle();
        };

        if (currentValue !== previousValue && previousValue !== null) {
            startDrawing();
        }
    }, [currentValue, previousValue, centerValue, rectangles, lastY]);
    
    useEffect(() => {
        const loadingTimeout = setTimeout(() => setLoading(false), 4000); // Hide loading screen after 4 seconds
        return () => clearTimeout(loadingTimeout);
      }, []);
    
    

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {loading && (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '120%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1a181c', // Полупрозрачный черный фон
                zIndex: 1000, // Высокий z-index для отображения поверх всего
            }}>
                <img src={loadingEgg} style={{height: '80px', width: '80px'}} alt='Loading..' />
            </div>
        )}
             <div className={`balance-display ${'slide-in-right'}`}>
                <img src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" alt="Balance Icon" className="balance-icon" />
                {balance.toLocaleString()}
            </div>
            
            <div style={{ position: "absolute", left: '10px', top: '20px', fontSize: '18px', color: 'white'}}>
            <div >BTC/USDT</div>
            
            </div>
            <div style={{ position: "absolute", left: '11px', top: '40px', fontSize: '12px', color: 'white'}}>
            <div>{formatDateTime(currentDateTime)}</div>
            
            </div>
            <div style={{ position: "absolute", right: '11px', top: '40px', fontSize: '12px', color: 'white'}}>
            <div> 5 sec  x1.45</div>
            
            </div>
            <canvas
                ref={canvasRef}
                style={{ width: window.innerWidth, height: 300,  marginTop: '40px', }}
            ></canvas>
            <canvas
                ref={lineCanvasRef}
                style={{ width: window.innerWidth, height: 300, position: 'absolute', top: 0, pointerEvents: 'none', marginTop: '40px' }}
            ></canvas>
            <canvas
                ref={fixedLineCanvasRef}
                style={{ width: window.innerWidth, height: 300, position: 'absolute', top: 0, pointerEvents: 'none', marginTop: '40px' }}
            ></canvas>
            <div style={{ width: '70%', margin: '0 auto', textAlign: 'center' }}>
            {won || lose ? (
                <div style={{ marginBottom: '10px', fontSize: '40px', fontWeight: 'bold', color: won ? 'green' : 'red'}}>
                    {won && `+${(Math.floor(bet2 * 1.45)).toLocaleString()} `}
                    {lose && `-${(Math.floor(bet2)).toLocaleString()}`}
                    <img 
                        src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" 
                        alt="Coins" 
                        style={{ height: '30px', marginLeft: '10px' }} 
                    />
                </div>
            ) : (
                bet ? (<div style={{ marginBottom: '10px', fontSize: '40px', fontWeight: 'bold', color: 'white', height: '50px' }}>
                      
                    
                </div>) : (
                    <div style={{ marginBottom: '10px', fontSize: '40px', fontWeight: 'bold', color: 'white' }}>
                        {calculatedAmount.toLocaleString()}
                        <img 
                            src="https://kairosrainbow.it/wp-content/uploads/2016/11/coins.png" 
                            alt="Coins" 
                            style={{ height: '30px', marginLeft: '10px' }} 
                        />
                    </div>
                )
            )}

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
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', margin: '40px auto'}}>
                <button 
                    onClick={handleButtonClickB} 
                    disabled={buttonDisabled} 
                    style={{ 
                        width: '50%', 
                        height: '40px', 
                        margin: '10px', 
                        backgroundColor: buttonDisabled ? '#01411C' : '#008000', 
                        color: buttonDisabled ? 'white' : 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        cursor: 'pointer' 
                    }}
                >
                    {timer ? `${timer}s` : b ? `${timeRemaining}` : 'Buy'}
                </button>

                <button 
                    onClick={handleButtonClickS} 
                    disabled={buttonDisabled} 
                    style={{ 
                        width: '50%', 
                        height: '40px', 
                        margin: '10px', 
                        backgroundColor: buttonDisabled ? '#990000' : '#FF0000', 
                        color: buttonDisabled ? 'white' : 'white', 
                        border: 'none', 
                        borderRadius: '5px', 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        cursor: 'pointer' 
                    }}
                >
                    {timer ? `${timer}s` : s ? `${timeRemaining}` : 'Sell'}
                </button>
            </div>

        </div>
    );
};

export default Page4;
