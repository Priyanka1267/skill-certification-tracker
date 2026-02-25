const STORAGE_KEY = 'cert_tracker_v1'

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('read storage', e)
    return []
  }
}

function write(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export const storage = {
  getAll() {
    return read().sort((a,b)=>new Date(a.expiryDate) - new Date(b.expiryDate))
  },
  get(id){
    return read().find(c=>c.id===id) || null
  },
  add(cert){
    const all = read()
    cert.id = uid()
    all.push(cert)
    write(all)
    return cert
  },
  update(id, cert){
    const all = read()
    const idx = all.findIndex(c=>c.id===id)
    if(idx!==-1){
      all[idx] = cert
      write(all)
      return cert
    }
    return null
  },
  remove(id){
    const all = read().filter(c=>c.id!==id)
    write(all)
  },
  clear(){
    localStorage.removeItem(STORAGE_KEY)
  }
}

export default storage
