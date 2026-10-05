// Level threshold limits
const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  850,   // Level 5
  1300,  // Level 6
  1850,  // Level 7
  2500,  // Level 8
  3250,  // Level 9
  4100,  // Level 10
];

export function getLevelInfo(exp = 0) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (exp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const prevLevelExp = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelExp = LEVEL_THRESHOLDS[level] || (prevLevelExp + 1000);

  const expInCurrentLevel = exp - prevLevelExp;
  const expNeededForNextLevel = nextLevelExp - prevLevelExp;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.floor((expInCurrentLevel / expNeededForNextLevel) * 100))
  );

  return {
    level,
    exp,
    prevLevelExp,
    nextLevelExp,
    expInCurrentLevel,
    expNeededForNextLevel,
    progressPercent,
  };
}
