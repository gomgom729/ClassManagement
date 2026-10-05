import React, { useState } from 'react';
import {
  Users,
  Coins,
  Calendar,
  ShoppingBag,
  CheckCircle2,
  Upload,
  Plus,
  Search,
  ArrowUpDown,
  Award,
  Trash2,
  Check,
  RotateCcw,
} from 'lucide-react';
import { calculateDutyRotation } from '../utils/duty';
import { getLevelInfo } from '../utils/level';

export default function TeacherDashboard({
  students,
  dutyTasks,
  dutyCycleOffset,
  storeItems,
  missions,
  studentMissionStatus,
  onOpenExcelModal,
  onOpenCurrencyModal,
  onOpenDutyModal,
  onOpenMissionModal,
  onOpenStoreModal,
  onApproveMission,
  onDeleteStoreItem,
  onDeleteMission,
  onResetData,
}) {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('number'); // 'number' | 'balance' | 'exp'
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'duty' | 'store' | 'missions'

  const dutyRotation = calculateDutyRotation(students, '2026-03-02', dutyCycleOffset);

  // Filter & Sort students
  const filteredStudents = students
    .filter(
      (s) =>
        s.name.includes(searchQuery) ||
        String(s.number).includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortBy === 'balance') return b.balance - a.balance;
      if (sortBy === 'exp') return b.exp - a.exp;
      return a.number - b.number;
    });

  const isAllSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudentIds.includes(s.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  // Pending mission completion requests count
  const pendingApprovalsCount = Object.values(studentMissionStatus).filter(
    (status) => status === 'pending'
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner: Duty & Quick Controls */}
      <div
        className="glass-panel"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '1.5rem',
          alignItems: 'center',
          background:
            'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-sky">
              <Calendar size={12} /> 2주 순환 당번 (D-{dutyRotation.daysRemaining}일 남음)
            </span>
            <button className="btn btn-secondary btn-sm" onClick={onOpenDutyModal}>
              당번 설정 및 순서 관리
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👦 남학생 당번:</span>
              <span style={{ fontWeight: 700, color: '#60a5fa', fontSize: '1.05rem' }}>
                {dutyRotation.currentBoy
                  ? `${String(dutyRotation.currentBoy.number).padStart(2, '0')}번 ${dutyRotation.currentBoy.name}`
                  : '미지정'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👧 여학생 당번:</span>
              <span style={{ fontWeight: 700, color: '#f472b6', fontSize: '1.05rem' }}>
                {dutyRotation.currentGirl
                  ? `${String(dutyRotation.currentGirl.number).padStart(2, '0')}번 ${dutyRotation.currentGirl.name}`
                  : '미지정'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-emerald" onClick={onOpenExcelModal}>
            <Upload size={16} /> 엑셀 명단 업로드
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onResetData} title="초기 데모 데이터로 복원">
            <RotateCcw size={14} /> 데이터 리셋
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={16} /> 전체 학생 명단 ({students.length}명)
        </button>
        <button
          className={`btn ${activeTab === 'missions' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('missions')}
        >
          <CheckCircle2 size={16} /> 오늘의 미션 & 승인
          {pendingApprovalsCount > 0 && (
            <span style={{ background: '#f43f5e', color: '#fff', borderRadius: '999px', padding: '0.1rem 0.45rem', fontSize: '0.75rem' }}>
              {pendingApprovalsCount}
            </span>
          )}
        </button>
        <button
          className={`btn ${activeTab === 'store' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('store')}
        >
          <ShoppingBag size={16} /> 학급 상점 관리 ({storeItems.length}개)
        </button>
      </div>

      {/* Tab 1: Students Manager */}
      {activeTab === 'students' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="학생 이름/번호 검색..."
                  style={{ paddingLeft: '2.4rem', width: '220px' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ArrowUpDown size={14} className="text-muted" />
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="number">출석 번호순</option>
                  <option value="balance">화폐 잔액 많은순</option>
                  <option value="exp">레벨/EXP 높은순</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                선생님이 선택한 학생: <strong style={{ color: '#a5b4fc' }}>{selectedStudentIds.length}명</strong>
              </span>

              <button
                className="btn btn-gold"
                disabled={selectedStudentIds.length === 0}
                onClick={() => {
                  const targetList = students.filter((s) => selectedStudentIds.includes(s.id));
                  onOpenCurrencyModal(targetList);
                }}
              >
                <Coins size={16} /> 선택 학생 화폐 지급/차감
              </button>
            </div>
          </div>

          {/* Student List Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="student-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </th>
                  <th>번호</th>
                  <th>이름</th>
                  <th>성별</th>
                  <th>현재 잔액</th>
                  <th>레벨 & 경험치 (EXP)</th>
                  <th style={{ textAlign: 'right' }}>지급 / 차감 Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      등록된 학생이 없거나 검색 결과가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const levelInfo = getLevelInfo(student.exp);
                    const isSelected = selectedStudentIds.includes(student.id);

                    return (
                      <tr key={student.id} style={{ background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'transparent' }}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectStudent(student.id)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                          {String(student.number).padStart(2, '0')}번
                        </td>
                        <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{student.name}</td>
                        <td>
                          <span className={`badge ${student.gender === '남' ? 'badge-sky' : 'badge-rose'}`}>
                            {student.gender}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1rem' }}>
                            💰 {student.balance.toLocaleString()} 코인
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '160px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                              <span className="badge badge-emerald">Lv.{levelInfo.level}</span>
                              <span style={{ color: 'var(--text-muted)' }}>
                                {levelInfo.expInCurrentLevel} / {levelInfo.expNeededForNextLevel} EXP
                              </span>
                            </div>
                            <div className="progress-bar-container" style={{ height: '8px' }}>
                              <div
                                className="progress-bar-fill"
                                style={{ width: `${levelInfo.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onOpenCurrencyModal([student])}
                          >
                            <Award size={14} /> 지급/차감
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Missions & Approval */}
      {activeTab === 'missions' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} className="text-purple" />
              오늘의 미션 목록 및 학생 제출 승인
            </h3>
            <button className="btn btn-primary" onClick={onOpenMissionModal}>
              <Plus size={16} /> 새 미션 추가
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {missions.map((m) => (
              <div
                key={m.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-purple">{m.category}</span>
                  <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.95rem' }}>
                    +{m.reward} 코인
                  </span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{m.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.description}</p>
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDeleteMission(m.id)}
                    title="미션 삭제"
                  >
                    <Trash2 size={14} /> 삭제
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Approvals List */}
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#a5b4fc' }}>
              📥 학생 미션 완료 제출 현황 및 승인
            </h4>

            {Object.keys(studentMissionStatus).length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>아직 학생들의 미션 제출 내역이 없습니다.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(studentMissionStatus).map(([key, status]) => {
                  const [studentId, missionId] = key.split('_');
                  const student = students.find((s) => s.id === studentId);
                  const mission = missions.find((m) => m.id === missionId);

                  if (!student || !mission) return null;

                  return (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(15, 23, 42, 0.5)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, color: '#38bdf8', marginRight: '0.5rem' }}>
                          {student.number}번 {student.name}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          [{mission.title}] 완료 요청 (+{mission.reward} 코인)
                        </span>
                      </div>

                      <div>
                        {status === 'approved' ? (
                          <span className="badge badge-emerald">
                            <Check size={12} /> 승인 완료
                          </span>
                        ) : (
                          <button
                            className="btn btn-emerald btn-sm"
                            onClick={() => onApproveMission(studentId, missionId, mission.reward)}
                          >
                            <Check size={14} /> 승인 및 코인 지급
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Store Manager */}
      {activeTab === 'store' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} className="text-amber" />
              학급 상점 상품 및 쿠폰 관리
            </h3>
            <button className="btn btn-gold" onClick={onOpenStoreModal}>
              <Plus size={16} /> 새 상품 등록
            </button>
          </div>

          <div className="store-grid">
            {storeItems.map((item) => (
              <div key={item.id} className="store-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="store-card-icon">{item.icon}</div>
                  <span className={`badge ${item.category === '쿠폰' ? 'badge-amber' : 'badge-emerald'}`}>
                    {item.category}
                  </span>
                </div>
                <div className="store-card-title">{item.name}</div>
                <div className="store-card-price">💰 {item.price.toLocaleString()} 코인</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</p>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                  재고 수량: <strong style={{ color: 'var(--text-main)' }}>{item.stock}개</strong>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => onDeleteStoreItem(item.id)}
                >
                  <Trash2 size={14} /> 상품 삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
