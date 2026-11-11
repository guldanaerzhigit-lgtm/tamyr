import { useEffect, useState } from 'react'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './lib/firebase'

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => onAuthStateChanged(auth, current => { setUser(current); setChecking(false) }), [])

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      let credential
      if (mode === 'register') {
        credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() })
      } else credential = await signInWithEmailAndPassword(auth, email.trim(), password)
      const familyRef = doc(db, 'families', credential.user.uid)
      const familySnap = await getDoc(familyRef)
      if (!familySnap.exists()) await setDoc(familyRef, { ownerId: credential.user.uid, name: name.trim() ? name.trim() + ' әулеті' : 'Менің әулетім', visibility: 'private', createdAt: serverTimestamp() })
    } catch (err) {
      const messages = { 'auth/email-already-in-use': 'Бұл электрондық пошта бұрын тіркелген.', 'auth/invalid-email': 'Электрондық пошта дұрыс емес.', 'auth/weak-password': 'Құпиясөз кемінде 6 таңбадан тұруы керек.', 'auth/invalid-credential': 'Электрондық пошта немесе құпиясөз қате.', 'auth/network-request-failed': 'Интернет байланысын тексеріңіз.' }
      setError(messages[err.code] || 'Кіру кезінде қате шықты. Firebase баптауларын тексеріңіз.')
    } finally { setBusy(false) }
  }

  if (checking) return <div className="auth-screen"><div className="auth-card">TAMYR · Жүктелуде...</div></div>
  if (user) return children(user)
  return <div className="auth-screen"><form className="auth-card" onSubmit={submit}>
    <div className="auth-brand"><span>🌿</span><b>TAMYR</b></div>
    <div className="eyebrow">Тамырыңды таны. Тарихыңды сақта.</div>
    <h1>{mode === 'login' ? 'Қош келдіңіз!' : 'Өз шежіреңізді бастаңыз'}</h1>
    <p>{mode === 'login' ? 'Отбасыңыздың тарихына қайта оралыңыз.' : 'Жеке кабинет ашып, әулет тарихын жинақтаңыз.'}</p>
    {mode === 'register' && <label>Атыңыз<input value={name} onChange={e => setName(e.target.value)} required placeholder="Атыңыз" /></label>}
    <label>Электрондық пошта<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" autoComplete="email" /></label>
    <label>Құпиясөз<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Кемінде 6 таңба" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
    {error && <div className="auth-error">{error}</div>}
    <button className="primary-button auth-submit" disabled={busy}>{busy ? 'Күте тұрыңыз...' : mode === 'login' ? 'Кіру' : 'Тіркелу'}</button>
    <div className="auth-switch">{mode === 'login' ? 'Аккаунтыңыз жоқ па?' : 'Аккаунтыңыз бар ма?'} <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>{mode === 'login' ? 'Тіркелу' : 'Кіру'}</button></div>
  </form></div>
}
