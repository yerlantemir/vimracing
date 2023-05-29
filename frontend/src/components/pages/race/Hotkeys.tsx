'use client';

import { useEffect, useState } from 'react';

export const Hotkeys = () => {
  const [pressedKeys, setPressedKeys] = useState<
    {
      keys: string;
      isFinished: boolean;
    }[]
  >([]);
  useEffect(() => {
    const onOperatorFinish = (event: any) => {
      console.log(event.detail);
    };
    const onOperatorStart = (event: any) => {
      console.log(event.detail);
    };
    window.addEventListener('vimracing-operator-finish', onOperatorFinish);
    window.addEventListener('vimracing-operator-start', onOperatorStart);
  }, []);
  return <div>hello world!</div>;
};
