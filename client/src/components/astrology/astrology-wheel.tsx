import React from 'react';

const zodiacSigns = [
  { sign: 'Aries', symbol: '♈', startAngle: 0 },
  { sign: 'Taurus', symbol: '♉', startAngle: 30 },
  { sign: 'Gemini', symbol: '♊', startAngle: 60 },
  { sign: 'Cancer', symbol: '♋', startAngle: 90 },
  { sign: 'Leo', symbol: '♌', startAngle: 120 },
  { sign: 'Virgo', symbol: '♍', startAngle: 150 },
  { sign: 'Libra', symbol: '♎', startAngle: 180 },
  { sign: 'Scorpio', symbol: '♏', startAngle: 210 },
  { sign: 'Sagittarius', symbol: '♐', startAngle: 240 },
  { sign: 'Capricorn', symbol: '♑', startAngle: 270 },
  { sign: 'Aquarius', symbol: '♒', startAngle: 300 },
  { sign: 'Pisces', symbol: '♓', startAngle: 330 }
];

const planetSymbols: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
  ascendant: '↑'
};

interface AstrologyWheelProps {
  positions: Record<string, { sign: string; degree: number }>;
  size?: number;
  interactive?: boolean;
}

export const AstrologyWheel: React.FC<AstrologyWheelProps> = ({ 
  positions = {}, 
  size = 500, 
  interactive = true 
}) => {
  const center = size / 2;
  const wheelRadius = (size / 2) * 0.9;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="wheelGradient">
          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.1)" />
          <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
        </radialGradient>
      </defs>

      <circle
        cx={center}
        cy={center}
        r={wheelRadius}
        fill="url(#wheelGradient)"
        stroke="rgba(147, 51, 234, 0.3)"
        strokeWidth="2"
      />

      {zodiacSigns.map((zodiac) => {
        const startAngle = (zodiac.startAngle * Math.PI) / 180;
        const endAngle = ((zodiac.startAngle + 30) * Math.PI) / 180;
        const x1 = center + wheelRadius * Math.cos(startAngle);
        const y1 = center + wheelRadius * Math.sin(startAngle);
        const x2 = center + wheelRadius * Math.cos(endAngle);
        const y2 = center + wheelRadius * Math.sin(endAngle);

        return (
          <g key={zodiac.sign}>
            <path
              d={`M ${center} ${center} L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 0 1 ${x2} ${y2} Z`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-30"
            />
            <text
              x={center + (wheelRadius * 0.85) * Math.cos((zodiac.startAngle + 15) * Math.PI / 180)}
              y={center + (wheelRadius * 0.85) * Math.sin((zodiac.startAngle + 15) * Math.PI / 180)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              className="fill-current"
            >
              {zodiac.symbol}
            </text>
          </g>
        );
      })}

      {/* Ascendant */}
      {positions?.ascendant && (
        <g>
          <circle 
            cx={center + (wheelRadius * 0.95) * Math.cos((positions.ascendant.degree) * Math.PI / 180)}
            cy={center + (wheelRadius * 0.95) * Math.sin((positions.ascendant.degree) * Math.PI / 180)}
            r="12"
            className="fill-purple-100 stroke-purple-500"
          />
          <text
            x={center + (wheelRadius * 0.95) * Math.cos((positions.ascendant.degree) * Math.PI / 180)}
            y={center + (wheelRadius * 0.95) * Math.sin((positions.ascendant.degree) * Math.PI / 180)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-purple-700"
          >
            ASC
          </text>
        </g>
      )}

      {/* Houses */}
      {positions?.houses?.map((house, index) => (
        <g key={index}>
          {/* House Cusp */}
        </g>
      ))}

      {Object.entries(positions || {}).filter(([key]) => key !== 'validLocation' && key !== 'formattedLocation' && key !== 'houses' && key !== 'ascendant').map(([planet, data]) => {
        if (!data?.sign) return null;
        const zodiacSign = zodiacSigns.find(z => z.sign.toLowerCase() === data.sign.toLowerCase());
        if (!zodiacSign) return null;

        // Convert zodiac positions to wheel angles (clockwise from top)
        const zodiacStartDegree = ((zodiacSign.startAngle + 270) % 360); // Rotate so 0° is at top
        const totalDegree = (zodiacStartDegree + (data.degree || 0)) % 360;
        const angle = (totalDegree * Math.PI) / 180;

        // Calculate position on wheel (use negative angle for clockwise rotation)
        const x = center + (wheelRadius * 0.7) * Math.cos(-angle);
        const y = center + (wheelRadius * 0.7) * Math.sin(-angle);

        return (
          <g key={planet} className={interactive ? 'cursor-pointer hover:text-primary' : ''}>
            <circle 
              cx={x} 
              cy={y} 
              r="15" 
              fill="rgba(147, 51, 234, 0.1)" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="opacity-50"
            />
            <text 
              x={x} 
              y={y} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fontSize="14"
              className="fill-current font-bold"
            >
              {planetSymbols[planet.toLowerCase()] || planet}
            </text>
            {interactive && (
              <title>{`${planet} in ${data.sign} at ${data.degree}°`}</title>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default AstrologyWheel;