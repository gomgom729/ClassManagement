/**
 * 2주(14일) 단위 자동 순환 당번 계산 유틸리티
 */
export function calculateDutyRotation(students = [], startDateStr = '2026-03-02', cycleOffset = 0) {
  const boys = students.filter((s) => s.gender === '남').sort((a, b) => a.number - b.number);
  const girls = students.filter((s) => s.gender === '여').sort((a, b) => a.number - b.number);

  if (boys.length === 0 && girls.length === 0) {
    return {
      currentBoy: null,
      currentGirl: null,
      nextBoy: null,
      nextGirl: null,
      cycleIndex: 0,
      daysRemaining: 14,
    };
  }

  const startDate = new Date(startDateStr);
  const today = new Date();
  const diffTime = Math.max(0, today - startDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const baseCycle = Math.floor(diffDays / 14);
  const activeCycle = baseCycle + cycleOffset;

  const daysInCurrentCycle = diffDays % 14;
  const daysRemaining = 14 - daysInCurrentCycle;

  const boyIdx = boys.length > 0 ? activeCycle % boys.length : -1;
  const girlIdx = girls.length > 0 ? activeCycle % girls.length : -1;

  const nextBoyIdx = boys.length > 0 ? (activeCycle + 1) % boys.length : -1;
  const nextGirlIdx = girls.length > 0 ? (activeCycle + 1) % girls.length : -1;

  return {
    currentBoy: boys[boyIdx] || null,
    currentGirl: girls[girlIdx] || null,
    nextBoy: boys[nextBoyIdx] || null,
    nextGirl: girls[nextGirlIdx] || null,
    cycleIndex: activeCycle,
    daysRemaining,
    boysList: boys,
    girlsList: girls,
  };
}
