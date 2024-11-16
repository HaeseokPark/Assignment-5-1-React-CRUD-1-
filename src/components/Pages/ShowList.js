import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [inputName, setInputName] = useState('');
  const [inputJob, setInputJob] = useState('');
  const [inputGender, setInputGender] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    fetch('./test.json')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('JSON 데이터 가져오기 오류:', error));
  }, []);

  const handleAddOrUpdateEmployee = () => {
    if (!inputName || !inputJob || !inputGender) return;

    if (editIndex !== null) {
      const updatedEmployees = employees.map((employee, index) =>
        index === editIndex
          ? { ...employee, name: inputName, job: inputJob, gender: inputGender }
          : employee
      );
      setEmployees(updatedEmployees);
      setEditIndex(null);
    } else {
      const newEmployee = {
        id: (employees.length + 1).toString(),
        name: inputName,
        job: inputJob,
        gender: inputGender,
      };
      setEmployees([...employees, newEmployee]);
    }

    setInputName('');
    setInputJob('');
    setInputGender('');
    setShowModal(false); // 모달 닫기
  };

  const handleEditEmployee = (index) => {
    const employee = employees[index];
    setInputName(employee.name);
    setInputJob(employee.job);
    setInputGender(employee.gender);
    setEditIndex(index);
    setShowModal(true); // 모달 열기
  };

  const handleDeleteEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    setEmployees(updatedEmployees);
  };

  return (
    <div className="container mt-5">
      <h1>직원 관리 시스템</h1>
      <button className="btn btn-primary mb-3" onClick={() => { setShowModal(true); setEditIndex(null); }}>
        직원 추가
      </button>
      <ul className="list-group">
        {employees.map((employee, index) => (
          <li key={employee.id} className="list-group-item d-flex justify-content-between align-items-center">
            {employee.name} - {employee.job} - {employee.gender}
            <div>
              <button className="btn btn-warning btn-sm" onClick={() => handleEditEmployee(index)}>수정</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEmployee(index)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editIndex !== null ? '직원 수정' : '직원 추가'}</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="이름"
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={inputJob}
                  onChange={(e) => setInputJob(e.target.value)}
                  placeholder="직업"
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={inputGender}
                  onChange={(e) => setInputGender(e.target.value)}
                  placeholder="성별"
                  className="form-control mb-2"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  닫기
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddOrUpdateEmployee}>
                  {editIndex !== null ? '수정하기' : '추가하기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
