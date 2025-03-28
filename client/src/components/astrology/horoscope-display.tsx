import React from 'react';

export interface HoroscopeDisplayProps {
  sign: string;
  content?: string;
  date?: string;
  isPremiumUser?: boolean;
}

const HoroscopeDisplay: React.FC<HoroscopeDisplayProps> = ({ sign, content, date, isPremiumUser }) => {
  return (
    <div>
      <h2>Horoscope for {sign}</h2>
      {date && <p>Date: {date}</p>}
      <p>{content ? content : "This is a placeholder horoscope."}</p>
      {isPremiumUser && <p>Premium insights available!</p>}
    </div>
  );
};

export default HoroscopeDisplay;
