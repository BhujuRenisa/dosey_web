import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, CheckCircle, Filter, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';
import './Home.css';

const SHAPE_SVG = {
    circle: <circle cx="10" cy="10" r="8" />,
    oval: <ellipse cx="10" cy="10" rx="9" ry="6" />,
    square: <rect x="2" y="2" width="16" height="16" rx="3" />,
    capsule: <rect x="1" y="5" width="18" height="10" rx="5" />,
    diamond: <polygon points="10,2 18,10 10,18 2,10" />,
};

const MedicineCabinet = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | daily | as-needed
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [takingId, setTakingId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const load = async () => {
            try {
                const [medRes, histRes] = await Promise.all([
                    api.get('/medicines'),
                    api.get('/history'),
                ]);
                if (Array.isArray(medRes.data)) setMedicines(medRes.data);
                if (Array.isArray(histRes.data)) setHistory(histRes.data);
            } catch (err) { console.error(err); }
        };
        load();
    }, []);

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            const res = await api.delete(`/medicines/${id}`);
            if (res.status === 200) {
                toast.success('Medicine removed', { style: { borderRadius: '12px', background: '#708238', color: '#fff' } });
                setMedicines(prev => prev.filter(m => m.id !== id));
            } else toast.error('Failed to delete');
        } catch { toast.error('Something went wrong'); }
        finally { setDeletingId(null); setConfirmDeleteId(null); }
    };

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
                toast.success(`${med.name} marked as taken! ✅`, { style: { borderRadius: '12px', background: '#708238', color: '#fff' } });
            }
        } catch { toast.error('Something went wrong'); }
        finally { setTakingId(null); }
    };

    // Stats
    const todayStr = new Date().toISOString().split('T')[0];
    const takenToday = history.filter(h => h.takenAt === todayStr);
    const adherence = medicines.length > 0 ? Math.round((takenToday.length / medicines.length) * 100) : 0;
    const takenTodayIds = new Set(takenToday.map(h => h.medicineId).filter(Boolean));

    // Frequency sorting logic
    const frequencyOrder = {
        'Every Day': 1,
        'Specific Days': 2,
        '1 interval': 3,
        'As Needed': 4,
    };

    const getFreqWeight = (freq) => {
        if (!freq) return 100;
        return frequencyOrder[freq] || 50;
    };

    const filtered = medicines
        .filter(m => {
            const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
            if (filter === 'daily') return matchSearch && (!m.frequency || !m.frequency.toLowerCase().includes('needed'));
            if (filter === 'as-needed') return matchSearch && m.frequency?.toLowerCase().includes('needed');
            return matchSearch;
        })
        .sort((a, b) => getFreqWeight(a.frequency) - getFreqWeight(b.frequency));

    const getMedColor = (med) => med.colorTag || '#708238';

    // Today's schedule - sort by time
    const todaySchedule = [...medicines].filter(m => m.time).sort((a, b) => a.time.localeCompare(b.time));

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#f2f4ef', fontFamily: "'Quicksand', sans-serif" }}>
            <Navbar user={user} />

            <div className="container-lg py-4" style={{ maxWidth: '1100px' }}>

                {/* Header */}
                <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
                    <div>
                        <h3 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '2px' }}>My Medicine Cabinet</h3>
                        <p style={{ color: '#8a9a5e', fontWeight: '500', marginBottom: 0 }}>This cabinet manages your daily medicine intake</p>
                    </div>
                    <button
                        onClick={() => navigate('/add-medication')}
                        style={{ background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 20px', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(112,130,56,0.35)', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}
                    >
                        <Plus size={16} /> Add New Medicine
                    </button>
                </div>

                {/* Stats chips */}
                <div className="d-flex gap-3 mb-4 flex-wrap">
                    {[
                        { label: 'Active Meds', value: medicines.length, color: '#708238', bg: '#e9edc9' },
                        { label: 'Active Mode', value: `${adherence}%`, color: '#2563eb', bg: '#dbeafe', sub: '↑ Adherence' },
                        { label: 'Refills Needed', value: medicines.filter(m => (m.stock || 0) <= (m.refillThreshold || 5)).length, color: '#e08c2f', bg: '#fef3c7' },
                    ].map(stat => (
                        <div key={stat.label} style={{ background: '#fff', borderRadius: '14px', padding: '1rem 1.5rem', boxShadow: '0 3px 14px rgba(112,130,56,0.08)', minWidth: '150px' }}>
                            <div style={{ fontSize: '0.72rem', color: '#8a9a5e', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: stat.color, lineHeight: 1.2 }}>{stat.value}</div>
                            {stat.sub && <div style={{ fontSize: '0.75rem', color: stat.color, fontWeight: '600' }}>{stat.sub}</div>}
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    {/* LEFT: Meds list */}
                    <div className="col-12 col-lg-8">
                        <div className="card border-0" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(112,130,56,0.1)', overflow: 'hidden' }}>
                            <div style={{ height: '4px', background: 'linear-gradient(90deg, #708238, #a3b464)' }} />
                            <div className="d-flex align-items-center justify-content-between p-4 pb-3 flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-2">
                                    <h6 style={{ fontWeight: '800', color: '#3a4a1e', margin: 0 }}>Active Medications</h6>
                                    <span style={{ fontSize: '0.72rem', background: '#f2f4ef', color: '#708238', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' }}>
                                        <ArrowUpDown size={12} className="me-1" /> Frequency
                                    </span>
                                </div>
                                <div className="d-flex gap-2 align-items-center flex-wrap">
                                    {['all', 'daily', 'as-needed'].map(f => (
                                        <button key={f} onClick={() => setFilter(f)}
                                            style={{ background: filter === f ? '#708238' : '#f2f4ef', color: filter === f ? '#fff' : '#708238', border: 'none', borderRadius: '8px', padding: '4px 12px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif" }}
                                        >
                                            {f === 'all' ? 'All' : f === 'daily' ? 'Daily' : 'As Needed'}
                                        </button>
                                    ))}
                                    <div style={{ position: 'relative' }}>
                                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8a9a5e' }} />
                                        <input
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Search meds..."
                                            style={{ paddingLeft: '30px', border: '1.5px solid #d5ddc8', borderRadius: '10px', fontSize: '0.83rem', fontFamily: "'Quicksand', sans-serif", fontWeight: '600', background: '#fafaf7', outline: 'none', width: '150px' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 pb-4">
                                {filtered.length === 0 ? (
                                    <div className="text-center py-5" style={{ color: '#8a9a5e' }}>
                                        <p style={{ fontWeight: '600' }}>{search ? 'No meds match' : 'Cabinet is empty'}</p>
                                    </div>
                                ) : (
                                    filtered.map(med => {
                                        const color = getMedColor(med);
                                        const taken = takenTodayIds.has(med.id);
                                        return (
                                            <div key={med.id} style={{ background: taken ? '#f0fdf4' : '#f7f9f3', borderRadius: '14px', padding: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: taken ? '1.5px solid #a3e4b4' : '1.5px solid transparent' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${color}40` }}>
                                                    <svg width="20" height="20" fill={color} viewBox="0 0 20 20">{SHAPE_SVG[med.shape || 'circle']}</svg>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '800', color: '#3a4a1e', fontSize: '0.95rem' }}>{med.name}</div>
                                                    <div style={{ color: '#8a9a5e', fontWeight: '600', fontSize: '0.82rem' }}>
                                                        {[med.dosage, med.unit].filter(Boolean).join(' ')} · {med.frequency}
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    {!taken && (
                                                        <button onClick={() => handleMarkTaken(med)} disabled={takingId === med.id} style={{ background: '#708238', color: '#fff', border: 'none', borderRadius: '8px', padding: '5px 12px', fontWeight: '700', fontSize: '0.78rem' }}>Take</button>
                                                    )}
                                                    <button onClick={() => navigate(`/edit-medication/${med.id}`)} style={{ background: '#e9edc9', color: '#708238', border: 'none', borderRadius: '8px', width: '32px', height: '32px' }}><Pencil size={13} className="m-auto" /></button>
                                                    <button onClick={() => setConfirmDeleteId(med.id)} style={{ background: '#fff0f0', color: '#dc2626', border: 'none', borderRadius: '8px', width: '32px', height: '32px' }}><Trash2 size={13} className="m-auto" /></button>
                                                </div>
                                                {
                                                    confirmDeleteId === med.id && (
                                                        <div className="ms-2 d-flex gap-1">
                                                            <button onClick={() => handleDelete(med.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.7rem', padding: '4px 8px' }}>Confirm</button>
                                                            <button onClick={() => setConfirmDeleteId(null)} style={{ background: '#ccc', border: 'none', borderRadius: '8px', fontSize: '0.7rem', padding: '4px 8px' }}>No</button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="card border-0 mb-3" style={{ borderRadius: '18px', boxShadow: '0 3px 16px rgba(112,130,56,0.1)', overflow: 'hidden' }}>
                            <div style={{ height: '4px', background: 'linear-gradient(90deg, #2563eb, #60a5fa)' }} />
                            <div className="card-body p-4">
                                <h6 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '1rem' }}>Today's Schedule</h6>
                                {todaySchedule.map(med => (
                                    <div key={med.id} className="d-flex align-items-center gap-2 mb-2">
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getMedColor(med) }} />
                                        <div style={{ flex: 1, fontWeight: '700', color: '#3a4a1e', fontSize: '0.85rem' }}>{med.name}</div>
                                        <span style={{ fontWeight: '700', fontSize: '0.8rem', color: '#4B5320' }}>{med.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MedicineCabinet;
