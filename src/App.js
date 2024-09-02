import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';

const WorkoutTimer = () => {
  const [workTime, setWorkTime] = useState(45);
  const [restTime, setRestTime] = useState(20);
  const [sets, setSets] = useState(8);
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorking, setIsWorking] = useState(true);
  const [time, setTime] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const [week, setWeek] = useState(1);
  const audioRef = useRef(null);

  const weekSettings = [
    { workTime: 45, restTime: 20, sets: 8 },
    { workTime: 35, restTime: 25, sets: 8 },
    { workTime: 25, restTime: 10, sets: 8 },
  ];

  // 音声ファイルを初期化時にロード
  useEffect(() => {
    audioRef.current = new Audio('./countdown.mp3');
    audioRef.current.load();
  }, []);

  const resetTimer = useCallback((newWorkTime) => {
    setIsActive(false);
    setIsWorking(true);
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
      if (isWorking) {
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
  }, [isActive, time, isWorking, currentSet, sets, workTime, restTime]);

  useEffect(() => {
    if (time === 3 && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed', e));
    }
  }, [time]);

  const startTimer = () => {
    setIsActive(true);
    setIsWorking(true);
    setCurrentSet(1);
    setTime(workTime);
  };

  const changeWeek = (newWeek) => {
    setWeek(newWeek);
    const { workTime: newWorkTime, restTime: newRestTime, sets: newSets } = weekSettings[newWeek - 1];
    setWorkTime(newWorkTime);
    setRestTime(newRestTime);
    setSets(newSets);
    resetTimer(newWorkTime);
  };

  const getProgress = () => {
    const total = isWorking ? workTime : restTime;
    return ((total - time) / total) * 100;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">ワークアウトタイマー</h1>
      <div className="mb-4 flex justify-center">
        {[1, 2, 3].map((w) => (
          <button
            key={w}
            onClick={() => changeWeek(w)}
            className={`mx-1 px-3 py-1 rounded ${week === w ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {w}週目
          </button>
        ))}
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
            className={`${isWorking ? 'text-blue-500' : 'text-green-500'} stroke-current`}
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
        <p className="text-lg font-semibold">{isWorking ? 'ワークアウト中' : '休憩中'}</p>
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