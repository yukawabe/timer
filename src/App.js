import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';

const WorkoutTimer = () => {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);
  const [sets, setSets] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorking, setIsWorking] = useState(true);
  const [time, setTime] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState('free');
  const [isPreparing, setIsPreparing] = useState(false);
  const audioRef = useRef(null);

  const allSettings = {
    free: { workTime: 30, restTime: 15, sets: 8 },
    kickboxing1: { workTime: 180, restTime: 60, sets: 8 },
    kickboxing2: { workTime: 50, restTime: 10, sets: 8 },
    week1: { workTime: 45, restTime: 20, sets: 8 },
    week2: { workTime: 35, restTime: 25, sets: 8 },
    week3: { workTime: 25, restTime: 10, sets: 8 },
  };

  // 音声ファイルを初期化時にロード
  useEffect(() => {
    audioRef.current = new Audio(`${process.env.PUBLIC_URL}/countdown.mp3`);
    audioRef.current.load();
  }, []);

  const resetTimer = useCallback((newWorkTime) => {
    setIsActive(false);
    setIsWorking(true);
    setIsPreparing(false);
    setCurrentSet(1);
    setTime(newWorkTime);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(interval);
      if (isPreparing) {
        setIsPreparing(false);
        setIsWorking(true);
        setTime(workTime);
      } else if (isWorking) {
        if (currentSet < sets) {
          setIsWorking(false);
          setTime(restTime);
        } else {
          setIsActive(false);
        }
      } else {
        setIsWorking(true);
        setCurrentSet((set) => set + 1);
        setTime(workTime);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, time, isWorking, currentSet, sets, workTime, restTime, isPreparing]);

  useEffect(() => {
    if (time === 3 && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed', e));
    }
  }, [time]);

  const startTimer = () => {
    setIsActive(true);
    setIsPreparing(true);
    setCurrentSet(1);
    setTime(5);  // 5秒のカウントダウンから開始
  };

  const changeOption = (newOption) => {
    setSelectedOption(newOption);
    const { workTime: newWorkTime, restTime: newRestTime, sets: newSets } = allSettings[newOption];
    setWorkTime(newWorkTime);
    setRestTime(newRestTime);
    setSets(newSets);
    resetTimer(newWorkTime);
  };

  const getProgress = () => {
    const total = isPreparing ? 5 : (isWorking ? workTime : restTime);
    return ((total - time) / total) * 100;
  };

  const getProgressColor = () => {
    if (isPreparing) return 'text-yellow-500';
    return isWorking ? 'text-blue-500' : 'text-green-500';
  };

  const renderOptionButton = (key, label) => (
    <button
      key={key}
      onClick={() => changeOption(key)}
      className={`mx-1 my-1 px-3 py-1 rounded ${selectedOption === key ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">ワークアウトタイマー</h1>
      <div className="mb-2 flex justify-center">
        {renderOptionButton('free', '体験')}
        {renderOptionButton('kickboxing1', 'キック1')}
        {renderOptionButton('kickboxing2', 'キック2')}
      </div>
      <div className="mb-4 flex justify-center">
        {renderOptionButton('week1', '1周目')}
        {renderOptionButton('week2', '2周目')}
        {renderOptionButton('week3', '3周目')}
      </div>
      <div className="mb-4 text-center">
        <p>ワークアウト: {workTime}秒 / 休憩: {restTime}秒 / セット: {sets}</p>
      </div>
      <div className="relative w-64 h-64 mx-auto mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 stroke-current"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          />
          <circle
            className={`${getProgressColor()} stroke-current`}
            strokeWidth="10"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * getProgress()) / 100}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="50" fontSize="20" textAnchor="middle" dy=".3em" fill="currentColor">
            {time}
          </text>
        </svg>
      </div>
      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">
          {isPreparing ? '準備中' : (isWorking ? 'ワークアウト中' : '休憩中')}
        </p>
        <p>セット: {currentSet} / {sets}</p>
      </div>
      <div className="mb-4 flex justify-center">
        <button
          onClick={startTimer}
          className="mr-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          disabled={isActive}
        >
          スタート
        </button>
        <button
          onClick={() => resetTimer(workTime)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          リセット
        </button>
      </div>
    </div>
  );
};

export default WorkoutTimer;