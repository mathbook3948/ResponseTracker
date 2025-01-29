'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [buttonText, setButtonText] = useState("티켓팅 클릭");
  const [responseTime, setResponseTime] = useState(null);
  const [serverTime, setServerTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) {
      alert("URL을 입력해주세요");
      return;
    }
    calculateDelay();
  };

  const calculateDelay = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/calculateDelay?url=${encodeURIComponent(url)}`, { method: 'GET' });
      if (!res.ok) throw new Error('서버 요청 실패');

      const data = await res.json();
      const { delay, currentTime } = data;

      setResponseTime(delay);
      setServerTime(new Date(currentTime));
      startCountdown(delay);
    } catch (error) {
      console.error('서버 요청 오류:', error);
      alert('서버 연결 실패! URL을 다시 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!serverTime) return;

    const interval = setInterval(() => {
      setServerTime((prevTime) => (prevTime ? new Date(prevTime.getTime() + 1000) : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [serverTime]);

  function startCountdown(delay) {
    let timeLeft = 5 - delay;
    setIsButtonVisible(true);

    const countdownInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        setButtonText("지금 클릭하세요!");
        setTimeout(() => clickTicketButton(), 1000);
      } else {
        setTimeRemaining(timeLeft.toFixed(1));
        timeLeft -= 0.1;
      }
    }, 100);
  }

  async function clickTicketButton() {
    alert("티켓팅 완료!");
    try {
      const res = await fetch(`${url}/api/ticket`, { method: 'POST' });
      if (res.ok) alert('티켓팅 성공!');
    } catch (error) {
      alert('티켓팅 요청에 실패했습니다.');
    }
  }

  return (
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 min-h-screen flex flex-col justify-center items-center p-6">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-indigo-700">서버 속도 및 시간 계산</h1>
            <p className="text-gray-600">원하는 URL을 입력하여 서버 응답 시간을 확인하고 티켓팅을 시작하세요!</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="http://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm shadow-md hover:bg-indigo-700 transition duration-300 focus:outline-none"
            >
              {buttonText}
            </button>
          </form>

          {isLoading ? (
              <div className="text-center text-sm text-gray-600 mt-4">서버 연결 중...</div>
          ) : url && (
              <div className="mt-4 text-center text-sm">
                <div className="text-gray-700">
                  서버 통신 속도: <span className="text-indigo-500">{responseTime ? `${responseTime.toFixed(2)}초` : '계산 중...'}</span>
                </div>
                <div className="text-gray-700 mt-2">
                  서버 시간: <span className="text-indigo-500">{serverTime ? serverTime.toLocaleString() : '불러오는 중...'}</span>
                </div>
              </div>
          )}

          <div className="text-center mt-4">
            <div className="text-lg font-semibold text-gray-700">
              남은 시간: <span className="text-indigo-500">{timeRemaining}</span>초
            </div>
          </div>

          <footer className="text-center text-xs text-gray-500 mt-6">
            <p>&copy; 2025 티켓팅 앱 | 모든 권리 보유</p>
          </footer>
        </div>
      </div>
  );
}
