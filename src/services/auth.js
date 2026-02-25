const USERS_KEY = 'cert_tracker_users'
const SESSION_KEY = 'cert_tracker_session'

function hash(p){
  try { return btoa(p) } catch(e){ return p }
}

function readUsers(){
  try{ const raw = localStorage.getItem(USERS_KEY); return raw? JSON.parse(raw): [] }catch(e){return[]}
}

function writeUsers(list){ localStorage.setItem(USERS_KEY, JSON.stringify(list)) }

// ensure default admin exists for demo
;(function ensureDefault(){
  const users = readUsers()
  if(users.length===0){
    users.push({username:'admin',passwordHash:hash('admin'),isAdmin:true})
    writeUsers(users)
  }
})()

export const auth = {
  getCurrentUser(){
    try{ return JSON.parse(localStorage.getItem(SESSION_KEY)) }catch(e){return null}
  },
  isAuthenticated(){ return !!auth.getCurrentUser() },
  login(username,password){
    const users = readUsers()
    const found = users.find(u=>u.username===username && u.passwordHash===hash(password))
    if(found){
      const session = {username: found.username, isAdmin: !!found.isAdmin}
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      return session
    }
    return null
  },
  logout(){ localStorage.removeItem(SESSION_KEY) },
  signup(username,password,isAdmin=false){
    const users = readUsers()
    if(users.find(u=>u.username===username)) return null
    const user = {username, passwordHash:hash(password), isAdmin: !!isAdmin}
    users.push(user)
    writeUsers(users)
    const session = {username:user.username,isAdmin:user.isAdmin}
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return session
  }
}

export default auth
