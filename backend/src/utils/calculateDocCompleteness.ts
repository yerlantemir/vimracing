const calcDiffCount = (start: string, current: string) => {
  const arrays = [start, current];
  arrays.sort((a, b) => a.length - b.length);
  const [shorter, longer] = arrays;
  return [...longer].reduce((acc, char, index) => {
    if (char !== shorter[index]) {
      acc++;
    }
    return acc;
  }, 0);
};

export const calculateDocCompleteness = (
  startStringList: string[],
  targetStringList: string[],
  currentStringList: string[]
) => {
  let initialDifferencesCount = 0;
  for (let i = 0; i < startStringList.length; i++) {
    const currentStartStr = startStringList[i];
    const currentTargetStr = targetStringList[i];
    initialDifferencesCount += calcDiffCount(currentStartStr, currentTargetStr);
  }

  let currentDifferencesCount = 0;
  for (let i = 0; i < targetStringList.length; i++) {
    const currentStartStr = targetStringList[i];
    const currentCurrentStr = currentStringList[i] || ''; // Added || '' to prevent undefined
    if (!currentCurrentStr) {
      currentDifferencesCount += currentStartStr.length || 1;
      continue;
    }

    currentDifferencesCount += calcDiffCount(
      currentStartStr,
      currentCurrentStr
    );
  }

  if (currentDifferencesCount >= initialDifferencesCount) return 0;

  return (
    100 - Math.floor((currentDifferencesCount / initialDifferencesCount) * 100)
  );
};
