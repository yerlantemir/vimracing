'use client';

import { ContentCard } from '@/components/ContentCard';
import { Hotkeys } from '@/components/pages/race/Hotkeys/Hotkeys';

const TestPage = () => {
  return (
    <div>
      <ContentCard>
        <div className="flex flex-col gap-4">
          <Hotkeys />
        </div>
      </ContentCard>
    </div>
  );
};
export default TestPage;
