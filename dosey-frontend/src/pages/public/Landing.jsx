import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="blob-bg"></div>
      
      <nav className="mini-nav">
        <span className="logo-text">DoseyCare</span>
        <Link to="/login" className="login-link">Sign In</Link>
      </nav>

      <main className="main-hero">
        <div className="glass-card">
          <div className="avatar-circle">
            <img src="/image.png" alt="image" className='pill-img'/>
          </div>
          <h1 className="main-title">DoseyCare</h1>
          <p className="subtitle">Your personal medication companion.</p>
          
          <div className="cta-buttons">
            <Link to="/register" className="btn-main">Start Tracking</Link>
            <Link to="/login" className="btn-sub">View Demo</Link>
          </div>
        </div>

        <div className="features-row">
          <div className="f-card">
            <img src="/Alram.jpg" alt="alramimage" className='alram-img'/>           
             <p>Smart Reminders</p>
          </div>
          <div className="f-card">
            <img src="/progressStatus.png" alt="alramimage" className='alram-img'/>           
            <p>Progress Status</p>
          </div>
          <div className="f-card">
            <img src="/lock.png" alt="alramimage" className='alram-img'/>           
            <p>Data Privacy</p>
          </div>
        </div>
      </main>

      {/* <footer className="uni-footer">
        <p>Built with ❤️ for Software Engineering 101</p>
      </footer> */}
    </div>
  );
};

export default Landing;