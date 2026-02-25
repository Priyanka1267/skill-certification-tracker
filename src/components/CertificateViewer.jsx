import { useEffect } from 'react'

export default function CertificateViewer({ file, onClose }){
  useEffect(()=>{
    function onKey(e){if(e.key==='Escape')onClose()}
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[onClose])

  if(!file) return null

  const isImage = file.type && file.type.startsWith('image/')

  return (
    <div className="modal" onClick={onClose}>
      <div className="panel" onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <strong>{file.name}</strong>
          <div>
            <a className="btn" href={file.data} download={file.name}>Download</a>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
        <div style={{marginTop:12}}>
          {isImage ? (
            <img src={file.data} alt={file.name} style={{maxWidth:'100%',height:'auto'}} />
          ) : (
            <iframe title={file.name} src={file.data} style={{width:'100%',height:'70vh',border:0}} />
          )}
        </div>
      </div>
    </div>
  )
}
