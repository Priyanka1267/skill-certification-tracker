import { useEffect, useState } from 'react'

function toISO(dateStr){
  if(!dateStr) return ''
  const d = new Date(dateStr)
  return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10)
}

export default function CertForm({ onSave, editing, onCancel }){
  const [name,setName]=useState('')
  const [provider,setProvider]=useState('')
  const [issueDate,setIssueDate]=useState('')
  const [expiryDate,setExpiryDate]=useState('')
  const [notes,setNotes]=useState('')
  const [fileMeta,setFileMeta]=useState(null)

  useEffect(()=>{
    if(editing){
      setName(editing.name||'')
      setProvider(editing.provider||'')
      setIssueDate(toISO(editing.issueDate))
      setExpiryDate(toISO(editing.expiryDate))
      setNotes(editing.notes||'')
      setFileMeta(editing.file||null)
    } else {
      setName('')
      setProvider('')
      setIssueDate('')
      setExpiryDate('')
      setNotes('')
      setFileMeta(null)
    }
  },[editing])

  function handleFile(e){
    const f = e.target.files && e.target.files[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      setFileMeta({name:f.name,type:f.type,data:reader.result})
    }
    reader.readAsDataURL(f)
  }

  function submit(e){
    e.preventDefault()
    if(!name || !expiryDate){
      alert('Please provide at least a name and expiry date')
      return
    }
    const cert = {
      id: editing?.id,
      name, provider, issueDate: issueDate||null, expiryDate, notes, file: fileMeta
    }
    onSave(cert)
  }

  return (
    <div className="card">
      <h2>{editing ? 'Edit Certification' : 'Add Certification'}</h2>
      <form onSubmit={submit}>
        <label>Certification name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="AWS Certified Developer" />

        <label>Provider</label>
        <input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="Provider (e.g., AWS, PMI)" />

        <label>Issue date</label>
        <input type="date" value={issueDate} onChange={e=>setIssueDate(e.target.value)} />

        <label>Expiry date</label>
        <input type="date" value={expiryDate} onChange={e=>setExpiryDate(e.target.value)} />

        <label>Notes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} />

        <label>Certificate file (PDF or image)</label>
        <input type="file" accept="application/pdf,image/*" onChange={handleFile} />
        {fileMeta && <div style={{marginTop:8,fontSize:'.9rem'}}><strong>Attached:</strong> {fileMeta.name}</div>}

        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="btn primary" type="submit">Save</button>
          <button type="button" className="btn" onClick={()=>{onCancel && onCancel()}}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
