import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Bell, Shield, Monitor, Trash2, Save, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import './Home.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
  });

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    refillAlerts: true,
    weeklySummary: false,
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
      phone: '',
      dob: '',
    });
  }, [navigate]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setLoading(false);
      toast.success('Profile updated successfully!', {
        style: { borderRadius: '12px', background: '#708238', color: '#fff' },
      });
    }, 1000);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) return null;

  const sidebarItems = [
    { label: 'Personal Info', icon: User },
    { label: 'Health Profile', icon: Shield },
    { label: 'Notifications', icon: Bell },
    { label: 'Security', icon: Shield },
    { label: 'Display', icon: Monitor },
  ];

  const inputStyle = {
    border: '1.5px solid #d5ddc8',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '0.9rem',
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: '600',
    background: '#fafaf7',
    outline: 'none',
    width: '100%',
  };

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#4B5320',
    marginBottom: '6px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f2f4ef', fontFamily: "'Quicksand', sans-serif" }}>
      <Navbar user={user} />

      <div className="container-lg py-5" style={{ maxWidth: '1000px' }}>
        <h3 style={{ fontWeight: '800', color: '#3a4a1e', marginBottom: '8px' }}>Settings</h3>
        <p style={{ color: '#8a9a5e', fontWeight: '500', marginBottom: '2rem' }}>Manage your personal information and app preferences.</p>

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

            <div className="mt-4 p-3" style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', borderRadius: '20px', color: '#fff', cursor: 'pointer' }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Need help?</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Check our documentation or contact support.</div>
              <button className="btn btn-sm w-100 mt-3" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700' }}>Contact Support</button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-12 col-md-8">
            <div className="card border-0" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(112,130,56,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #708238, #a3b464)' }} />
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 style={{ fontWeight: '800', color: '#3a4a1e', margin: 0 }}>{activeTab}</h5>
                  {activeTab === 'Personal Info' && (
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-sm" style={{ background: '#f2f4ef', color: '#708238', borderRadius: '10px', fontWeight: '700', padding: '6px 16px' }}>Cancel</button>
                      <button type="button" className="btn btn-sm" onClick={handleUpdateProfile} disabled={loading} style={{ background: 'linear-gradient(135deg, #708238, #4B5320)', color: '#fff', borderRadius: '10px', fontWeight: '700', padding: '6px 20px', border: 'none' }}>
                        {loading ? <span className="spinner-border spinner-border-sm"></span> : <><Save size={14} className="me-2" />Save Changes</>}
                      </button>
                    </div>
                  )}
                </div>

                {activeTab === 'Personal Info' && (
                  <form className="row g-4">
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
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8a9a5e' }} />
                        <input style={{ ...inputStyle, paddingLeft: '38px' }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Phone Number</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8a9a5e' }} />
                        <input style={{ ...inputStyle, paddingLeft: '38px' }} placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Date of Birth</label>
                      <div style={{ position: 'relative' }}>
                        <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8a9a5e' }} />
                        <input type="date" style={{ ...inputStyle, paddingLeft: '38px' }} value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
                      </div>
                    </div>
                  </form>
                )}

                {activeTab === 'Notifications' && (
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <Bell size={18} style={{ color: '#708238' }} />
                      <h6 style={{ fontWeight: '800', color: '#3a4a1e', margin: 0 }}>Notification Preferences</h6>
                    </div>

                    {[
                      { label: 'Daily Medicine Reminders', key: 'dailyReminders', sub: 'Receive alerts when it\'s time to take your dose.' },
                      { label: 'Refill Alerts', key: 'refillAlerts', sub: 'Get notified when your supply is running low.' },
                      { label: 'Weekly Health Summary', key: 'weeklySummary', sub: 'Email report of your adherence stats.' },
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

                {(activeTab === 'Health Profile' || activeTab === 'Security' || activeTab === 'Display') && (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
                    <h6 style={{ fontWeight: '800', color: '#3a4a1e' }}>{activeTab} Settings</h6>
                    <p style={{ color: '#8a9a5e', fontWeight: '500' }}>Enhanced {activeTab.toLowerCase()} options are coming soon to Dosey!</p>
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
    </div>
  );
};

export default Profile;