import { useEffect, useState } from 'react'
import './App.css'
import CertForm from './components/CertForm'
import CertList from './components/CertList'
import Login from './components/Login'
import { storage } from './services/storage'
import { auth } from './services/auth'

function App() {
  const [certs, setCerts] = useState([])
  const [editing, setEditing] = useState(null)
  const [adminMode, setAdminMode] = useState(false)
  const [user, setUser] = useState(auth.getCurrentUser())
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    setCerts(storage.getAll())
  }, [])

  useEffect(()=>{
    // if user logs out, disable admin mode
    if(!user) setAdminMode(false)
  },[user])

  function handleSave(cert) {
    if (cert.id) {
      storage.update(cert.id, cert)
    } else {
      storage.add(cert)
    }
    setCerts(storage.getAll())
    setEditing(null)
  }

  function handleDelete(id) {
    if (!confirm('Delete this certification?')) return
    storage.remove(id)
    setCerts(storage.getAll())
  }

  function handleEdit(cert) {
    setEditing(cert)
  }

  function handleRenew(id, newExpiry) {
    const c = storage.get(id)
    if (!c) return
    c.expiryDate = newExpiry
    storage.update(id, c)
    setCerts(storage.getAll())
  }

  return (
    <div className="app">
      <header>
        <h1>Certification Tracker</h1>
        <div className="header-controls">
          {user ? (
            <>
              <span style={{marginRight:8}}>Hello, <strong>{user.username}</strong></span>
              <button className="btn" onClick={() => { auth.logout(); setUser(null); setAdminMode(false); }}>Sign out</button>
            </>
          ) : (
            <button className="btn" onClick={()=>setLoginOpen(true)}>Sign in</button>
          )}

          <label style={{marginLeft:12}}>
            <input
              type="checkbox"
              checked={adminMode}
              disabled={!user || !user.isAdmin}
              onChange={(e) => {
                if(!user || !user.isAdmin){
                  alert('Admin mode requires signing in as an admin. Use default admin/admin.')
                  return
                }
                setAdminMode(e.target.checked)
              }}
            />
            Admin mode
          </label>
        </div>
      </header>

      {loginOpen && <Login onClose={()=>setLoginOpen(false)} onAuth={(s)=>setUser(s)} />}

      <main>
        <section className="left">
          <CertForm
            onSave={handleSave}
            editing={editing}
            onCancel={() => setEditing(null)}
          />
          <p className="note">Toggle Admin mode to access management features.</p>
        </section>

        <section className="right">
          <CertList
            certs={certs}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onRenew={handleRenew}
            adminMode={adminMode}
          />
        </section>
      </main>

      <footer>
        <small>Local demo - data saved in browser storage.</small>
      </footer>
    </div>
  )
}

export default App
