import React, { useState } from 'react';
import { X, ShoppingBag, Plus } from 'lucide-react';

export default function StoreModal({ isOpen, onClose, onAddStoreItem }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(300);
  const [category, setCategory] = useState('쿠폰');
  const [icon, setIcon] = useState('🎟️');
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddStoreItem({
      id: 'st_' + Date.now(),
      name: name.trim(),
      price: Number(price),
      category,
      icon: icon || '🎟️',
      stock: Number(stock),
      description: description.trim() || '학급 상점 상품입니다.',
    });

    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            <ShoppingBag className="text-amber" size={22} />
            새 상점 상품 / 쿠폰 등록
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">상품 / 쿠폰 명칭</label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 10분 자율 게임 이용권"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">가격 (코인)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(Math.max(1, Number(e.target.value)))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">종류</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="쿠폰">쿠폰</option>
                  <option value="물건">물건/간식</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">아이콘</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ textAlign: 'center' }}
                  placeholder="예: 🎟️"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">수량 (재고)</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={stock}
                onChange={(e) => setStock(Math.max(1, Number(e.target.value)))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">상품 설명</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="혜택 이용 방법 및 사용 조건에 대해 적어주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-gold">
              <Plus size={16} /> 상품 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
