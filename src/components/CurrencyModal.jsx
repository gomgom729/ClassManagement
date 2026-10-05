import React, { useState } from 'react';
import { X, Coins, Plus, Minus, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CurrencyModal({
  isOpen,
  onClose,
  targetStudents = [],
  onApplyCurrency,
}) {
  const [amount, setAmount] = useState(50);
  const [type, setType] = useState('add'); // 'add' | 'deduct'
  const [reason, setReason] = useState('학급 활동 및 칭찬 보상');

  if (!isOpen) return null;

  const handleApply = (e) => {
    e.preventDefault();
    const finalAmount = Number(amount);
    if (!finalAmount || finalAmount <= 0) return;

    const delta = type === 'add' ? finalAmount : -finalAmount;
    onApplyCurrency(targetStudents.map((s) => s.id), delta, reason);

    if (type === 'add') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore fallback
      }
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            <Coins className="text-amber" size={22} />
            학급 화폐 지급 / 차감
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleApply}>
          <div className="modal-body">
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                대상 학생 ({targetStudents.length}명):
              </div>
              <div style={{ color: '#a5b4fc', fontWeight: 600, wordBreak: 'break-all' }}>
                {targetStudents.map((s) => `${s.number}번 ${s.name}`).join(', ')}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                className={`btn ${type === 'add' ? 'btn-emerald' : 'btn-secondary'}`}
                onClick={() => setType('add')}
              >
                <Plus size={16} /> 화폐 지급 (+ EXP 1:1 누적)
              </button>
              <button
                type="button"
                className={`btn ${type === 'deduct' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => setType('deduct')}
              >
                <Minus size={16} /> 화폐 차감 (레벨 보존)
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">금액 (코인)</label>
              <input
                type="number"
                min="1"
                step="1"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                빠른 금액 선택
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[10, 50, 100, 200, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setAmount(preset)}
                  >
                    +{preset} 코인
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">지급/차감 사유</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 발표 열정상, 규칙 준수, 급식 정돈"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              💡 **규칙 알림**: 화폐 지급 시 동율의 누적 경험치(EXP)가 함께 부여되며 레벨이 계산됩니다. 화폐를 차감하거나 상점에서 사용해도 누적 경험치는 줄어들지 않고 레벨이 보존됩니다.
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button
              type="submit"
              className={`btn ${type === 'add' ? 'btn-gold' : 'btn-danger'}`}
            >
              <Award size={16} />
              {type === 'add' ? `${amount.toLocaleString()} 코인 지급하기` : `${amount.toLocaleString()} 코인 차감하기`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
