import CertItem from './CertItem'
import { useState } from 'react'

function emptyState(){
  return (
    <div className="card">
      <h3>No certifications yet</h3>
      <p className="note">Use the form to add a certification and attach the certificate file.</p>
    </div>
  )
}

export default function CertList({ certs, onEdit, onDelete, onRenew, adminMode }){
  const [filter, setFilter] = useState('all')

  const filtered = certs.filter(c=>{
    if(filter==='all') return true
    if(filter==='expiring30'){
      const d = new Date(c.expiryDate)
      const now = new Date()
      const diff = Math.ceil((d - now)/(1000*60*60*24))
      return diff <= 30
    }
    if(filter==='expired') return new Date(c.expiryDate) < new Date()
    return true
  })

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h2>Certifications</h2>
        <div>
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="expiring30">Expiring in 30 days</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="card">
        {certs.length === 0 && emptyState()}
        {filtered.map(c=> (
          <CertItem key={c.id} cert={c} onEdit={onEdit} onDelete={onDelete} onRenew={onRenew} adminMode={adminMode} />
        ))}
      </div>
    </div>
  )
}
