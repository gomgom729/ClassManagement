import React, { useState } from 'react';
import {
  Coins,
  Trophy,
  Calendar,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  Ticket,
  Check,
  AlertCircle,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLevelInfo } from '../utils/level';
import { calculateDutyRotation } from '../utils/duty';

export default function StudentDashboard({
  student,
  students,
  dutyTasks,
  dutyCycleOffset,
  storeItems,
  missions,
  studentMissionStatus,
  dutyCompletions,
  onRequestMissionCompletion,
  onBuyStoreItem,
  onUseCoupon,
  onToggleDutyTask,
}) {
  const [activeSubTab, setActiveSubTab] = useState('missions'); // 'missions' | 'store' | 'coupons'

  if (!student) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertCircle size={36} color="#fb7185" style={{ marginBottom: '0.75rem' }} />
        <h3>선택된 학생 정보가 없습니다.</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          상단 우측의 드롭다운에서 학생을 선택해 주세요.
        </p>
      </div>
    );
  }

  const levelInfo = getLevelInfo(student.exp);
  const rotation = calculateDutyRotation(students, '2026-03-02', dutyCycleOffset);

  const isCurrentDuty =
    (rotation.currentBoy && rotation.currentBoy.id === student.id) ||
    (rotation.currentGirl && rotation.currentGirl.id === student.id);

  const dutyPartner =
    student.gender === '남' ? rotation.currentGirl : rotation.currentBoy;

  const handleBuyItem = (item) => {
    if (student.balance < item.price) {
      alert(`코인이 부족합니다! (필요: ${item.price} 코인, 현재: ${student.balance} 코인)`);
      return;
    }
    if (item.stock <= 0) {
      alert('상품 재고가 소진되었습니다!');
      return;
    }

    onBuyStoreItem(student.id, item);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err) {}
  };

  const handleUseCoupon = (couponId) => {
    if (window.confirm('선생님께 이 쿠폰을 사용 제출하시겠습니까?')) {
      onUseCoupon(student.id, couponId);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Student Hero Profile Card */}
      <div
        className="glass-panel"
        style={{
          background:
            'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-glow)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '1.5rem',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--grad-hero)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            {student.gender === '남' ? '👦' : '👧'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {String(student.number).padStart(2, '0')}번
              </span>
              <span className={`badge ${student.gender === '남' ? 'badge-sky' : 'badge-rose'}`}>
                {student.gender}학생
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.2rem 0' }}>
              {student.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-emerald" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                <Trophy size={14} /> Level {levelInfo.level}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                총 누적 EXP: {student.exp.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Coin & EXP Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>💰 내 화폐 잔액</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fbbf24' }}>
                {student.balance.toLocaleString()}{' '}
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>코인</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                보유 쿠폰: {student.myCoupons ? student.myCoupons.filter((c) => !c.used).length : 0}장
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>다음 레벨(Lv.{levelInfo.level + 1})까지</span>
              <span style={{ fontWeight: 700, color: '#a5b4fc' }}>
                {levelInfo.expInCurrentLevel} / {levelInfo.expNeededForNextLevel} EXP ({levelInfo.progressPercent}%)
              </span>
            </div>
            <div className="progress-bar-container" style={{ height: '14px' }}>
              <div className="progress-bar-fill" style={{ width: `${levelInfo.progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Duty Banner & Checklist (Highlighted if Duty) */}
      <div
        className="glass-panel"
        style={{
          border: isCurrentDuty ? '2px solid #38bdf8' : '1px solid var(--border-color)',
          background: isCurrentDuty
            ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : 'rgba(30, 41, 59, 0.7)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`badge ${isCurrentDuty ? 'badge-sky' : 'badge-primary'}`}>
              <Calendar size={14} /> 2주 순환 당번
            </span>
            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
              {isCurrentDuty ? '🎉 짝짝짝! 당신은 이번 주 당번입니다!' : '이번 주 당번 현황'}
            </span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            교체까지 D-{rotation.daysRemaining}일
          </span>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          현재 당번: 👦{' '}
          <strong style={{ color: '#60a5fa' }}>
            {rotation.currentBoy ? rotation.currentBoy.name : '-'}
          </strong>{' '}
          & 👧{' '}
          <strong style={{ color: '#f472b6' }}>
            {rotation.currentGirl ? rotation.currentGirl.name : '-'}
          </strong>
          {isCurrentDuty && dutyPartner && (
            <span style={{ marginLeft: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>
              (당번 파트너: {dutyPartner.name} 학생)
            </span>
          )}
        </div>

        {/* Duty Checklist for Duty Student */}
        {isCurrentDuty && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#38bdf8',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              🧹 이번 주 내가 해야 할 당번 업무 체크리스트
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {dutyTasks.map((t) => {
                const taskKey = `${student.id}_${todayStr}_${t.id}`;
                const isDone = Boolean(dutyCompletions[taskKey]);

                return (
                  <div
                    key={t.id}
                    onClick={() => onToggleDutyTask(student.id, todayStr, t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                      border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                    <span
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: isDone ? 700 : 500,
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? '#34d399' : 'var(--text-main)',
                      }}
                    >
                      {t.task}
                    </span>
                    {isDone && (
                      <span className="badge badge-emerald" style={{ marginLeft: 'auto' }}>
                        완료!
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Sub Tabs: Missions vs Store vs My Coupons */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          className={`btn ${activeSubTab === 'missions' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('missions')}
        >
          <CheckCircle2 size={16} /> 📌 오늘 할 일 ({missions.length}개)
        </button>
        <button
          className={`btn ${activeSubTab === 'store' ? 'btn-gold' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('store')}
        >
          <ShoppingBag size={16} /> 🛒 학급 상점 이용
        </button>
        <button
          className={`btn ${activeSubTab === 'coupons' ? 'btn-emerald' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('coupons')}
        >
          <Ticket size={16} /> 🎟️ 내 쿠폰함 ({student.myCoupons ? student.myCoupons.length : 0}개)
        </button>
      </div>

      {/* Tab: Missions */}
      {activeSubTab === 'missions' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} className="text-purple" />
            선생님이 부여한 오늘의 학급 미션
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {missions.map((m) => {
              const statusKey = `${student.id}_${m.id}`;
              const status = studentMissionStatus[statusKey]; // undefined | 'pending' | 'approved'

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.1rem 1.25rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-purple">{m.category}</span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{m.title}</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.description}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                      +{m.reward} 코인
                    </span>

                    {status === 'approved' ? (
                      <span className="badge badge-emerald" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                        <Check size={14} /> 완료 & 코인 받음
                      </span>
                    ) : status === 'pending' ? (
                      <span className="badge badge-amber" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                        <Clock size={14} /> 선생님 승인 대기 중
                      </span>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => onRequestMissionCompletion(student.id, m.id)}
                      >
                        <Sparkles size={16} /> 완료 제출하기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Store */}
      {activeSubTab === 'store' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} className="text-amber" />
              학급 상점 (원하는 쿠폰/아이템 구매)
            </h3>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              내 잔액: <strong style={{ color: '#fbbf24' }}>{student.balance.toLocaleString()} 코인</strong>
            </span>
          </div>

          <div className="store-grid">
            {storeItems.map((item) => {
              const canAfford = student.balance >= item.price;
              const hasStock = item.stock > 0;

              return (
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
                    남은 수량: {item.stock}개
                  </div>
                  <button
                    className={`btn ${canAfford && hasStock ? 'btn-gold' : 'btn-secondary'}`}
                    disabled={!canAfford || !hasStock}
                    onClick={() => handleBuyItem(item)}
                    style={{ marginTop: '0.5rem' }}
                  >
                    {!hasStock ? '품절' : !canAfford ? '코인 부족' : '구매하기'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: My Coupons */}
      {activeSubTab === 'coupons' && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Ticket size={20} className="text-emerald" />
            내가 보유한 학급 쿠폰함
          </h3>

          {!student.myCoupons || student.myCoupons.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              아직 구매한 쿠폰이 없습니다. 학급 상점에서 쿠폰을 구매해 보세요!
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {student.myCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  style={{
                    background: coupon.used ? 'rgba(30, 41, 59, 0.4)' : 'rgba(16, 185, 129, 0.12)',
                    border: coupon.used ? '1px solid var(--border-color)' : '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    opacity: coupon.used ? 0.6 : 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge ${coupon.used ? 'badge-rose' : 'badge-emerald'}`}>
                      {coupon.used ? '사용 완료' : '보유 중'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{coupon.date}</span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{coupon.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    쿠폰 코드: {coupon.code || 'COUPON-' + coupon.id.slice(-4)}
                  </div>

                  {!coupon.used ? (
                    <button
                      className="btn btn-emerald"
                      onClick={() => handleUseCoupon(coupon.id)}
                      style={{ marginTop: 'auto' }}
                    >
                      <Ticket size={16} /> 선생님께 사용하기
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      선생님 승인 완료 사용된 쿠폰입니다.
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
