import React, { useState } from 'react';
import { X, Calendar, CheckSquare, Plus, Trash2, RotateCw } from 'lucide-react';
import { calculateDutyRotation } from '../utils/duty';

export default function DutyModal({
  isOpen,
  onClose,
  students,
  dutyTasks,
  dutyCycleOffset,
  setDutyCycleOffset,
  onAddDutyTask,
  onDeleteDutyTask,
}) {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskIcon, setNewTaskIcon] = useState('🧹');

  if (!isOpen) return null;

  const currentRotation = calculateDutyRotation(students, '2026-03-02', dutyCycleOffset);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddDutyTask({
      id: 'dt_' + Date.now(),
      task: newTaskText.trim(),
      icon: newTaskIcon || '🧹',
    });
    setNewTaskText('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Calendar className="text-sky" size={22} />
            2주 순환 당번 배정 & 업무 관리
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Current Rotation Overview */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15))',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary">현재 2주 차 배정 ({currentRotation.daysRemaining}일 남음)</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setDutyCycleOffset((prev) => prev - 1)}
                >
                  ◀ 이전 2주
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setDutyCycleOffset(0)}
                >
                  <RotateCw size={12} /> 초기화
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setDutyCycleOffset((prev) => prev + 1)}
                >
                  다음 2주 ▶
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>👦 이번 주 남학생 당번</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#60a5fa', marginTop: '0.2rem' }}>
                  {currentRotation.currentBoy
                    ? `${String(currentRotation.currentBoy.number).padStart(2, '0')}번 ${currentRotation.currentBoy.name}`
                    : '명단 없음'}
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>👧 이번 주 여학생 당번</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f472b6', marginTop: '0.2rem' }}>
                  {currentRotation.currentGirl
                    ? `${String(currentRotation.currentGirl.number).padStart(2, '0')}번 ${currentRotation.currentGirl.name}`
                    : '명단 없음'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              🔮 **다음 차수 당번**:{' '}
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                {currentRotation.nextBoy ? `${currentRotation.nextBoy.name}` : '-'},{' '}
                {currentRotation.nextGirl ? `${currentRotation.nextGirl.name}` : '-'}
              </span>
            </div>
          </div>

          {/* Duty Tasks List Manager */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckSquare size={18} className="text-emerald" />
              당번 업무 체크리스트 항목 관리 ({dutyTasks.length}개)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem' }}>
              {dutyTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(15, 23, 42, 0.5)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <span style={{ fontSize: '0.9rem' }}>
                    <span style={{ marginRight: '0.4rem' }}>{t.icon}</span>
                    {t.task}
                  </span>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDeleteDutyTask(t.id)}
                    title="업무 삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Duty Task Form */}
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="아이콘 (예: 🧹)"
                style={{ width: '80px', textAlign: 'center' }}
                value={newTaskIcon}
                onChange={(e) => setNewTaskIcon(e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                placeholder="새 당번 업무 (예: 교실 화분 물주기)"
                style={{ flex: 1 }}
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-emerald btn-sm">
                <Plus size={14} /> 추가
              </button>
            </form>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
