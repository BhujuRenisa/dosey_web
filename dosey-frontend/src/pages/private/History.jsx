import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill, Pencil, Trash2, Save, X, History, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import './Home.css';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [savingId, setSavingId] = useState(null);

    const token = localStorage.getItem('token');

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/history', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (Array.isArray(data)) setHistory(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        fetchHistory();
    }, [navigate]);

    // === DELETE ===
    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            const res = await fetch(`http://localhost:5000/api/history/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success('History entry deleted', {
                    style: { borderRadius: '12px', background: '#708238', color: '#fff' },
                });
                setHistory((prev) => prev.filter((h) => h.id !== id));
            } else {
                toast.error('Failed to delete entry');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setDeletingId(null); setConfirmDeleteId(null); }
    };

    // === EDIT ===
    const startEdit = (entry) => {
        setEditingId(entry.id);
        setEditForm({
            medicineName: entry.medicineName,
            dosage: entry.dosage || '',
            frequency: entry.frequency || '',
            takenAt: entry.takenAt,
            takenTime: entry.takenTime || '',
            notes: entry.notes || '',
        });
    };

    const cancelEdit = () => { setEditingId(null); setEditForm({}); };

    const handleSaveEdit = async (id) => {
        if (!editForm.medicineName?.trim()) {
            toast.error('Medicine name is required');
            return;
        }
        setSavingId(id);
        try {
            const res = await fetch(`http://localhost:5000/api/history/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                const updated = await res.json();
                setHistory((prev) => prev.map((h) => (h.id === id ? updated : h)));
                toast.success('Entry updated!', {
                    style: { borderRadius: '12px', background: '#708238', color: '#fff' },
                });
                setEditingId(null);
                setEditForm({});
            } else {
                toast.error('Failed to update entry');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setSavingId(null); }
    };

    // Group by date
    const grouped = history.reduce((acc, entry) => {
        const date = entry.takenAt;
        if (!acc[date]) acc[date] = [];
        acc[date].push(entry);
        return acc;
    }, {});

    const formatDate = (dateStr) => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (dateStr === today) return 'Today';
        if (dateStr === yesterday) return 'Yesterday';
        return new Date(dateStr + 'T00:00:00').toLocaleDateString(undefined, {
            weekday: 'long', month: 'long', day: 'numeric',
        });
    };

    const inputStyle = {
        border: '1.5px solid #d5ddc8', borderRadius: '10px', padding: '6px 10px',
        fontSize: '0.85rem', fontFamily: "'Quicksand', sans-serif", fontWeight: '600',
        background: '#fafaf7', outline: 'none',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f2f4ef', fontFamily: "'Quicksand', sans-serif" }}>

            {/* NAVBAR */}
            <nav className="navbar navbar-dark shadow-sm px-4 py-3 sticky-top" style={{ backgroundColor: '#708238' }}>
                <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
                    <div className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                        <History size={18} style={{ color: '#708238' }} />
                    </div>
                    Dose History
                </span>
                <div className="d-flex gap-2">
                    <button
                        onClick={fetchHistory}
                        className="btn btn-sm rounded-circle fw-bold"
                        title="Refresh"
                        style={{ background: '#e9edc9', color: '#4B5320', border: 'none', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <RefreshCw size={15} />
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="btn btn-sm btn-light rounded-pill px-3 shadow-sm fw-bold"
                        style={{ color: '#708238' }}
                    >
                        <ArrowLeft size={15} /> Back
                    </button>
                </div>
            </nav>

            <div className="container pt-4" style={{ maxWidth: '700px' }}>

                {/* Header */}
                <div className="mb-4">
                    <h5 className="fw-bold mb-0" style={{ color: '#3a4a1e', fontSize: '1.25rem' }}>
                        <History size={20} className="me-2" style={{ color: '#708238' }} />
                        Medication History
                    </h5>
                    <small style={{ color: '#8a9a5e', fontWeight: '500' }}>
                        {history.length} dose{history.length !== 1 ? 's' : ''} recorded
                    </small>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border" style={{ color: '#708238', width: '2.5rem', height: '2.5rem' }} role="status" />
                        <p className="mt-3 fw-bold" style={{ color: '#708238' }}>Loading history...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && history.length === 0 && (
                    <div className="text-center py-5" style={{ background: '#fff', borderRadius: '20px', border: '2px dashed #d5ddc8', color: '#8a9a5e' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📋</div>
                        <p className="fw-bold mb-1" style={{ color: '#3a4a1e' }}>No history yet</p>
                        <small>Mark medicines as taken from the Home screen to see them here</small>
                        <div className="mt-3">
                            <button onClick={() => navigate('/home')} className="btn btn-sm fw-bold rounded-pill px-4"
                                style={{ background: '#708238', color: '#fff', border: 'none' }}>
                                Go to Medicines
                            </button>
                        </div>
                    </div>
                )}

                {/* Grouped history */}
                {!loading && Object.keys(grouped).map((date) => (
                    <div key={date} className="mb-4">
                        {/* Date header */}
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="fw-bold" style={{ color: '#4B5320', fontSize: '0.9rem' }}>
                                📅 {formatDate(date)}
                            </span>
                            <div style={{ flex: 1, height: '1px', background: '#d5ddc8' }} />
                            <span className="badge" style={{ background: '#e9edc9', color: '#4B5320', fontSize: '0.75rem', fontWeight: '700' }}>
                                {grouped[date].length} dose{grouped[date].length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="d-flex flex-column gap-2">
                            {grouped[date].map((entry) => (
                                <div
                                    key={entry.id}
                                    className="card border-0"
                                    style={{ borderRadius: '16px', boxShadow: '0 3px 16px rgba(112,130,56,0.08)', position: 'relative', overflow: 'visible' }}
                                >
                                    {/* Left accent */}
                                    <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '4px', height: '55%', background: 'linear-gradient(180deg, #708238, #a3b464)', borderRadius: '0 4px 4px 0' }} />

                                    {editingId === entry.id ? (
                                        /* ===== EDIT MODE ===== */
                                        <div className="card-body px-4 py-3">
                                            <div className="row g-2 mb-2">
                                                <div className="col-12 col-sm-6">
                                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4B5320' }}>Medicine Name *</label>
                                                    <input
                                                        style={{ ...inputStyle, width: '100%' }}
                                                        value={editForm.medicineName}
                                                        onChange={(e) => setEditForm({ ...editForm, medicineName: e.target.value })}
                                                        placeholder="Medicine name"
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-6">
                                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4B5320' }}>Dosage</label>
                                                    <input
                                                        style={{ ...inputStyle, width: '100%' }}
                                                        value={editForm.dosage}
                                                        onChange={(e) => setEditForm({ ...editForm, dosage: e.target.value })}
                                                        placeholder="e.g. 500mg"
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4B5320' }}>Date Taken</label>
                                                    <input
                                                        type="date"
                                                        style={{ ...inputStyle, width: '100%' }}
                                                        value={editForm.takenAt}
                                                        onChange={(e) => setEditForm({ ...editForm, takenAt: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4B5320' }}>Time Taken</label>
                                                    <input
                                                        type="time"
                                                        style={{ ...inputStyle, width: '100%' }}
                                                        value={editForm.takenTime}
                                                        onChange={(e) => setEditForm({ ...editForm, takenTime: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-12 col-sm-4">
                                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4B5320' }}>Notes</label>
                                                    <input
                                                        style={{ ...inputStyle, width: '100%' }}
                                                        value={editForm.notes}
                                                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                        placeholder="Optional note"
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm fw-bold"
                                                    onClick={() => handleSaveEdit(entry.id)}
                                                    disabled={savingId === entry.id}
                                                    style={{ background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', border: 'none', borderRadius: '10px', padding: '6px 16px', fontSize: '0.83rem' }}
                                                >
                                                    {savingId === entry.id
                                                        ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                                                        : <><Save size={13} className="me-1" />Save</>}
                                                </button>
                                                <button
                                                    className="btn btn-sm fw-bold"
                                                    onClick={cancelEdit}
                                                    style={{ background: '#f2f4ef', color: '#708238', border: 'none', borderRadius: '10px', padding: '6px 16px', fontSize: '0.83rem' }}
                                                >
                                                    <X size={13} className="me-1" />Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ===== VIEW MODE ===== */
                                        <div className="card-body px-4 py-3 d-flex align-items-center justify-content-between gap-2 flex-wrap">
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e9edc9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Pill size={20} style={{ color: '#708238' }} />
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold" style={{ color: '#3a4a1e' }}>{entry.medicineName}</h6>
                                                    <small style={{ color: '#8a9a5e', fontWeight: '600' }}>
                                                        {entry.dosage && <span>{entry.dosage}</span>}
                                                        {entry.dosage && entry.frequency && <span> · </span>}
                                                        {entry.frequency && <span>{entry.frequency}</span>}
                                                    </small>
                                                    {entry.notes && (
                                                        <div style={{ fontSize: '0.78rem', color: '#a3b464', fontWeight: '600', marginTop: '1px' }}>
                                                            📝 {entry.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                {entry.takenTime && (
                                                    <div style={{ background: '#f2f4ef', borderRadius: '8px', padding: '3px 10px', color: '#4B5320', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0 }}>
                                                        🕐 {entry.takenTime}
                                                    </div>
                                                )}
                                                <span style={{ background: '#e9edc9', color: '#4B5320', borderRadius: '8px', padding: '3px 10px', fontSize: '0.78rem', fontWeight: '700' }}>
                                                    ✅ Taken
                                                </span>

                                                {/* Edit button */}
                                                <button
                                                    className="btn btn-sm"
                                                    title="Edit"
                                                    onClick={() => startEdit(entry)}
                                                    style={{ background: '#e9edc9', color: '#708238', border: 'none', borderRadius: '9px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <Pencil size={14} />
                                                </button>

                                                {/* Delete button */}
                                                {confirmDeleteId === entry.id ? (
                                                    <div className="d-flex gap-1">
                                                        <button
                                                            className="btn btn-sm fw-bold"
                                                            onClick={() => handleDelete(entry.id)}
                                                            disabled={deletingId === entry.id}
                                                            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '9px', padding: '3px 10px', fontSize: '0.78rem' }}
                                                        >
                                                            {deletingId === entry.id ? <span className="spinner-border spinner-border-sm" /> : 'Yes'}
                                                        </button>
                                                        <button
                                                            className="btn btn-sm fw-bold"
                                                            onClick={() => setConfirmDeleteId(null)}
                                                            style={{ background: '#f2f4ef', color: '#708238', border: 'none', borderRadius: '9px', padding: '3px 10px', fontSize: '0.78rem' }}
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm"
                                                        title="Delete"
                                                        onClick={() => setConfirmDeleteId(entry.id)}
                                                        style={{ background: '#fff0f0', color: '#dc2626', border: 'none', borderRadius: '9px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <p className="text-center mt-4" style={{ color: '#a3b464', fontSize: '0.8rem', fontWeight: '600' }}>
                    🔒 Your medicine data is private and secure
                </p>
            </div>
        </div>
    );
};

export default HistoryPage;
