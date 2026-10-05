import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Plus, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExcelModal({ isOpen, onClose, onImportStudents, onAddStudent }) {
  const [tab, setTab] = useState('excel'); // 'excel' | 'manual'
  const [previewData, setPreviewData] = useState([]);
  const [singleName, setSingleName] = useState('');
  const [singleNumber, setSingleNumber] = useState('');
  const [singleGender, setSingleGender] = useState('남');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const formatted = data.map((row, index) => ({
          id: 's_' + Date.now() + '_' + index,
          number: Number(row['번호'] || row['student_number'] || index + 1),
          name: String(row['이름'] || row['name'] || `학생${index + 1}`).trim(),
          gender: String(row['성별'] || row['gender'] || '남').trim().includes('여') ? '여' : '남',
          balance: 0,
          exp: 0,
          myCoupons: [],
        }));

        if (formatted.length === 0) {
          setErrorMsg('엑셀 파일에서 읽을 수 있는 데이터가 없습니다.');
        } else {
          setPreviewData(formatted);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('엑셀 파일을 읽는 중 오류가 발생했습니다. 양식을 확인해 주세요.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const sample = [
      { 번호: 1, 이름: '강민준', 성별: '남' },
      { 번호: 2, 이름: '김서연', 성별: '여' },
      { 번호: 3, 이름: '김도윤', 성별: '남' },
      { 번호: 4, 이름: '김지아', 성별: '여' },
    ];
    const ws = XLSX.utils.json_to_sheet(sample);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '학생명단');
    XLSX.writeFile(wb, '학급학생명단_양식.xlsx');
  };

  const handleConfirmImport = () => {
    if (previewData.length > 0) {
      onImportStudents(previewData);
      onClose();
    }
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!singleName.trim() || !singleNumber) {
      setErrorMsg('번호와 이름을 입력해 주세요.');
      return;
    }
    onAddStudent({
      id: 's_' + Date.now(),
      number: Number(singleNumber),
      name: singleName.trim(),
      gender: singleGender,
      balance: 0,
      exp: 0,
      myCoupons: [],
    });
    setSingleName('');
    setSingleNumber('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">
            <FileSpreadsheet className="text-emerald" size={22} />
            학생 명단 추가 / 엑셀 업로드
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <button
              className={`btn btn-sm ${tab === 'excel' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTab('excel')}
            >
              <Upload size={14} /> 엑셀 파일 일괄 등록
            </button>
            <button
              className={`btn btn-sm ${tab === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTab('manual')}
            >
              <Plus size={14} /> 개별 직접 등록
            </button>
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#fb7185',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          {tab === 'excel' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  border: '2px dashed var(--border-glow)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.4)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="excel-file-input"
                />
                <label htmlFor="excel-file-input" style={{ cursor: 'pointer', display: 'block' }}>
                  <Upload size={36} color="#818cf8" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    클릭하여 엑셀 파일(.xlsx)을 업로드하세요
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    항목 헤더: [번호, 이름, 성별]
                  </p>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  미리 업로드 양식이 필요하신가요?
                </span>
                <button className="btn btn-secondary btn-sm" onClick={handleDownloadTemplate}>
                  <FileSpreadsheet size={14} /> 샘플 엑셀 서식 다운로드
                </button>
              </div>

              {previewData.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#34d399' }}>
                    ✅ 업로드 준비 완료 ({previewData.length}명)
                  </h4>
                  <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    <table className="student-table">
                      <thead>
                        <tr>
                          <th>번호</th>
                          <th>이름</th>
                          <th>성별</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((s, idx) => (
                          <tr key={idx}>
                            <td>{s.number}</td>
                            <td>{s.name}</td>
                            <td>{s.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleManualAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">출석 번호</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="예: 1"
                  value={singleNumber}
                  onChange={(e) => setSingleNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">학생 이름</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 홍길동"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">성별</label>
                <select
                  className="form-select"
                  value={singleGender}
                  onChange={(e) => setSingleGender(e.target.value)}
                >
                  <option value="남">남학생</option>
                  <option value="여">여학생</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Plus size={16} /> 학생 등록하기
              </button>
            </form>
          )}
        </div>

        {tab === 'excel' && (
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button
              className="btn btn-emerald"
              onClick={handleConfirmImport}
              disabled={previewData.length === 0}
            >
              {previewData.length}명 일괄 덮어쓰기 등록
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
