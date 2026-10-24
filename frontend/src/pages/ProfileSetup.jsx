import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import * as api from '../api';
import LoadingOverlay from '../components/LoadingOverlay';

const DEPARTMENT_SUBJECTS = {
  Science: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
  Commercial: ['Commerce', 'Accounting', 'Economics', 'Mathematics'],
  Art: ['Government', 'Literature in English', 'Economics', 'History', 'Geography', 'Hausa', 'Igbo', 'French', 'Music', 'Art'],
};

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, saveUser } = useAuth();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [personal, setPersonal] = useState({
    name: user?.name || '',
    phone: '',
    classLevel: '',
    gender: '',
    age: '',
    state: '',
    lga: '',
  });
  const [department, setDepartment] = useState(null);
  const [subjects, setSubjects] = useState(['English']);

  const goToStep = (n) => {
    if (n === 2) {
      if (personal.name.trim().length < 3) { addToast('Please enter your full name (at least 3 characters)', 'warning'); return; }
      if (!personal.classLevel) { addToast('Please select your class level', 'warning'); return; }
    }
    if (n === 3) {
      if (!department) { addToast('Please select your department first', 'warning'); return; }
      setSubjects(['English']);
    }
    setStep(n);
  };

  const toggleSubject = (sub) => {
    if (sub === 'English') return;
    setSubjects((prev) => {
      if (prev.includes(sub)) return prev.filter(s => s !== sub);
      if (prev.length >= 4) { addToast('You can only select 4 subjects. Deselect one first.', 'warning'); return prev; }
      return [...prev, sub];
    });
  };

  const handleComplete = async () => {
    if (subjects.length !== 4) { addToast('Please select exactly 4 subjects', 'warning'); return; }
    setLoading(true);
    try {
      await api.completeProfile({
        full_name: personal.name.trim(),
        phone_number: personal.phone || '',
        class_level: personal.classLevel,
        gender: personal.gender || null,
        age: personal.age ? parseInt(personal.age) : null,
        department,
        state: personal.state || null,
        local_government: personal.lga || null,
        subjects,
      });
      addToast('Profile setup complete! Welcome to EduLab ExamPrep!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Setup failed: ' + err.message, 'error');
    }
    setLoading(false);
  };

  const StepIndicator = () => (
    <div className="setup-steps">
      {[1, 2, 3].map((n, i) => (
        <><div key={n} className={`setup-step${step === n ? ' active' : step > n ? ' completed' : ''}`} id={`step-ind-${n}`}>
          <div className="step-number">{n}</div>
          <span>{['Personal Info', 'Department', 'Subjects'][i]}</span>
        </div>
        {i < 2 && <div key={`line-${n}`} className="setup-step-line"></div>}</>
      ))}
    </div>
  );

  return (
    <div className="profile-setup-container">
      {loading && <LoadingOverlay message="Completing your profile..." />}
      <div className="profile-setup-card">
        <div className="profile-setup-header">
          <div className="logo mb-2" style={{ justifyContent: 'center' }}>
            <img src="/images/edulab-icon.png" alt="EduLab ExamPrep logo" className="brand-logo" /><span>EduLab ExamPrep</span>
          </div>
          <h1>Complete Your Profile</h1>
          <p>Welcome, <strong>{user?.name || 'Student'}</strong>! Set up your profile to get personalized recommendations.</p>
        </div>

        <StepIndicator />

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="setup-step-content">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input type="text" value={personal.name} onChange={e => setPersonal(p => ({ ...p, name: e.target.value }))} required placeholder="Enter your full name" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={personal.phone} onChange={e => setPersonal(p => ({ ...p, phone: e.target.value }))} placeholder="08012345678" />
              </div>
              <div className="form-group">
                <label>Class Level <span className="required">*</span></label>
                <select value={personal.classLevel} onChange={e => setPersonal(p => ({ ...p, classLevel: e.target.value }))} required>
                  <option value="">Select Class</option>
                  <option>SS1</option><option>SS2</option><option>SS3</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select value={personal.gender} onChange={e => setPersonal(p => ({ ...p, gender: e.target.value }))}>
                  <option value="">Select Gender</option>
                  <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                </select>
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" value={personal.age} onChange={e => setPersonal(p => ({ ...p, age: e.target.value }))} min="10" max="100" placeholder="Your age" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <select value={personal.state} onChange={e => setPersonal(p => ({ ...p, state: e.target.value }))}>
                  <option value="">Select State</option>
                  {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Local Government</label>
                <input type="text" value={personal.lga} onChange={e => setPersonal(p => ({ ...p, lga: e.target.value }))} placeholder="Enter LGA" />
              </div>
            </div>
            <button className="btn btn-primary btn-block btn-lg mt-2" onClick={() => goToStep(2)}>
              Next <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        )}

        {/* Step 2: Department */}
        {step === 2 && (
          <div className="setup-step-content">
            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Choose Your Department</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 24 }}>This determines which subjects will be recommended to you</p>
            <div className="department-grid">
              {[
                { key: 'Science', icon: 'fa-flask', desc: 'Physics, Chemistry, Biology, Mathematics' },
                { key: 'Commercial', icon: 'fa-chart-line', desc: 'Commerce, Accounting, Economics, Mathematics' },
                { key: 'Art', icon: 'fa-palette', desc: 'Government, Literature, Economics, History & more' },
              ].map(d => (
                <div key={d.key} className={`department-card${department === d.key ? ' selected' : ''}`} onClick={() => setDepartment(d.key)}>
                  <div className="department-icon"><i className={`fas ${d.icon}`}></i></div>
                  <h3>{d.key}</h3><p>{d.desc}</p>
                </div>
              ))}
            </div>
            {department && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <p style={{ color: 'var(--success)', fontWeight: 600 }}><i className="fas fa-check-circle"></i> {department} selected</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-outline btn-block" onClick={() => setStep(1)}><i className="fas fa-arrow-left"></i> Back</button>
              <button className="btn btn-primary btn-block btn-lg" onClick={() => goToStep(3)} disabled={!department}>Next <i className="fas fa-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* Step 3: Subjects */}
        {step === 3 && (
          <div className="setup-step-content">
            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Select Your 4 JAMB Subjects</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 8 }}>English is compulsory. Choose 3 more from your department.</p>
            <div className={`selected-count${subjects.length === 4 ? ' complete' : ''}`}>
              <span>{subjects.length}</span>/4 subjects selected
            </div>
            <div className="subject-grid">
              <div className="subject-chip selected locked">
                <i className="fas fa-check-circle"></i> English <span className="chip-badge">Compulsory</span>
              </div>
              {(DEPARTMENT_SUBJECTS[department] || []).map(sub => (
                <div
                  key={sub}
                  className={`subject-chip${subjects.includes(sub) ? ' selected' : ''}`}
                  onClick={() => toggleSubject(sub)}
                >
                  <i className={`fas ${subjects.includes(sub) ? 'fa-check-circle' : 'fa-circle'}`}></i> {sub}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-outline btn-block" onClick={() => setStep(2)}><i className="fas fa-arrow-left"></i> Back</button>
              <button className="btn btn-primary btn-block btn-lg" onClick={handleComplete} disabled={subjects.length !== 4}>
                <i className="fas fa-check"></i> Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
