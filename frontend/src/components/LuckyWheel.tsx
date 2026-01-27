'use client';

import { useState, useRef, useEffect } from 'react';

interface Prize {
  id: number;
  text: string;
  color: string;
  value: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  size: number;
  life: number;
}

const prizes: Prize[] = [
  { id: 1, text: '🧧 50K', color: '#FF6B6B', value: '50,000đ' },
  { id: 2, text: '🎊 10K', color: '#4ECDC4', value: '10,000đ' },
  { id: 3, text: '🧧 100K', color: '#FFE66D', value: '100,000đ' },
  { id: 4, text: '💫 20K', color: '#95E1D3', value: '20,000đ' },
  { id: 5, text: '🧧 200K', color: '#F38181', value: '200,000đ' },
  { id: 6, text: '🎁 5K', color: '#AA96DA', value: '5,000đ' },
  { id: 7, text: '🧧 500K', color: '#FCBAD3', value: '500,000đ' },
  { id: 8, text: '⭐ 30K', color: '#A8D8EA', value: '30,000đ' },
];

const fireworkColors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#FF85A2', '#FFA502', '#7BED9F', '#70A1FF', '#ECCC68'];

function Fireworks({ show }: { show: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!show || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createFirework = (x: number, y: number) => {
      const particleCount = 80;
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          id: Date.now() + i,
          x,
          y,
          color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
          angle: (Math.PI * 2 * i) / particleCount + Math.random() * 0.5,
          speed: 2 + Math.random() * 4,
          size: 2 + Math.random() * 3,
          life: 1,
        });
      }
    };

    // Tạo nhiều pháo hoa
    const launchFireworks = () => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createFirework(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.5
          );
        }, i * 300);
      }
    };

    launchFireworks();
    const interval = setInterval(launchFireworks, 1500);

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      particlesRef.current.forEach((particle) => {
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed + 0.5; // gravity
        particle.life -= 0.015;
        particle.speed *= 0.98;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0, particle.size * particle.life), 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
    };
  }, [show]);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ background: 'transparent' }}
    />
  );
}

function Confetti({ show }: { show: boolean }) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string; size: number }>>([]);

  useEffect(() => {
    if (show) {
      const newConfetti = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
        size: 8 + Math.random() * 8,
      }));
      setConfetti(newConfetti);
    } else {
      setConfetti([]);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute animate-confetti"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function LuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Prize | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setShowModal(false);
    setShowFireworks(false);

    const spins = 10 + Math.random() * 3;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + spins * 360 + randomAngle;

    setRotation(totalRotation);
    
    setTimeout(() => {
      const finalAngle = totalRotation % 360;
      
      const segmentAngle = 360 / prizes.length;
      const adjustedAngle = (360 - finalAngle + 270) % 360;
      const prizeIndex = Math.floor(adjustedAngle / segmentAngle) % prizes.length;
      
      setResult(prizes[prizeIndex]);
      setShowModal(true);
      setShowFireworks(true);
      setIsSpinning(false);
    }, 5000);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowFireworks(false);
  };

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="flex flex-col items-center">
      {/* Fireworks */}
      <Fireworks show={showFireworks} />
      <Confetti show={showFireworks} />

      {/* Vòng quay */}
      <div className="relative">
        {/* Mũi tên chỉ */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-600 drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="relative w-80 h-80 rounded-full shadow-2xl border-8 border-yellow-500"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {prizes.map((prize, index) => {
              const startAngle = index * segmentAngle;
              const endAngle = startAngle + segmentAngle;
              const startRad = (startAngle - 90) * (Math.PI / 180);
              const endRad = (endAngle - 90) * (Math.PI / 180);

              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);

              const largeArc = segmentAngle > 180 ? 1 : 0;

              const pathD = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

              const midAngle = (startAngle + segmentAngle / 2 - 90) * (Math.PI / 180);
              const textX = 50 + 32 * Math.cos(midAngle);
              const textY = 50 + 32 * Math.sin(midAngle);
              const textRotation = startAngle + segmentAngle / 2;

              return (
                <g key={prize.id}>
                  <path d={pathD} fill={prize.color} stroke="#fff" strokeWidth="0.5" />
                  <text
                    x={textX}
                    y={textY}
                    fill="#333"
                    fontSize="6"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                  >
                    {prize.text}
                  </text>
                </g>
              );
            })}
            <circle cx="50" cy="50" r="8" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            <text x="50" y="50" fill="#C41E3A" fontSize="4" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
              LÌ XÌ
            </text>
          </svg>
        </div>
      </div>

      {/* Nút quay */}
      <button
        onClick={spinWheel}
        disabled={isSpinning}
        className={`mt-8 px-12 py-2 text-2xl font-bold rounded-full shadow-lg transform transition-all ${
          isSpinning
            ? 'bg-orange-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 hover:scale-105 active:scale-95'
        } text-white`}
      >
        {isSpinning ? '🎡 Đang quay...' : '🧧 QUAY NGAY'}
      </button>

      {/* Modal kết quả */}
      {showModal && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center transform animate-bounce-in relative overflow-hidden">
            {/* Sparkles decoration */}
            <div className="absolute top-2 left-2 text-2xl animate-ping">✨</div>
            <div className="absolute top-2 right-2 text-2xl animate-ping" style={{ animationDelay: '0.2s' }}>✨</div>
            <div className="absolute bottom-2 left-2 text-2xl animate-ping" style={{ animationDelay: '0.4s' }}>✨</div>
            <div className="absolute bottom-2 right-2 text-2xl animate-ping" style={{ animationDelay: '0.6s' }}>✨</div>

            <div className="text-6xl mb-4 animate-bounce">🧧</div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">🎉 Chúc Mừng! 🎉</h2>
            <p className="text-gray-600 mb-4">Bạn nhận được lì xì</p>
            <div className="text-5xl font-bold text-yellow-600 mb-4 animate-pulse">{result.value}</div>
            <div className="flex justify-center gap-2 text-2xl mb-4">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎆</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🎇</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎆</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🎇</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎆</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">Chúc bạn năm mới An Khang Thịnh Vượng!</div>
            <button
              onClick={closeModal}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🧧 Nhận Lì Xì
            </button>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
