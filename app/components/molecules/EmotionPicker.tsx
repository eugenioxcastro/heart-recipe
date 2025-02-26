'use client';

import { Pill } from '../atoms/Pill';
import { emotions } from '@/app/data/emotions';
import { Emotion } from '@/app/types';

interface EmotionPickerProps {
  selectedEmotions: string[];
  onEmotionToggle: (emotionId: string) => void;
}

export function EmotionPicker({
  selectedEmotions,
  onEmotionToggle,
}: EmotionPickerProps) {
  const groupedEmotions = emotions.reduce((acc, emotion) => {
    if (!acc[emotion.category]) {
      acc[emotion.category] = [];
    }
    acc[emotion.category].push(emotion);
    return acc;
  }, {} as Record<Emotion['category'], Emotion[]>);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">Basic Emotions</h3>
        <div className="flex flex-wrap gap-2">
          {groupedEmotions.basic?.map((emotion) => (
            <Pill
              key={emotion.id}
              label={emotion.label}
              category="basic"
              isSelected={selectedEmotions.includes(emotion.id)}
              onClick={() => onEmotionToggle(emotion.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">Complex Emotions</h3>
        <div className="flex flex-wrap gap-2">
          {groupedEmotions.complex?.map((emotion) => (
            <Pill
              key={emotion.id}
              label={emotion.label}
              category="complex"
              isSelected={selectedEmotions.includes(emotion.id)}
              onClick={() => onEmotionToggle(emotion.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 