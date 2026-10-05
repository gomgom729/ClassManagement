import React, { useState } from 'react';
import { X, CheckCircle2, Plus } from 'lucide-react';

export default function MissionModal({ isOpen, onClose, onAddMission }) {
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState(100);
  const [category, setCategory] = useState('학습');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddMission({
      id: 'm_' + Date.now(),
      title: title.trim(),
      reward: Number(reward),
      category,
      description: description.trim() || '오늘의 학급 수행 미션입니다.',
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            <CheckCircle2 className="text-purple" size={22} />
            새 미션 / 오늘의 할 일 추가
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">미션 제목</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 독서록 1편 작성 후 제출"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">보상 금액 (코인)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={reward}
                  onChange={(e) => setReward(Math.max(1, Number(e.target.value)))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">카테고리</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="학습">학습</option>
                  <option value="인성">인성/태도</option>
                  <option value="당번">당번/청소</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">미션 세부 설명</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="학생들이 미션을 수행할 때 참고할 가이드를 적어주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} /> 미션 추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
