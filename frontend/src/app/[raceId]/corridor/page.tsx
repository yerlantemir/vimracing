'use client';

import { ContentCard } from '@/components/ContentCard';
import { Button } from '@/components/Button';
import { CopyInput } from '@/components/CopyInput';
import { useRouter } from 'next/navigation';

export default function Corridor({ params }: { params: { raceId: string } }) {
  const { raceId } = params;
  const router = useRouter();

  const onRaceEnterClick = () => {
    if (raceId) router.push(`/${raceId}`);
    else {
      console.error('raceId does not exist');
    }
  };

  return (
    <ContentCard>
      <div className="flex gap-4 flex-col">
        <h5>Join race, whenever you’re ready</h5>
        <CopyInput link="https://vimracing.com/race/${this.raceId}"></CopyInput>
        <Button
          style={{
            width: '10rem'
          }}
          onClick={onRaceEnterClick}
        >
          Enter the race
        </Button>
      </div>
    </ContentCard>
  );
}
