import { TarotReading } from '../components/tarot-reading';
import { allTarotCards } from '../data/tarot-cards';

export default function TarotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-goldenrod mb-8">
          Daily Tarot Reading
        </h1>
        <TarotReading cards={allTarotCards} />
      </div>
    </div>
  );
}
