import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type GameType = 'home' | 'animals' | 'shapes' | 'numbers' | 'phone' | 'artist' | 'bubbles';

interface Animal {
  name: string;
  emoji: string;
  sound: string;
}

interface Shape {
  name: string;
  emoji: string;
  color: string;
  colorName: string;
}

const animals: Animal[] = [
  { name: 'Корова', emoji: '🐄', sound: 'Муу!' },
  { name: 'Собака', emoji: '🐕', sound: 'Гав-гав!' },
  { name: 'Кот', emoji: '🐱', sound: 'Мяу!' },
  { name: 'Утка', emoji: '🦆', sound: 'Кря-кря!' },
  { name: 'Лев', emoji: '🦁', sound: 'Ррр!' },
  { name: 'Овца', emoji: '🐑', sound: 'Бее!' }
];

const shapes: Shape[] = [
  { name: 'Круг', emoji: '🔴', color: 'bg-coral', colorName: 'Красный' },
  { name: 'Квадрат', emoji: '🟦', color: 'bg-skyblue', colorName: 'Синий' },
  { name: 'Треугольник', emoji: '🔺', color: 'bg-childGreen', colorName: 'Зелёный' },
  { name: 'Звезда', emoji: '⭐', color: 'bg-sunny', colorName: 'Жёлтый' },
  { name: 'Сердце', emoji: '💜', color: 'bg-lavender', colorName: 'Фиолетовый' },
  { name: 'Ромб', emoji: '🔶', color: 'bg-childOrange', colorName: 'Оранжевый' }
];

const numbers = [
  { num: 1, emoji: '1️⃣', name: 'Один' },
  { num: 2, emoji: '2️⃣', name: 'Два' },
  { num: 3, emoji: '3️⃣', name: 'Три' },
  { num: 4, emoji: '4️⃣', name: 'Четыре' },
  { num: 5, emoji: '5️⃣', name: 'Пять' },
  { num: 6, emoji: '6️⃣', name: 'Шесть' },
  { num: 7, emoji: '7️⃣', name: 'Семь' },
  { num: 8, emoji: '8️⃣', name: 'Восемь' },
  { num: 9, emoji: '9️⃣', name: 'Девять' }
];

function Index() {
  const [currentGame, setCurrentGame] = useState<GameType>('home');
  const [shapeClicks, setShapeClicks] = useState<{[key: number]: number}>({});
  const [showAnimalCall, setShowAnimalCall] = useState(false);
  const [callingAnimal, setCallingAnimal] = useState<Animal | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Artist game state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [isErasing, setIsErasing] = useState(false);

  // Bubbles game state
  interface Bubble {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
  }
  
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);

  const playClickSound = () => {
    playSound(440, 100, 'sine');
  };

  const playBackSound = () => {
    playSound(330, 150, 'sine');
    setTimeout(() => playSound(220, 100, 'sine'), 100);
  };

  const playRingTone = () => {
    playSound(800, 300, 'sine');
    setTimeout(() => playSound(600, 300, 'sine'), 400);
    setTimeout(() => playSound(800, 300, 'sine'), 800);
    setTimeout(() => playSound(600, 300, 'sine'), 1200);
  };

  const makeCall = () => {
    playRingTone();
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    setCallingAnimal(randomAnimal);
    setTimeout(() => {
      setShowAnimalCall(true);
      playAnimalSound(randomAnimal.name);
    }, 1500);
  };

  const hangUp = () => {
    playSound(200, 100, 'square');
    setShowAnimalCall(false);
    setCallingAnimal(null);
    setPhoneNumber('');
  };

  const addDigit = (digit: string | number) => {
    playSound(400 + parseInt(digit.toString()) * 50, 100, 'square');
    setPhoneNumber(prev => prev + digit);
  };

  const playSound = (frequency: number, duration: number = 200, type: 'sine' | 'square' | 'sawtooth' = 'sine') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playAnimalSound = (animal: string) => {
    switch (animal) {
      case 'Корова':
        playSound(200, 500, 'sawtooth');
        setTimeout(() => playSound(150, 300, 'sawtooth'), 200);
        break;
      case 'Собака':
        playSound(300, 100, 'square');
        setTimeout(() => playSound(250, 100, 'square'), 150);
        break;
      case 'Кот':
        playSound(400, 200, 'sine');
        setTimeout(() => playSound(450, 150, 'sine'), 100);
        break;
      case 'Утка':
        playSound(350, 150, 'square');
        setTimeout(() => playSound(300, 150, 'square'), 200);
        setTimeout(() => playSound(350, 150, 'square'), 400);
        break;
      case 'Лев':
        playSound(150, 800, 'sawtooth');
        break;
      case 'Овца':
        playSound(250, 400, 'sine');
        setTimeout(() => playSound(300, 200, 'sine'), 300);
        break;
    }
  };

  const playNumberSound = (number: number) => {
    const baseFreq = 220;
    const freq = baseFreq + (number * 50);
    playSound(freq, 300, 'sine');
    setTimeout(() => playSound(freq * 1.25, 200, 'sine'), 150);
  };

  const playColorSound = (color: string) => {
    const colorFreqs: {[key: string]: number} = {
      'Красный': 261.63,
      'Синий': 293.66,
      'Зелёный': 329.63,
      'Жёлтый': 349.23,
      'Фиолетовый': 392.00,
      'Оранжевый': 440.00
    };
    const freq = colorFreqs[color] || 300;
    playSound(freq, 400, 'sine');
  };

  const playShapeSound = (shape: string) => {
    switch (shape) {
      case 'Круг':
        playSound(400, 300, 'sine');
        break;
      case 'Квадрат':
        playSound(300, 200, 'square');
        setTimeout(() => playSound(300, 200, 'square'), 250);
        break;
      case 'Треугольник':
        playSound(350, 150, 'sine');
        setTimeout(() => playSound(400, 150, 'sine'), 200);
        setTimeout(() => playSound(450, 150, 'sine'), 400);
        break;
      case 'Звезда':
        for (let i = 0; i < 5; i++) {
          setTimeout(() => playSound(500 + i * 50, 100, 'sine'), i * 100);
        }
        break;
      case 'Сердце':
        playSound(450, 200, 'sine');
        setTimeout(() => playSound(550, 200, 'sine'), 100);
        break;
      case 'Ромб':
        playSound(380, 150, 'sine');
        setTimeout(() => playSound(420, 150, 'sine'), 200);
        setTimeout(() => playSound(380, 150, 'sine'), 400);
        break;
    }
  };

  const handleShapeClick = (index: number, shape: Shape) => {
    const clickCount = shapeClicks[index] || 0;
    const newClickCount = clickCount + 1;
    
    setShapeClicks(prev => ({ ...prev, [index]: newClickCount }));
    
    if (newClickCount % 2 === 1) {
      playColorSound(shape.colorName);
    } else {
      playShapeSound(shape.name);
    }
  };

  // Artist game functions
  const colors = [
    '#FFEB3B', '#FF9800', '#F44336', // Yellow, Orange, Red
    '#FFB6C1', '#FF69B4', '#E91E63', // Light Pink, Hot Pink, Pink
    '#9C27B0', '#673AB7', '#3F51B5', // Purple, Deep Purple, Indigo
    '#B39DDB', '#00BCD4', '#2196F3', // Light Purple, Cyan, Blue
    '#4CAF50', '#8BC34A', '#2E7D32', // Green, Light Green, Dark Green
    '#9E9E9E', '#795548', '#000000'  // Gray, Brown, Black
  ];

  const brushSizes = [
    { size: 3, name: 'Тонкая кисть' },
    { size: 8, name: 'Средняя кисть' },
    { size: 15, name: 'Толстая кисть' }
  ];

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef) return;
    
    setIsDrawing(true);
    
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Начинаем новый путь и устанавливаем начальную точку
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (!canvasRef) return;
    
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;
    
    // Завершаем текущий путь
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Учитываем масштабирование canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (isErasing) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2; // Ластик чуть больше
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    playSound(300, 100, 'square');
  };

  const saveDrawing = () => {
    if (!canvasRef) return;
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvasRef.toDataURL();
    link.click();
    playSound(500, 200, 'sine');
  };

  // Bubbles game functions
  const bubbleColors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB347'];
  
  const popBubble = (bubbleId: number) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
    setScore(prev => prev + 1);
    playSound(800, 100, 'sine');
    setTimeout(() => playSound(1000, 80, 'sine'), 80);
  };

  useEffect(() => {
    if (currentGame !== 'bubbles') {
      setBubbles([]);
      setScore(0);
      return;
    }
    
    console.log('Bubbles game started!');
    let nextId = 0;
    
    const createInterval = setInterval(() => {
      const size = Math.random() * 50 + 40;
      const newBubble: Bubble = {
        id: nextId++,
        x: Math.random() * (window.innerWidth - size) + size/2,
        y: window.innerHeight - size,
        size: size,
        color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)]
      };
      console.log('Creating bubble:', newBubble);
      setBubbles(prev => {
        console.log('Current bubbles:', prev.length, 'Adding bubble, new total:', prev.length + 1);
        return [...prev, newBubble];
      });
    }, 800);

    const moveInterval = setInterval(() => {
      setBubbles(prev => {
        const updated = prev
          .map(bubble => ({
            ...bubble,
            y: bubble.y - 3
          }))
          .filter(bubble => bubble.y > -100);
        if (prev.length !== updated.length) {
          console.log('Bubbles removed:', prev.length - updated.length);
        }
        return updated;
      });
    }, 30);

    return () => {
      console.log('Bubbles game stopped');
      clearInterval(createInterval);
      clearInterval(moveInterval);
    };
  }, [currentGame]);

  const GameCard = ({ title, emoji, description, gameType, bgColor }: {
    title: string;
    emoji: string;
    description: string;
    gameType: GameType;
    bgColor: string;
  }) => (
    <Card 
      className={`${bgColor} border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
      onClick={() => {
        playClickSound();
        setCurrentGame(gameType);
      }}
    >
      <CardContent className="p-8 text-center">
        <div className="text-6xl mb-4 animate-bounce-soft">{emoji}</div>
        <h3 className="text-2xl font-bold text-white mb-2 font-comic">{title}</h3>
        <p className="text-white/90 font-comic">{description}</p>
      </CardContent>
    </Card>
  );

  if (currentGame === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sunny via-mint to-lavender p-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-comic drop-shadow-lg">
              🎮 Детские Игры 🎮
            </h1>
            <p className="text-xl text-white/90 font-comic">Выбери игру и начинай учиться!</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <GameCard
              title="Говорящие Животные"
              emoji="🐄"
              description="Нажми на животное и послушай звук!"
              gameType="animals"
              bgColor="bg-coral"
            />
            <GameCard
              title="Фигуры и Цвета"
              emoji="🔴"
              description="Изучай цвета и формы играя!"
              gameType="shapes"
              bgColor="bg-childGreen"
            />
            <GameCard
              title="Весёлые Цифры"
              emoji="1️⃣"
              description="Считай от одного до девяти!"
              gameType="numbers"
              bgColor="bg-childPurple"
            />
            <GameCard
              title="Говорящий Телефон"
              emoji="📞"
              description="Позвони животным и послушай их голоса!"
              gameType="phone"
              bgColor="bg-skyblue"
            />
            <GameCard
              title="Художник"
              emoji="🎨"
              description="Рисуй красивые картинки разными цветами!"
              gameType="artist"
              bgColor="bg-childOrange"
            />
            <GameCard
              title="Пузыри"
              emoji="🫧"
              description="Лопай воздушные пузыри пальчиком!"
              gameType="bubbles"
              bgColor="bg-skyblue"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sunny via-mint to-lavender p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => {
              playBackSound();
              setCurrentGame('home');
            }}
            className="bg-white/20 hover:bg-white/30 text-white border-none text-lg font-comic"
          >
            <Icon name="Home" size={20} />
            Домой
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-comic drop-shadow-lg">
            {currentGame === 'animals' && '🐄 Говорящие Животные'}
            {currentGame === 'shapes' && '🔴 Фигуры и Цвета'}
            {currentGame === 'numbers' && '1️⃣ Весёлые Цифры'}
            {currentGame === 'phone' && '📞 Говорящий Телефон'}
          </h1>
          <div className="w-20"></div>
        </header>

        {currentGame === 'animals' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {animals.map((animal, index) => (
              <Card 
                key={index}
                className="bg-white/90 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => playAnimalSound(animal.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-3 animate-wiggle hover:animate-bounce">{animal.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 font-comic">{animal.name}</h3>
                  <p className="text-gray-600 text-sm font-comic mt-1">{animal.sound}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentGame === 'shapes' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {shapes.map((shape, index) => (
              <Card 
                key={index}
                className="bg-white/90 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleShapeClick(index, shape)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-3 animate-wiggle hover:animate-bounce">{shape.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 font-comic">{shape.name}</h3>
                  <p className="text-gray-600 text-sm font-comic mt-1">{shape.colorName}</p>
                  <div className="text-xs text-gray-500 mt-2 font-comic">
                    Клики: {shapeClicks[index] || 0}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentGame === 'numbers' && (
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            {numbers.map((number, index) => (
              <Card 
                key={index}
                className="bg-white/90 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => playNumberSound(number.num)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-3 animate-wiggle hover:animate-bounce">{number.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 font-comic">{number.num}</h3>
                  <p className="text-gray-600 text-sm font-comic mt-1">{number.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentGame === 'phone' && (
          <div className="flex flex-col items-center">
            <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-sm w-full">
              {/* Phone Screen */}
              <div className="bg-gray-700 rounded-2xl p-4 mb-4">
                <div className="bg-gray-800 rounded-lg p-4 min-h-[50px]">
                  <div className="text-white text-xl font-mono text-center">
                    {phoneNumber || "Набери номер..."}
                  </div>
                </div>
              </div>
              
              {/* Phone Keypad */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map((key, index) => (
                  <Button
                    key={index}
                    className="aspect-square bg-gray-600 hover:bg-gray-500 text-white text-2xl font-bold rounded-xl h-16 w-16"
                    onClick={() => addDigit(key)}
                  >
                    {key}
                  </Button>
                ))}
              </div>
              
              {/* Call Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={makeCall}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 text-2xl"
                >
                  📞
                </Button>
                <Button
                  onClick={hangUp}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16 text-2xl"
                >
                  📵
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Artist Game */}
        {currentGame === 'artist' && (
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            {/* Left Toolbar - Brush Sizes */}
            <div className="lg:w-20 flex lg:flex-col gap-2 order-2 lg:order-1">
              {brushSizes.map((brush, index) => (
                <Button
                  key={index}
                  className={`w-16 h-16 bg-white/90 hover:bg-white border-2 shadow-lg rounded-xl flex items-center justify-center ${
                    brushSize === brush.size 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300'
                  }`}
                  onClick={() => {
                    setBrushSize(brush.size);
                    playClickSound();
                  }}
                >
                  <div 
                    className="bg-gray-800 rounded-full"
                    style={{ 
                      width: `${Math.min(brush.size * 2, 32)}px`, 
                      height: `${Math.min(brush.size * 2, 32)}px` 
                    }}
                  />
                </Button>
              ))}
              
              {/* Eraser button */}
              <Button
                onClick={() => {
                  setIsErasing(!isErasing);
                  playClickSound();
                }}
                className={`w-16 h-16 border-2 shadow-lg text-2xl rounded-xl ${
                  isErasing 
                    ? 'bg-pink-200 hover:bg-pink-300 border-pink-400' 
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                }`}
              >
                🧽
              </Button>
              
              {/* Clear button */}
              <Button
                onClick={clearCanvas}
                className="w-16 h-16 bg-red-100 hover:bg-red-200 border-2 border-red-300 shadow-lg text-2xl rounded-xl"
              >
                ❌
              </Button>
              
              {/* Save button */}
              <Button
                onClick={saveDrawing}
                className="w-16 h-16 bg-green-100 hover:bg-green-200 border-2 border-green-300 shadow-lg text-2xl rounded-xl"
              >
                ✅
              </Button>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 order-1 lg:order-2">
              <div className="bg-white rounded-2xl border-4 border-green-400 shadow-2xl p-4 h-[300px] sm:h-[400px] lg:h-[500px]">
                <canvas
                  ref={setCanvasRef}
                  width={600}
                  height={400}
                  className="w-full h-full bg-white rounded-xl cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>

            {/* Right Color Palette */}
            <div className="lg:w-20 order-3">
              <div className="grid grid-cols-6 lg:grid-cols-1 gap-2">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full border-4 shadow-lg transition-all duration-200 ${
                      currentColor === color 
                        ? 'border-white scale-110 shadow-xl' 
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setCurrentColor(color);
                      playColorSound('Цвет');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bubbles Game */}
        {currentGame === 'bubbles' && (
          <div className="relative h-full bg-gradient-to-b from-blue-200 to-blue-400">
            {/* Score */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/90 rounded-2xl px-6 py-3 shadow-lg">
                <p className="text-2xl font-bold text-blue-600 font-comic">Счёт: {score}</p>
              </div>
            </div>

            {/* Bubbles */}
            {bubbles.map(bubble => (
              <div
                key={bubble.id}
                className="absolute transition-all duration-100 cursor-pointer hover:scale-110"
                style={{
                  left: `${bubble.x}px`,
                  top: `${bubble.y}px`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                }}
                onClick={() => popBubble(bubble.id)}
              >
                <div
                  className="w-full h-full rounded-full shadow-lg border-2 border-white/30 animate-pulse"
                  style={{
                    backgroundColor: bubble.color,
                    background: `radial-gradient(circle at 30% 30%, ${bubble.color}dd, ${bubble.color}88, ${bubble.color}44)`,
                  }}
                />
              </div>
            ))}

            {/* Instructions */}
            {bubbles.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-3xl p-8 text-center shadow-2xl max-w-sm">
                  <div className="text-6xl mb-4">🫧</div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-2 font-comic">Лопай пузыри!</h2>
                  <p className="text-lg text-gray-600 font-comic">Нажимай на цветные пузыри, когда они появятся</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Animal Call Modal */}
        {showAnimalCall && callingAnimal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="text-8xl mb-4 animate-wiggle">{callingAnimal.emoji}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 font-comic">Звонит {callingAnimal.name}!</h2>
              <p className="text-xl text-gray-600 mb-6 font-comic">{callingAnimal.sound}</p>
              <Button
                onClick={hangUp}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-20 h-20 text-3xl"
              >
                📵
              </Button>
              <p className="text-sm text-gray-500 mt-3 font-comic">Нажми красную кнопку чтобы завершить звонок</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;