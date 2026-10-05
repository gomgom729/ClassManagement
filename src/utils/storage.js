import { initialStudents, initialDutyTasks, initialStoreItems, initialMissions } from '../data/initialData';

const STORAGE_KEY = 'CLASS_MANAGEMENT_APP_V1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialState();
    }
    const parsed = JSON.parse(raw);
    return {
      students: parsed.students || initialStudents,
      dutyTasks: parsed.dutyTasks || initialDutyTasks,
      storeItems: parsed.storeItems || initialStoreItems,
      missions: parsed.missions || initialMissions,
      dutyCycleOffset: parsed.dutyCycleOffset ?? 0,
      studentMissionStatus: parsed.studentMissionStatus || {}, // studentId_missionId -> 'pending' | 'approved'
      dutyCompletions: parsed.dutyCompletions || {}, // studentId_taskDate -> boolean
    };
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return getInitialState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

function getInitialState() {
  return {
    students: initialStudents,
    dutyTasks: initialDutyTasks,
    storeItems: initialStoreItems,
    missions: initialMissions,
    dutyCycleOffset: 0,
    studentMissionStatus: {},
    dutyCompletions: {},
  };
}
