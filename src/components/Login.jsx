import { useState } from 'react'
import { auth } from '../services/auth'

export default function Login({ onClose, onAuth }){
  const [user,setUser] = useState('')
  const [pass,setPass] = useState('')
  const [mode,setMode] = useState('login')

  function submit(e){
    e && e.preventDefault()
    if(mode==='login'){
      const s = auth.login(user,pass)
      if(!s){ alert('Invalid credentials') ; return }
      onAuth && onAuth(s)
      onClose && onClose()
    } else {
      const s = auth.signup(user,pass,false)
      if(!s){ alert('Username taken') ; return }
      onAuth && onAuth(s)
      onClose && onClose()
    }
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="panel" onClick={e=>e.stopPropagation()}>
        <h3>{mode==='login' ? 'Sign in' : 'Sign up'}</h3>
        <form onSubmit={submit}>
          <label>Username</label>
          <input value={user} onChange={e=>setUser(e.target.value)} />
          <label>Password</label>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn primary" type="submit">{mode==='login' ? 'Sign in' : 'Create account'}</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="button" className="btn" onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login' ? 'Create account' : 'Have an account?'}</button>
          </div>
        </form>
        <p style={{marginTop:8,fontSize:'.9rem',color:'#666'}}>Demo default admin: <strong>admin</strong>/<strong>admin</strong></p>
      </div>
    </div>
  )
}
