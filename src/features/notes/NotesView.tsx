import React from 'react';
import { VoidKasten } from '../void-kasten/VoidKasten';
import { useAppStore } from '../../store/useAppStore';

export function NotesView({ toast }: { toast: (msg: string) => void }) {
  const { setData } = useAppStore();

  const handleXpEvent = (event: 'note_created' | 'link_created' | 'daily_note_streak') => {
    let xpGain = 0;
    if (event === 'note_created') xpGain = 10;
    if (event === 'link_created') xpGain = 5;
    
    if (xpGain > 0) {
      setData(d => ({
        ...d,
        user: { ...d.user, totalXp: d.user.totalXp + xpGain }
      }));
      toast(`✓ +${xpGain} XP | ${event.replace('_', ' ').toUpperCase()}`);
    }
  };

  return (
    <div className="absolute inset-0">
      <VoidKasten onXpEvent={handleXpEvent} />
    </div>
  );
}
