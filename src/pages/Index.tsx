import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type GameType = 'home' | 'animals' | 'shapes' | 'numbers';

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

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleShapeClick = (index: number, shape: Shape) => {
    const clickCount = shapeClicks[index] || 0;
    const newClickCount = clickCount + 1;
    
    setShapeClicks(prev => ({ ...prev, [index]: newClickCount }));
    
    if (newClickCount % 2 === 1) {
      speak(shape.colorName);
    } else {
      speak(shape.name);
    }
  };

  const GameCard = ({ title, emoji, description, gameType, bgColor }: {
    title: string;
    emoji: string;
    description: string;
    gameType: GameType;
    bgColor: string;
  }) => (
    <Card 
      className={`${bgColor} border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
      onClick={() => setCurrentGame(gameType)}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            onClick={() => setCurrentGame('home')}
            className="bg-white/20 hover:bg-white/30 text-white border-none text-lg font-comic"
          >
            <Icon name="Home" size={20} />
            Домой
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-white font-comic drop-shadow-lg">
            {currentGame === 'animals' && '🐄 Говорящие Животные'}
            {currentGame === 'shapes' && '🔴 Фигуры и Цвета'}
            {currentGame === 'numbers' && '1️⃣ Весёлые Цифры'}
          </h1>
          <div className="w-20"></div>
        </header>

        {currentGame === 'animals' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {animals.map((animal, index) => (
              <Card 
                key={index}
                className="bg-white/90 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => speak(animal.sound)}
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
                onClick={() => speak(number.name)}
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
      </div>
    </div>
  );
}

export default Index;