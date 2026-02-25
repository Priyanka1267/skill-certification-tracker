import { useState } from 'react'
import CertificateViewer from './CertificateViewer'

function daysLeft(dateStr){
  const d = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((d - now) / (1000*60*60*24))
  return diff
}

export default function CertItem({ cert, onEdit, onDelete, onRenew, adminMode }){
  const [viewerOpen, setViewerOpen] = useState(false)
  const left = daysLeft(cert.expiryDate)
  const expired = left < 0

  return (
    <div className="cert-item">
      <div className="cert-meta">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <strong>{cert.name}</strong> <span style={{color:'#666'}}>{cert.provider ? ` — ${cert.provider}` : ''}</span>
          </div>
          <div style={{textAlign:'right'}}>
            <div className={expired? 'expired' : ''}>{expired ? 'Expired' : `${left} days`}</div>
            <div style={{fontSize:'.85rem',color:'#666'}}>{cert.expiryDate}</div>
          </div>
        </div>
        {cert.notes && <div style={{marginTop:6,color:'#444'}}>{cert.notes}</div>}
      </div>

      <div className="cert-actions">
        {cert.file && <button className="btn" onClick={()=>setViewerOpen(true)}>View</button>}
        {adminMode && <button className="btn" onClick={()=>{
          const ne = prompt('New expiry date (YYYY-MM-DD)', cert.expiryDate)
          if(ne) onRenew(cert.id, ne)
        }}>Renew</button>}
        {adminMode && <button className="btn" onClick={()=>onEdit(cert)}>Edit</button>}
        {adminMode && <button className="btn" onClick={()=>onDelete(cert.id)}>Delete</button>}
      </div>

      {viewerOpen && <CertificateViewer file={cert.file} onClose={()=>setViewerOpen(false)} />}
    </div>
  )
}
