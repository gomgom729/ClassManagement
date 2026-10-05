import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import ExcelModal from './components/ExcelModal';
import CurrencyModal from './components/CurrencyModal';
import DutyModal from './components/DutyModal';
import MissionModal from './components/MissionModal';
import StoreModal from './components/StoreModal';
import { loadState, saveState } from './utils/storage';
import { initialStudents, initialDutyTasks, initialStoreItems, initialMissions } from './data/initialData';

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [mode, setMode] = useState('teacher'); // 'teacher' | 'student'
  const [selectedStudentId, setSelectedStudentId] = useState(
    state.students.length > 0 ? state.students[0].id : ''
  );

  // Modal open states
  const [isExcelOpen, setIsExcelOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currencyTargets, setCurrencyTargets] = useState([]);
  const [isDutyOpen, setIsDutyOpen] = useState(false);
  const [isMissionOpen, setIsMissionOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // Save state on change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const {
    students,
    dutyTasks,
    storeItems,
    missions,
    dutyCycleOffset,
    studentMissionStatus,
    dutyCompletions,
  } = state;

  // Handlers
  const handleImportStudents = (newStudents) => {
    setState((prev) => ({
      ...prev,
      students: newStudents,
    }));
    if (newStudents.length > 0) {
      setSelectedStudentId(newStudents[0].id);
    }
  };

  const handleAddStudent = (student) => {
    setState((prev) => ({
      ...prev,
      students: [...prev.students, student],
    }));
  };

  const handleApplyCurrency = (studentIds, delta, reason) => {
    setState((prev) => {
      const updatedStudents = prev.students.map((s) => {
        if (!studentIds.includes(s.id)) return s;

        const newBalance = Math.max(0, s.balance + delta);
        // EXP 1:1 rule: only increases on reward (+delta)
        const newExp = delta > 0 ? s.exp + delta : s.exp;

        return {
          ...s,
          balance: newBalance,
          exp: newExp,
        };
      });

      return {
        ...prev,
        students: updatedStudents,
      };
    });
  };

  const handleApproveMission = (studentId, missionId, rewardCoin) => {
    setState((prev) => {
      const updatedStatus = {
        ...prev.studentMissionStatus,
        [`${studentId}_${missionId}`]: 'approved',
      };

      const updatedStudents = prev.students.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          balance: s.balance + rewardCoin,
          exp: s.exp + rewardCoin, // 1:1 EXP boost
        };
      });

      return {
        ...prev,
        studentMissionStatus: updatedStatus,
        students: updatedStudents,
      };
    });
  };

  const handleRequestMissionCompletion = (studentId, missionId) => {
    setState((prev) => ({
      ...prev,
      studentMissionStatus: {
        ...prev.studentMissionStatus,
        [`${studentId}_${missionId}`]: 'pending',
      },
    }));
  };

  const handleBuyStoreItem = (studentId, item) => {
    setState((prev) => {
      const updatedStudents = prev.students.map((s) => {
        if (s.id !== studentId) return s;

        const newCoupon = {
          id: 'cp_' + Date.now(),
          title: item.name,
          code: 'COUPON-' + Math.floor(1000 + Math.random() * 9000),
          used: false,
          date: new Date().toISOString().split('T')[0],
        };

        return {
          ...s,
          balance: s.balance - item.price,
          myCoupons: [...(s.myCoupons || []), newCoupon],
        };
      });

      const updatedItems = prev.storeItems.map((st) => {
        if (st.id !== item.id) return st;
        return {
          ...st,
          stock: Math.max(0, st.stock - 1),
        };
      });

      return {
        ...prev,
        students: updatedStudents,
        storeItems: updatedItems,
      };
    });
  };

  const handleUseCoupon = (studentId, couponId) => {
    setState((prev) => {
      const updatedStudents = prev.students.map((s) => {
        if (s.id !== studentId) return s;

        const updatedCoupons = (s.myCoupons || []).map((c) => {
          if (c.id !== couponId) return c;
          return { ...c, used: true };
        });

        return { ...s, myCoupons: updatedCoupons };
      });

      return { ...prev, students: updatedStudents };
    });
  };

  const handleToggleDutyTask = (studentId, taskDate, taskId) => {
    const key = `${studentId}_${taskDate}_${taskId}`;
    setState((prev) => ({
      ...prev,
      dutyCompletions: {
        ...prev.dutyCompletions,
        [key]: !prev.dutyCompletions[key],
      },
    }));
  };

  const handleAddDutyTask = (newTask) => {
    setState((prev) => ({
      ...prev,
      dutyTasks: [...prev.dutyTasks, newTask],
    }));
  };

  const handleDeleteDutyTask = (taskId) => {
    setState((prev) => ({
      ...prev,
      dutyTasks: prev.dutyTasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleAddMission = (newMission) => {
    setState((prev) => ({
      ...prev,
      missions: [...prev.missions, newMission],
    }));
  };

  const handleDeleteMission = (missionId) => {
    setState((prev) => ({
      ...prev,
      missions: prev.missions.filter((m) => m.id !== missionId),
    }));
  };

  const handleAddStoreItem = (newItem) => {
    setState((prev) => ({
      ...prev,
      storeItems: [...prev.storeItems, newItem],
    }));
  };

  const handleDeleteStoreItem = (itemId) => {
    setState((prev) => ({
      ...prev,
      storeItems: prev.storeItems.filter((st) => st.id !== itemId),
    }));
  };

  const handleResetData = () => {
    if (window.confirm('모든 학급 데이터를 초기 샘플 상태로 리셋하시겠습니까?')) {
      const resetObj = {
        students: initialStudents,
        dutyTasks: initialDutyTasks,
        storeItems: initialStoreItems,
        missions: initialMissions,
        dutyCycleOffset: 0,
        studentMissionStatus: {},
        dutyCompletions: {},
      };
      setState(resetObj);
      setSelectedStudentId(initialStudents[0].id);
    }
  };

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <div className="app-container">
      <Header
        mode={mode}
        setMode={setMode}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        students={students}
      />

      <main style={{ flex: 1 }}>
        {mode === 'teacher' ? (
          <TeacherDashboard
            students={students}
            dutyTasks={dutyTasks}
            dutyCycleOffset={dutyCycleOffset}
            storeItems={storeItems}
            missions={missions}
            studentMissionStatus={studentMissionStatus}
            onOpenExcelModal={() => setIsExcelOpen(true)}
            onOpenCurrencyModal={(targets) => {
              setCurrencyTargets(targets);
              setIsCurrencyOpen(true);
            }}
            onOpenDutyModal={() => setIsDutyOpen(true)}
            onOpenMissionModal={() => setIsMissionOpen(true)}
            onOpenStoreModal={() => setIsStoreOpen(true)}
            onApproveMission={handleApproveMission}
            onDeleteStoreItem={handleDeleteStoreItem}
            onDeleteMission={handleDeleteMission}
            onResetData={handleResetData}
          />
        ) : (
          <StudentDashboard
            student={currentStudent}
            students={students}
            dutyTasks={dutyTasks}
            dutyCycleOffset={dutyCycleOffset}
            storeItems={storeItems}
            missions={missions}
            studentMissionStatus={studentMissionStatus}
            dutyCompletions={dutyCompletions}
            onRequestMissionCompletion={handleRequestMissionCompletion}
            onBuyStoreItem={handleBuyStoreItem}
            onUseCoupon={handleUseCoupon}
            onToggleDutyTask={handleToggleDutyTask}
          />
        )}
      </main>

      {/* Modals */}
      <ExcelModal
        isOpen={isExcelOpen}
        onClose={() => setIsExcelOpen(false)}
        onImportStudents={handleImportStudents}
        onAddStudent={handleAddStudent}
      />

      <CurrencyModal
        isOpen={isCurrencyOpen}
        onClose={() => setIsCurrencyOpen(false)}
        targetStudents={currencyTargets}
        onApplyCurrency={handleApplyCurrency}
      />

      <DutyModal
        isOpen={isDutyOpen}
        onClose={() => setIsDutyOpen(false)}
        students={students}
        dutyTasks={dutyTasks}
        dutyCycleOffset={dutyCycleOffset}
        setDutyCycleOffset={(fn) =>
          setState((prev) => ({
            ...prev,
            dutyCycleOffset: typeof fn === 'function' ? fn(prev.dutyCycleOffset) : fn,
          }))
        }
        onAddDutyTask={handleAddDutyTask}
        onDeleteDutyTask={handleDeleteDutyTask}
      />

      <MissionModal
        isOpen={isMissionOpen}
        onClose={() => setIsMissionOpen(false)}
        onAddMission={handleAddMission}
      />

      <StoreModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        onAddStoreItem={handleAddStoreItem}
      />
    </div>
  );
}
