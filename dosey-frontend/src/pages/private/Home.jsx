import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus, Flame, Target, Clock, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';
import './Home.css';

const TIPS = [
  "💡 Taking medicine at the same time each day helps build a healthy habit.",
  "💡 Staying hydrated helps medications absorb better.",
  "💡 Never skip doses — even if you feel better.",
  "💡 Keep a list of all your medications for doctor visits.",
  "💡 Store medicines away from heat, light, and moisture.",
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [history, setHistory] = useState([]);
  const [takingId, setTakingId] = useState(null);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { navigate('/login'); return; }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [medRes, histRes] = await Promise.all([
          api.get('/medicines'),
          api.get('/history'),
        ]);
        if (Array.isArray(medRes.data)) setMedicines(medRes.data);
        if (Array.isArray(histRes.data)) setHistory(histRes.data);
      } catch (err) { console.error(err); }
    };
    fetchAll();
  }, []);

  const handleMarkTaken = async (med) => {
    setTakingId(med.id);
    try {
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toTimeString().slice(0, 5);
      const res = await api.post('/history', {
        medicineName: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        takenAt: today,
        takenTime: med.time || nowTime,
        medicineId: med.id
      });
      if (res.status === 201) {
        setHistory(prev => [res.data, ...prev]);
        toast.success(`${med.name} logged! ✅`, { style: { borderRadius: '12px', background: '#708238', color: '#fff' } });
      }
    } catch { toast.error('Something went wrong'); }
    finally { setTakingId(null); }
  };

  // Compute stats
  const todayStr = new Date().toISOString().split('T')[0];
  const takenToday = history.filter(h => h.takenAt === todayStr);
  const adherence = medicines.length > 0 ? Math.round((takenToday.length / medicines.length) * 100) : 0;

  // Streak: count consecutive days with at least one dose
  const computeStreak = () => {
    if (history.length === 0) return 0;
    const dates = [...new Set(history.map(h => h.takenAt))].sort().reverse();
    let streak = 0;
    const check = new Date();
    for (const d of dates) {
      const checkStr = check.toISOString().split('T')[0];
      if (d === checkStr) { streak++; check.setDate(check.getDate() - 1); }
      else break;
    }
    return streak;
  };
  const streak = computeStreak();

  // Today's meds sorted by time
  const todayMeds = [...medicines].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const takenTodayIds = new Set(takenToday.map(h => h.medicineId).filter(Boolean));
  const upNext = todayMeds.find(m => !takenTodayIds.has(m.id));
  const restOfDay = todayMeds.filter(m => m.id !== upNext?.id && !takenTodayIds.has(m.id));
  const missed = todayMeds.filter(m => {
    if (!m.time || takenTodayIds.has(m.id)) return false;
    const [h, min] = m.time.split(':').map(Number);
    const medMinutes = h * 60 + min;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return medMinutes < nowMinutes - 30;
  });

  const getHour = () => { const h = new Date().getHours(); return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'; };
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  const getMedColor = (med) => med.colorTag || '#708238';

  if (!user) return null;

  const statCard = (icon, label, value, sub, color = '#708238') => (
    <div className="card border-0 h-100" style={{ borderRadius: '16px', boxShadow: '0 3px 16px rgba(112,130,56,0.1)', overflow: 'hidden' }}>
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
      <div className="card-body p-3">
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#8a9a5e', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#3a4a1e', lineHeight: 1.2 }}>{value}</div>
            {sub && <div style={{ fontSize: '0.78rem', color: '#8a9a5e', fontWeight: '600' }}>{sub}</div>}
          </div>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}18`, display: 'flex', 
          alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f2f4ef', fontFamily: "'Quicksand', sans-serif" }}>
      <Navbar user={user} />

      <div className="container-lg py-4" style={{ maxWidth: '1100px' }}>

        {/* Greeting row */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h3 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '2px' }}>
              Good {getHour()}, {firstName}! ✨
            </h3>
            <p style={{ color: '#8a9a5e', fontWeight: '500', marginBottom: 0 }}>
              {takenToday.length === 0
                ? "You haven't logged any doses today yet."
                : `You've taken ${takenToday.length} dose${takenToday.length > 1 ? 's' : ''} today. Keep it up!`}
            </p>
          </div>
          {upNext && (
            <button
              onClick={() => handleMarkTaken(upNext)}
              disabled={!!takingId}
              style={{ background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 20px', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(112,130,56,0.4)', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}
            >
              {takingId ? <span className="spinner-border spinner-border-sm" /> : <CheckCircle size={16} />}
              Log Pill Now
            </button>
          )}
        </div>

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-4">
            {statCard(<Target size={18} style={{ color: '#708238' }} />, 'Today\'s Progress', `${adherence}%`, `${takenToday.length}/${medicines.length} taken`, '#708238')}
          </div>
          <div className="col-4">
            {statCard(<Flame size={18} style={{ color: '#e08c2f' }} />, 'Current Streak', `${streak} Days`, streak > 0 ? 'Keep it up! 🔥' : 'Start today!', '#e08c2f')}
          </div>
          <div className="col-4">
            {statCard(<AlertCircle size={18} style={{ color: '#dc2626' }} />, 'Refills Needed', medicines.filter(m => (m.stock || 0) <= (m.refillThreshold || 5)).length, 'Check cabinet', '#dc2626')}
          </div>
        </div>

        <div className="row g-4">
          {/* LEFT COLUMN */}
          <div className="col-12 col-lg-7">

            {/* Up Next */}
            <div className="card border-0 mb-4" style={{ borderRadius: '18px', boxShadow: '0 4px 20px rgba(112,130,56,0.12)', overflow: 'hidden' }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #708238, #a3b464)' }} />
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 style={{ fontWeight: '800', color: '#3a4a1e', margin: 0, fontSize: '1rem' }}>⏰ Up Next</h6>
                  {upNext?.time && (
                    <span style={{ background: '#e9edc9', color: '#4B5320', borderRadius: '8px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: '700' }}>🕐 {upNext.time}</span>
                  )}
                </div>

                {upNext ? (
                  <div style={{ background: '#f7f9f3', borderRadius: '14px', padding: '1rem 1.2rem' }}>
                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: `${getMedColor(upNext)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${getMedColor(upNext)}40` }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: getMedColor(upNext) }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', color: '#3a4a1e', fontSize: '1.05rem' }}>{upNext.name}</div>
                          <div style={{ color: '#8a9a5e', fontWeight: '600', fontSize: '0.85rem' }}>
                            {[upNext.dosage, upNext.unit].filter(Boolean).join(' ')}
                            {upNext.frequency && ` · ${upNext.frequency}`}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleMarkTaken(upNext)}
                          disabled={takingId === upNext.id}
                          style={{ background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}
                        >
                          {takingId === upNext.id ? <span className="spinner-border spinner-border-sm" /> : '✅ Mark as Taken'}
                        </button>
                        <button style={{ background: '#e9edc9', color: '#708238', border: 'none', borderRadius: '10px', padding: '8px 14px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}>
                          Skip
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#f0fdf4', border: '1.5px solid #a3b464', borderRadius: '14px', padding: '1rem 1.2rem', textAlign: 'center', color: '#4B5320', fontWeight: '600' }}>
                    🎉 All caught up for now! Great job.
                  </div>
                )}
              </div>
            </div>

            {/* Missed Doses */}
            {missed.length > 0 && (
              <div className="card border-0 mb-4" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 3px 14px rgba(220,38,38,0.08)' }}>
                <div style={{ height: '4px', background: '#dc2626' }} />
                <div className="card-body px-4 py-3">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <AlertCircle size={18} style={{ color: '#dc2626' }} />
                    <h6 style={{ fontWeight: '800', color: '#dc2626', margin: 0 }}>Missed Doses</h6>
                  </div>
                  {missed.map(med => (
                    <div key={med.id} className="d-flex align-items-center justify-content-between py-2" style={{ borderBottom: '1px solid #fecaca' }}>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getMedColor(med), flexShrink: 0 }} />
                        <span style={{ fontWeight: '700', color: '#3a4a1e', fontSize: '0.9rem' }}>{med.name}</span>
                        <span style={{ color: '#8a9a5e', fontSize: '0.82rem', fontWeight: '600' }}>{med.dosage}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: '700' }}>⏰ {med.time}</span>
                        <button
                          onClick={() => handleMarkTaken(med)}
                          style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '4px 12px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}
                        >
                          Log Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of Day */}
            {restOfDay.length > 0 && (
              <div className="card border-0 mb-4" style={{ borderRadius: '18px', boxShadow: '0 3px 16px rgba(112,130,56,0.1)', overflow: 'hidden' }}>
                <div className="card-body p-4">
                  <h6 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '1rem', fontSize: '1rem' }}>🗓 Rest of the Day</h6>
                  <div className="d-flex flex-column gap-2">
                    {restOfDay.map(med => (
                      <div key={med.id} className="d-flex align-items-center justify-content-between p-3" style={{ background: '#f7f9f3', borderRadius: '12px' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getMedColor(med), flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: '700', color: '#3a4a1e', fontSize: '0.9rem' }}>{med.name}</div>
                            <div style={{ color: '#8a9a5e', fontSize: '0.78rem', fontWeight: '600' }}>
                              {[med.dosage, med.unit].filter(Boolean).join(' ')}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {med.time && <span style={{ color: '#4B5320', fontWeight: '700', fontSize: '0.82rem' }}>{med.time}</span>}
                          <button
                            onClick={() => handleMarkTaken(med)}
                            disabled={takingId === med.id}
                            style={{ background: '#e9edc9', color: '#4B5320', border: 'none', borderRadius: '8px', padding: '4px 12px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}
                          >
                            {takingId === med.id ? <span className="spinner-border spinner-border-sm" /> : 'Take'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {medicines.length === 0 && (
              <div className="card border-0" style={{ borderRadius: '18px', boxShadow: '0 3px 16px rgba(112,130,56,0.1)', padding: '2.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💊</div>
                <p style={{ fontWeight: '700', color: '#3a4a1e', marginBottom: '0.25rem' }}>No medicines added yet</p>
                <p style={{ color: '#8a9a5e', fontWeight: '500', fontSize: '0.9rem' }}>Add your first medicine to get started</p>
                <button
                  onClick={() => navigate('/add-medication')}
                  style={{ background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", margin: '0 auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={15} /> Add Medicine
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-12 col-lg-5">
            {/* Daily Tip */}
            <div className="card border-0 mb-4" style={{ borderRadius: '18px', boxShadow: '0 3px 16px rgba(112,130,56,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #2563eb, #60a5fa)' }} />
              <div className="card-body p-4">
                <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Daily Tip</div>
                <p style={{ color: '#3a4a1e', fontWeight: '600', fontSize: '0.9rem', marginBottom: 0, lineHeight: 1.6 }}>{tip}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card border-0 mb-4" style={{ borderRadius: '18px', boxShadow: '0 3px 16px rgba(112,130,56,0.1)' }}>
              <div className="card-body p-4">
                <h6 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '1rem', fontSize: '1rem' }}>Go-to Actions</h6>
                {[
                  { label: 'Add Medicine', sub: 'Track a new prescription', icon: '➕', path: '/add-medication', color: '#708238' },
                  { label: 'View History', sub: 'See past doses', icon: '📋', path: '/history', color: '#2563eb' },
                  { label: 'My Cabinet', sub: 'Manage all medicines', icon: '💊', path: '/medicines', color: '#e08c2f' },
                ].map(action => (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    style={{ width: '100%', background: '#f7f9f3', border: 'none', borderRadius: '12px', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", transition: '0.2s', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e9edc9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f7f9f3'}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{action.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#3a4a1e', fontSize: '0.88rem' }}>{action.label}</div>
                      <div style={{ color: '#8a9a5e', fontSize: '0.78rem', fontWeight: '600' }}>{action.sub}</div>
                    </div>
                    <ChevronRight size={16} style={{ color: '#a3b464' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Today's taken */}
            {takenToday.length > 0 && (
              <div className="card border-0" style={{ borderRadius: '18px', boxShadow: '0 3px 16px rgba(112,130,56,0.1)', overflow: 'hidden' }}>
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #10b981, #6ee7b7)' }} />
                <div className="card-body p-4">
                  <h6 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '1rem', fontSize: '1rem' }}>✅ Taken Today</h6>
                  {takenToday.slice(0, 4).map(entry => (
                    <div key={entry.id} className="d-flex align-items-center gap-2 mb-2">
                      <CheckCircle size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span style={{ fontWeight: '700', color: '#3a4a1e', fontSize: '0.88rem' }}>{entry.medicineName}</span>
                      {entry.takenTime && <span style={{ color: '#8a9a5e', fontSize: '0.78rem', fontWeight: '600', marginLeft: 'auto' }}>{entry.takenTime}</span>}
                    </div>
                  ))}
                  {takenToday.length > 4 && (
                    <button onClick={() => navigate('/history')} style={{ color: '#708238', background: 'none', border: 'none', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', padding: '4px 0', fontFamily: "'Quicksand', sans-serif" }}>
                      +{takenToday.length - 4} more → View History
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;