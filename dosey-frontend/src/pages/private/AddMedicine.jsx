import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Navbar from "../../components/Navbar";
import "./Home.css";

const COLORS = ['#708238', '#2563eb', '#dc2626', '#e08c2f', '#8b5cf6', '#06b6d4'];
const SHAPES = [
  { id: 'circle', label: 'Round', svg: <circle cx="10" cy="10" r="8" /> },
  { id: 'oval', label: 'Oval', svg: <ellipse cx="10" cy="10" rx="9" ry="6" /> },
  { id: 'capsule', label: 'Capsule', svg: <rect x="1" y="5" width="18" height="10" rx="5" /> },
  { id: 'square', label: 'Square', svg: <rect x="2" y="2" width="16" height="16" rx="3" /> },
  { id: 'diamond', label: 'Diamond', svg: <polygon points="10,2 18,10 10,18 2,10" /> },
];
const FREQ_OPTIONS = [
  { id: 'Every Day', label: 'Every Day' },
  { id: 'Specific Days', label: 'Specific Days' },
  { id: '1 interval', label: '1 Interval' },
  { id: 'As Needed', label: 'As Needed' },
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const UNITS = ['mg', 'ml', 'mcg', 'IU', '%', 'tablet', 'capsule', 'drops'];

const AddMedication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "", dosage: "", unit: "mg", frequency: "Every Day",
    specificDays: [], time: "", colorTag: "#708238", shape: "circle",
    stock: 0, refillThreshold: 5,
  });
  const [reminderTimes, setReminderTimes] = useState(['']);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchMedicine = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/medicines`, { headers: { Authorization: `Bearer ${token}` } });
        const med = res.data.find(m => String(m.id) === String(id));
        if (med) {
          setForm({
            name: med.name || "", dosage: med.dosage || "", unit: med.unit || "mg",
            frequency: med.frequency || "Every Day",
            specificDays: med.specificDays ? med.specificDays.split(',') : [],
            time: med.time || "", colorTag: med.colorTag || "#708238", shape: med.shape || "circle",
            stock: med.stock || 0, refillThreshold: med.refillThreshold || 5,
          });
          setReminderTimes(med.reminderTimes ? med.reminderTimes.split(',') : ['']);
        } else setError("Medicine not found.");
      } catch { setError("Failed to load medicine data."); }
      finally { setFetchingData(false); }
    };
    fetchMedicine();
  }, [id, isEditMode]);

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      specificDays: prev.specificDays.includes(day)
        ? prev.specificDays.filter(d => d !== day)
        : [...prev.specificDays, day],
    }));
  };

  const addReminder = () => setReminderTimes(prev => [...prev, '']);
  const removeReminder = (i) => setReminderTimes(prev => prev.filter((_, idx) => idx !== i));
  const updateReminder = (i, val) => setReminderTimes(prev => prev.map((t, idx) => idx === i ? val : t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.name.trim()) { setError("Medicine name is required."); return; }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        specificDays: form.specificDays.join(','),
        reminderTimes: reminderTimes.filter(Boolean).join(','),
      };
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/medicines/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess("Medicine updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/medicines", payload, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess("Medicine saved successfully!");
      }
      setTimeout(() => navigate("/medicines"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || (isEditMode ? "Failed to update." : "Failed to add medicine."));
    } finally { setLoading(false); }
  };

  const inputStyle = { border: '1.5px solid #d5ddc8', borderRadius: '10px', padding: '8px 12px', fontSize: '0.9rem', fontFamily: "'Quicksand', sans-serif", fontWeight: '600', background: '#fafaf7', outline: 'none', width: '100%' };
  const labelStyle = { fontSize: '0.82rem', fontWeight: '700', color: '#4B5320', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' };
  const sectionStyle = { background: '#fff', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.2rem', boxShadow: '0 2px 12px rgba(112,130,56,0.08)' };

  if (fetchingData) return (
    <div style={{ minHeight: '100vh', background: '#f2f4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Quicksand', sans-serif" }}>
      <div className="text-center">
        <div className="spinner-border" style={{ color: '#708238', width: '2.5rem', height: '2.5rem' }} role="status" />
        <p className="mt-3 fw-bold" style={{ color: '#708238' }}>Loading...</p>
      </div>
    </div>
  );

  const selectedColor = form.colorTag;

  return (
    <div style={{ minHeight: '100vh', background: '#f2f4ef', fontFamily: "'Quicksand', sans-serif" }}>
      <Navbar user={user} />

      <div className="container py-4" style={{ maxWidth: '680px' }}>
        {/* Breadcrumb */}
        <button onClick={() => navigate('/medicines')} style={{ background: 'none', border: 'none', color: '#708238', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1rem', fontFamily: "'Quicksand', sans-serif", padding: 0 }}>
          <ArrowLeft size={15} /> Back to Dashboard
        </button>

        <h3 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '4px' }}>
          {isEditMode ? 'Edit Medicine' : 'Add New Medicine'}
        </h3>
        <p style={{ color: '#8a9a5e', fontWeight: '500', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Track your daily wellness by editing your medication details below.
        </p>

        {/* Alerts */}
        {error && <div style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', borderRadius: '12px', padding: '10px 16px', color: '#b91c1c', fontWeight: '600', marginBottom: '1rem', fontSize: '0.88rem' }}>⚠️ {error}</div>}
        {success && <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '10px 16px', color: '#15803d', fontWeight: '600', marginBottom: '1rem', fontSize: '0.88rem' }}>✅ {success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Medicine Name */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Medicine Name</label>
            <input style={inputStyle} name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ibuprofen, Vitamin D" required />
          </div>

          {/* Dosage + Unit */}
          <div style={sectionStyle}>
            <div className="row g-3">
              <div className="col-7">
                <label style={labelStyle}>Dosage Strength</label>
                <input style={inputStyle} name="dosage" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} placeholder="e.g. 500" />
              </div>
              <div className="col-5">
                <label style={labelStyle}>Unit</label>
                <select style={inputStyle} value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Frequency & Schedule */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Frequency & Schedule</label>
            <p style={{ color: '#8a9a5e', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.75rem' }}>How often do you take it?</p>
            <div className="d-flex gap-2 flex-wrap mb-3">
              {FREQ_OPTIONS.map(opt => (
                <button key={opt.id} type="button" onClick={() => setForm({ ...form, frequency: opt.id })}
                  style={{ background: form.frequency === opt.id ? '#708238' : '#f2f4ef', color: form.frequency === opt.id ? '#fff' : '#708238', border: 'none', borderRadius: '10px', padding: '7px 16px', fontWeight: '700', fontSize: '0.83rem', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", transition: '0.2s' }}>
                  {opt.label}
                </button>
              ))}
            </div>
            {form.frequency === 'Specific Days' && (
              <div className="d-flex gap-2 flex-wrap mt-2">
                {DAYS.map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    style={{ background: form.specificDays.includes(day) ? '#e9edc9' : '#f7f9f3', color: form.specificDays.includes(day) ? '#4B5320' : '#8a9a5e', border: form.specificDays.includes(day) ? '2px solid #708238' : '1.5px solid #d5ddc8', borderRadius: '8px', padding: '5px 10px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}>
                    {day}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reminders */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Reminders</label>
            {reminderTimes.map((t, i) => (
              <div key={i} className="d-flex align-items-center gap-2 mb-2">
                <input type="time" value={t} onChange={e => updateReminder(i, e.target.value)}
                  style={{ ...inputStyle, flex: 1 }} />
                <select style={{ ...inputStyle, width: '130px' }}>
                  <option>Before Meal</option>
                  <option>After Meal</option>
                  <option>With Meal</option>
                  <option>Any Time</option>
                </select>
                {reminderTimes.length > 1 && (
                  <button type="button" onClick={() => removeReminder(i)}
                    style={{ background: '#fff0f0', color: '#dc2626', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addReminder}
              style={{ color: '#708238', background: 'none', border: '1.5px dashed #a3b464', borderRadius: '10px', padding: '7px 14px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Quicksand', sans-serif", marginTop: '6px', width: '100%', justifyContent: 'center' }}>
              <Plus size={14} /> Add another time slot
            </button>
          </div>

          {/* Appearance */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Appearance</label>
            <div className="row g-3">
              <div className="col-6">
                <label style={{ ...labelStyle, textTransform: 'none', fontSize: '0.78rem', marginBottom: '8px' }}>Color Tag</label>
                <div className="d-flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, colorTag: c })}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', background: c, border: form.colorTag === c ? `3px solid #3a4a1e` : '2px solid transparent', cursor: 'pointer', boxShadow: form.colorTag === c ? '0 0 0 2px #fff inset' : 'none', transition: '0.15s' }} />
                  ))}
                </div>
              </div>
              <div className="col-6">
                <label style={{ ...labelStyle, textTransform: 'none', fontSize: '0.78rem', marginBottom: '8px' }}>Shape</label>
                <div className="d-flex gap-2 flex-wrap">
                  {SHAPES.map(s => (
                    <button key={s.id} type="button" onClick={() => setForm({ ...form, shape: s.id })}
                      title={s.label}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', background: form.shape === s.id ? '#e9edc9' : '#f2f4ef', border: form.shape === s.id ? '2px solid #708238' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.15s' }}>
                      <svg width="20" height="20" fill={selectedColor} viewBox="0 0 20 20">{s.svg}</svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stock Management */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Stock Management</label>
            <p style={{ color: '#8a9a5e', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.75rem' }}>Track your supply and get refill alerts.</p>
            <div className="row g-3">
              <div className="col-6">
                <label style={{ ...labelStyle, textTransform: 'none', fontSize: '0.78rem', marginBottom: '8px' }}>Current Stock (Units)</label>
                <input type="number" style={inputStyle} value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} placeholder="e.g. 30" />
              </div>
              <div className="col-6">
                <label style={{ ...labelStyle, textTransform: 'none', fontSize: '0.78rem', marginBottom: '8px' }}>Refill Alert Threshold</label>
                <input type="number" style={inputStyle} value={form.refillThreshold} onChange={e => setForm({ ...form, refillThreshold: parseInt(e.target.value) || 0 })} placeholder="e.g. 5" />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ ...sectionStyle, background: '#e9edc9', border: '1.5px dashed #a3b464' }}>
            <label style={labelStyle}>Preview</label>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${selectedColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${selectedColor}50` }}>
                <svg width="24" height="24" fill={selectedColor} viewBox="0 0 20 20">
                  {SHAPES.find(s => s.id === form.shape)?.svg}
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: '800', color: '#3a4a1e', fontSize: '1rem' }}>{form.name || 'Medicine Name'}</div>
                <div style={{ color: '#708238', fontWeight: '600', fontSize: '0.83rem' }}>
                  {[form.dosage, form.unit].filter(Boolean).join(' ')}
                  {form.frequency && ` · ${form.frequency}`}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3">
            <button type="button" onClick={() => navigate('/medicines')} disabled={loading}
              style={{ flex: 1, background: '#fff', border: '2px solid #d5ddc8', color: '#708238', borderRadius: '14px', padding: '12px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ flex: 2, background: loading ? '#a3b464' : 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', border: 'none', borderRadius: '14px', padding: '12px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(112,130,56,0.4)', fontFamily: "'Quicksand', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <><span className="spinner-border spinner-border-sm" /> {isEditMode ? 'Updating...' : 'Saving...'}</> : <><Save size={16} /> {isEditMode ? 'Update Medicine' : 'Save Medicine'}</>}
            </button>
          </div>
          <p style={{ textAlign: 'center', color: '#a3b464', fontSize: '0.78rem', fontWeight: '500', marginTop: '1rem' }}>
            Having trouble saving your pill? <button type="button" style={{ background: 'none', border: 'none', color: '#708238', fontWeight: '700', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", padding: 0 }}>Ask us anything →</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddMedication;