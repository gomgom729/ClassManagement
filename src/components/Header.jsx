import React from 'react';
import { UserCheck, Shield, GraduationCap, Coins, Sparkles } from 'lucide-react';
import { getLevelInfo } from '../utils/level';

export default function Header({
  mode,
  setMode,
  selectedStudentId,
  setSelectedStudentId,
  students,
}) {
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const levelInfo = currentStudent ? getLevelInfo(currentStudent.exp) : null;

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon">
          <Coins size={24} />
        </div>
        <div>
          <h1 className="brand-title">6학년 학급 경제 교실</h1>
          <p className="brand-subtitle">화폐 × 게이미피케이션 학급 성장 플랫폼</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {mode === 'student' && currentStudent && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '0.4rem 0.9rem',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <span className="badge badge-emerald">Lv.{levelInfo.level}</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34d399' }}>
              {currentStudent.name} ({currentStudent.balance.toLocaleString()} 코인)
            </span>
          </div>
        )}

        <div className="mode-switcher-container">
          <button
            className={`mode-btn ${mode === 'teacher' ? 'active-teacher' : ''}`}
            onClick={() => setMode('teacher')}
          >
            <Shield size={16} />
            교사 모드
          </button>

          <button
            className={`mode-btn ${mode === 'student' ? 'active-student' : ''}`}
            onClick={() => {
              setMode('student');
              if (!selectedStudentId && students.length > 0) {
                setSelectedStudentId(students[0].id);
              }
            }}
          >
            <GraduationCap size={16} />
            학생 모드
          </button>

          {mode === 'student' && (
            <select
              className="student-select-dropdown"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {String(s.number).padStart(2, '0')}번 {s.name} ({s.gender})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </header>
  );
}
