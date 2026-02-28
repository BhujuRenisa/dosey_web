import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-vh-100 bg-light d-flex flex-column">

      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm px-4">
        <span className="navbar-brand fw-bold text-primary">
          DoseyCare
        </span>
        <Link to="/login" className="btn btn-outline-primary">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow-1 d-flex align-items-center">
        <div className="container text-center">

          {/* Glass Card */}
          <div className="card shadow-lg border-0 mx-auto mb-5" style={{ maxWidth: '420px' }}>
            <div className="card-body p-4">

              <img
                src="/logo.png"
                alt="Pill"
                className="img-fluid mb-3"
                style={{ maxWidth: '120px' }}
              />

              <h1 className="fw-bold text-primary">DoseyCare</h1>
              <p className="text-muted mb-4">
                Your personal medication companion.
              </p>

              <div className="d-flex gap-3 justify-content-center">
                <Link to="/register" className="btn btn-primary px-4">
                  Start Tracking
                </Link>
                <Link to="/login" className="btn btn-outline-primary px-4">
                  View Demo
                </Link>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="row justify-content-center g-4">
            <div className="col-md-3 col-sm-6">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <img
                    src="/Alram.jpg"
                    alt="Alarm"
                    className="img-fluid mb-3"
                    style={{ maxWidth: '70px' }}
                  />
                  <p className="fw-semibold mb-0">Smart Reminders</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <img
                    src="/progressStatus.png"
                    alt="Progress"
                    className="img-fluid mb-3"
                    style={{ maxWidth: '70px' }}
                  />
                  <p className="fw-semibold mb-0">Progress Status</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-sm-6">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body">
                  <img
                    src="/lock.png"
                    alt="Privacy"
                    className="img-fluid mb-3"
                    style={{ maxWidth: '70px' }}
                  />
                  <p className="fw-semibold mb-0">Data Privacy</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  )
}

export default Landing
