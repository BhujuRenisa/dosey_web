import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Calendar, Bell, Shield, Monitor, Trash2, Save, LogOut, X, Heart, Droplet, AlertCircle, Edit2, Package, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import './Home.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('Personal'); // 'Personal' or 'Health'
  const [medicines, setMedicines] = useState([]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
  });

  const [healthForm, setHealthForm] = useState({
    emergencyContact: '',
    bloodType: '',
    allergies: '',
  });

  const [notifications, setNotifications] = useState({
    refillAlerts: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Split name for form
    const [first, ...rest] = (parsedUser.fullName || '').split(' ');
    setForm({
      firstName: first || '',
      lastName: rest.join(' ') || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || '',
      dob: parsedUser.dob || '',
    });

    setHealthForm({
      emergencyContact: parsedUser.emergencyContact || '',
      bloodType: parsedUser.bloodType || '',
      allergies: parsedUser.allergies || '',
    });

    fetchMedicines();
  }, [navigate]);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:5000/api/medicines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicines(res.data);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    }
  };

  const handleUpdateProfile = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    // Simulation
    setTimeout(() => {
      const updatedUser = {
        ...user,
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        dob: form.dob,
        emergencyContact: healthForm.emergencyContact,
        bloodType: healthForm.bloodType,
        allergies: healthForm.allergies,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setLoading(false);
      setShowModal(false);
      toast.success(`${modalType} information updated!`, {
        style: { borderRadius: '12px', background: '#708238', color: '#fff' },
      });
    }, 800);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) return null;

  const sidebarItems = [
    { label: 'Personal Info', icon: User },
    { label: 'Health Profile', icon: Heart },
    { label: 'Refills & Stock', icon: Package },
    { label: 'Notifications', icon: Bell },
  ];

  const inputStyle = {
    border: '1.5px solid #d5ddc8',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '0.95rem',
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: '600',
    background: '#fafaf7',
    outline: 'none',
    width: '100%',
    transition: '0.2s',
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#4B5320',
    marginBottom: '8px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="d-flex align-items-center gap-3 py-3" style={{ borderBottom: '1.2px solid #f0f2eb' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f7f9f3', color: '#708238', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#8a9a5e', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#3a4a1e' }}>{value || 'Not provided'}</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f2f4ef', fontFamily: "'Quicksand', sans-serif", position: 'relative' }}>
      <Navbar user={user} />

      <div className="container-lg py-5" style={{ maxWidth: '1000px' }}>
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h3 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '8px' }}>Settings</h3>
            <p style={{ color: '#8a9a5e', fontWeight: '500', marginBottom: 0 }}>Manage your personal information, health records, and medication alerts.</p>
          </div>
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }} className="btn btn-outline-danger btn-sm px-3 fw-bold" style={{ borderRadius: '10px', border: '1.5px solid #dc2626' }}>
            <LogOut size={16} className="me-2" /> Logout
          </button>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-12 col-md-4">
            <div className="card border-0 p-3" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(112,130,56,0.1)' }}>
              <div className="d-flex align-items-center gap-3 mb-4 p-2">
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#708238', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '800' }}>
                  {user.fullName?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: '#3a4a1e', fontSize: '1.05rem' }}>{user.fullName}</div>
                  <div style={{ color: '#8a9a5e', fontSize: '0.8rem', fontWeight: '700' }}>{user.email}</div>
                </div>
              </div>

              {sidebarItems.map(item => {
                const active = activeTab === item.label;
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.label)}
                    style={{
                      width: '100%',
                      background: active ? '#f7f9f3' : 'transparent',
                      color: active ? '#4B5320' : '#8a9a5e',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      margin: '2px 0',
                      textAlign: 'left',
                      fontWeight: active ? '700' : '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: '0.2s'
                    }}
                  >
                    <Icon size={18} style={{ opacity: active ? 1 : 0.7 }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-12 col-md-8">
            <div className="card border-0" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(112,130,56,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #708238, #a3b464)' }} />
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 style={{ fontWeight: '800', color: '#3a4a1e', margin: 0 }}>{activeTab}</h5>
                  {(activeTab === 'Personal Info' || activeTab === 'Health Profile') && (
                    <button
                      onClick={() => {
                        setModalType(activeTab === 'Personal Info' ? 'Personal' : 'Health');
                        setShowModal(true);
                      }}
                      className="btn btn-sm"
                      style={{ background: '#f2f4ef', color: '#708238', borderRadius: '10px', fontWeight: '700', padding: '6px 16px', border: '1.5px solid #d5ddc8' }}
                    >
                      <Edit2 size={14} className="me-2" /> Edit
                    </button>
                  )}
                </div>

                {activeTab === 'Personal Info' && (
                  <div className="px-1">
                    <InfoRow label="Full Name" value={user.fullName} icon={User} />
                    <InfoRow label="Email Address" value={user.email} icon={Mail} />
                    <InfoRow label="Phone Number" value={user.phone || 'Not set'} icon={Phone} />
                    <InfoRow label="Date of Birth" value={user.dob || 'Not set'} icon={Calendar} />
                  </div>
                )}

                {activeTab === 'Health Profile' && (
                  <div className="px-1">
                    <InfoRow label="Emergency Contact" value={user.emergencyContact || 'Not set'} icon={Phone} />
                    <InfoRow label="Blood Type" value={user.bloodType || 'Not set'} icon={Droplet} />
                    <InfoRow label="Allergies" value={user.allergies || 'None listed'} icon={AlertCircle} />
                  </div>
                )}

                {activeTab === 'Refills & Stock' && (
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <Package size={18} style={{ color: '#708238' }} />
                      <h6 style={{ fontWeight: '800', color: '#3a4a1e', margin: 0 }}>Medication Stock Levels</h6>
                    </div>
                    {medicines.length > 0 ? (
                      medicines.map(med => {
                        const lowStock = (med.stock || 0) <= (med.refillThreshold || 5);
                        return (
                          <div key={med.id} className="d-flex align-items-center justify-content-between py-3" style={{ borderBottom: '1px solid #f2f4ef' }}>
                            <div className="d-flex align-items-center gap-3">
                              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${med.colorTag || '#708238'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${med.colorTag || '#708238'}30` }}>
                                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: med.colorTag || '#708238' }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '700', color: '#3a4a1e', fontSize: '0.92rem' }}>{med.name}</div>
                                <div style={{ color: lowStock ? '#dc2626' : '#8a9a5e', fontSize: '0.78rem', fontWeight: '700' }}>
                                  {lowStock ? '⚠️ LOW STOCK' : 'Healthy Supply'}
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <div style={{ fontWeight: '800', color: lowStock ? '#dc2626' : '#3a4a1e', fontSize: '1.1rem' }}>{med.stock || 0}</div>
                              <div style={{ color: '#8a9a5e', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>Remaining</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4" style={{ background: '#f7f9f3', borderRadius: '16px', border: '1.5px dashed #d5ddc8' }}>
                        <Package size={32} style={{ color: '#a3b464', marginBottom: '10px', opacity: 0.6 }} />
                        <p style={{ color: '#8a9a5e', fontWeight: '600', fontSize: '0.85rem' }}>No medicines found to track stock.</p>
                        <button onClick={() => navigate('/add-medication')} className="btn btn-sm fw-bold" style={{ color: '#708238' }}>Add One Now →</button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Notifications' && (
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <Bell size={18} style={{ color: '#708238' }} />
                      <h6 style={{ fontWeight: '800', color: '#3a4a1e', margin: 0 }}>Notification Preferences</h6>
                    </div>

                    {[
                      { label: 'Refills Needed Warning', key: 'refillAlerts', sub: 'Get notified when your supply is running low.' },
                    ].map(pref => (
                      <div key={pref.key} className="d-flex align-items-center justify-content-between py-3" style={{ borderBottom: '1.5px solid #f2f4ef' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', color: '#3a4a1e', fontSize: '0.88rem' }}>{pref.label}</div>
                          <div style={{ color: '#8a9a5e', fontSize: '0.78rem', fontWeight: '600' }}>{pref.sub}</div>
                        </div>
                        <div
                          onClick={() => toggleNotification(pref.key)}
                          style={{
                            width: '42px',
                            height: '24px',
                            borderRadius: '12px',
                            background: notifications[pref.key] ? '#708238' : '#d5ddc8',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: '0.3s',
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            top: '3px',
                            left: notifications[pref.key] ? '21px' : '3px',
                            transition: '0.3s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="col-12 mt-5">
                  <h6 style={{ fontWeight: '800', color: '#dc2626', marginBottom: '1rem' }}>Danger Zone</h6>
                  <div className="p-3" style={{ background: '#fff0f0', border: '1.5px solid #fecaca', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#b91c1c', fontSize: '0.88rem' }}>Delete Account</div>
                      <div style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: '600' }}>Once you delete your account, there is no going back. Please be certain.</div>
                    </div>
                    <button className="btn btn-sm fw-bold" style={{ background: '#dc2626', color: '#fff', borderRadius: '10px', fontSize: '0.8rem', padding: '8px 16px' }}>Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(58, 74, 30, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            animation: 'modalFadeIn 0.3s ease-out'
          }}>
            <style>
              {`
                @keyframes modalFadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}
            </style>
            <div className="p-4 d-flex justify-content-between align-items-center" style={{ borderBottom: '1.5px solid #f2f4ef' }}>
              <h5 style={{ fontWeight: '800', color: '#3a4a1e', margin: 0 }}>Edit {modalType} Info</h5>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#8a9a5e' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-4">
              <div className="row g-3">
                {modalType === 'Personal' ? (
                  <>
                    <div className="col-md-6">
                      <label style={labelStyle}>First Name</label>
                      <input style={inputStyle} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Last Name</label>
                      <input style={inputStyle} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Email Address</label>
                      <input style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Phone Number</label>
                      <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Date of Birth</label>
                      <input type="date" style={inputStyle} value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-12">
                      <label style={labelStyle}>Emergency Contact</label>
                      <input style={inputStyle} placeholder="Name or Number" value={healthForm.emergencyContact} onChange={e => setHealthForm({ ...healthForm, emergencyContact: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Blood Type</label>
                      <select style={inputStyle} value={healthForm.bloodType} onChange={e => setHealthForm({ ...healthForm, bloodType: e.target.value })}>
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Allergies</label>
                      <textarea style={{ ...inputStyle, minHeight: '100px' }} placeholder="Any medicinal or dietary allergies..." value={healthForm.allergies} onChange={e => setHealthForm({ ...healthForm, allergies: e.target.value })} />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 d-flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn w-100" style={{ background: '#f2f4ef', color: '#708238', borderRadius: '12px', fontWeight: '700', padding: '12px' }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn w-100" style={{ background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', borderRadius: '12px', fontWeight: '700', padding: '12px', border: 'none' }}>
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;