import { useMemo, useState } from 'react'
import {
  Search, Plus, ChevronDown, ChevronRight, Menu, X, TreePine,
  Users, BookOpen, Image, Settings, Bell, MoreHorizontal,
  MapPin, CalendarDays, Heart, Share2, Download, Sparkles,
  ArrowUpRight, ShieldCheck, Crown, UserRound, GitBranch
} from 'lucide-react'
import { ReactFlow, Background, Controls, MiniMap, Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const initialPeople = [
  { id: '1', name: 'Әбдірахман', surname: 'Ержігіт', years: '1928 — 2004', place: 'Қостанай облысы', role: 'Арғы ата', generation: 'I', x: 360, y: 30, gender: 'male' },
  { id: '2', name: 'Сейітжан', surname: 'Ержігіт', years: '1954 — 2018', place: 'Торғай', role: 'Ата', generation: 'II', x: 360, y: 220, gender: 'male' },
  { id: '3', name: 'Күләш', surname: 'Ахметова', years: '1958 —', place: 'Амангелді', role: 'Әже', generation: 'II', x: 650, y: 220, gender: 'female' },
  { id: '4', name: 'Ерлан', surname: 'Ержігіт', years: '1982 —', place: 'Қостанай', role: 'Әке', generation: 'III', x: 220, y: 420, gender: 'male' },
  { id: '5', name: 'Айгүл', surname: 'Ержігіт', years: '1985 —', place: 'Қостанай', role: 'Ана', generation: 'III', x: 500, y: 420, gender: 'female' },
  { id: '6', name: 'Данияр', surname: 'Ержігіт', years: '2001 —', place: 'Астана', role: 'Бала', generation: 'IV', x: 360, y: 620, gender: 'male' },
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' },
  { id: 'e4-6', source: '4', target: '6', type: 'smoothstep' },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep' },
]

function PersonNode({ data }) {
  return (
    <div className="person-node">
      <Handle type="target" position={Position.Top} />
      <div className={`node-avatar ${data.gender === 'female' ? 'female' : ''}`}>
        {data.name?.slice(0, 1)}{data.surname?.slice(0, 1)}
      </div>
      <div className="node-copy">
        <strong>{data.name} {data.surname}</strong>
        <span>{data.years}</span>
        <small>{data.role}</small>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

const nodeTypes = { person: PersonNode }

function App() {
  const [people, setPeople] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tamyr-people')) || initialPeople } catch { return initialPeople }
  })
  const [active, setActive] = useState('1')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [form, setForm] = useState({ name: '', surname: '', years: '', place: '', role: 'Ата', gender: 'male', parentId: '1' })
  const [notice, setNotice] = useState('')

  const nodes = useMemo(() => people.map((p, i) => ({
    id: p.id,
    type: 'person',
    position: { x: p.x ?? 120 + (i % 3) * 280, y: p.y ?? 80 + Math.floor(i / 3) * 190 },
    data: p,
  })), [people])
  const edges = useMemo(() => {
    const ids = new Set(people.map(p => p.id))
    return initialEdges.filter(e => ids.has(e.source) && ids.has(e.target))
  }, [people])
  const selected = people.find(p => p.id === active) || people[0]
  const filtered = people.filter(p => `${p.name} ${p.surname} ${p.place}`.toLowerCase().includes(search.toLowerCase()))

  function addPerson(e) {
    e.preventDefault()
    const id = String(Date.now())
    const parent = people.find(p => p.id === form.parentId)
    const next = [...people, { ...form, id, years: form.years || '—', generation: parent ? String(Number(parent.generation) + 1) : 'I', x: (parent?.x ?? 300) + (people.length % 2 ? 180 : -180), y: (parent?.y ?? 40) + 190 }]
    setPeople(next)
    localStorage.setItem('tamyr-people', JSON.stringify(next))
    setActive(id)
    setShowModal(false)
    setNotice('Жаңа адам шежіреге қосылды')
    setTimeout(() => setNotice(''), 2800)
    setForm({ name: '', surname: '', years: '', place: '', role: 'Ата', gender: 'male', parentId: '1' })
  }

  function resetDemo() {
    setPeople(initialPeople)
    localStorage.removeItem('tamyr-people')
    setActive('1')
    setNotice('Демо шежіре қалпына келтірілді')
    setTimeout(() => setNotice(''), 2800)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><TreePine size={23} strokeWidth={1.8} /></div>
          <div><b>TAMYR</b><span>ТАРИХЫҢДЫ САҚТА</span></div>
          <button className="mobile-close" onClick={() => setMobileMenu(false)}><X size={19} /></button>
        </div>
        <div className="workspace-label">ЖҰМЫС КЕҢІСТІГІ</div>
        <button className="family-switch"><span className="family-icon">Е</span><span><b>Ержігіт әулеті</b><small>Жеке шежіре</small></span><ChevronDown size={16} /></button>
        <div className="nav-label">МӘЗІР</div>
        <nav className="side-nav">
          <a className="nav-item active" href="#tree"><GitBranch size={18} />Менің шежірем</a>
          <a className="nav-item" href="#family"><Users size={18} />Отбасым <span className="nav-count">{people.length}</span></a>
          <a className="nav-item" href="#archive"><Image size={18} />Отбасылық архив</a>
          <a className="nav-item" href="#stories"><BookOpen size={18} />Әулет тарихы</a>
        </nav>
        <div className="nav-label explore-label">ЗЕРТТЕУ</div>
        <nav className="side-nav">
          <a className="nav-item" href="#search"><Search size={18} />Шежірені іздеу</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="privacy-card"><ShieldCheck size={19} /><div><b>Деректеріңіз қорғалған</b><span>Шежіреңіз әзірге жеке</span></div></div>
          <button className="nav-item settings"><Settings size={18} />Баптаулар</button>
          <div className="user-mini"><div className="user-avatar">GE</div><div><b>Әулет әкімшісі</b><span>Тегін жоспар</span></div><MoreHorizontal size={19} /></div>
        </div>
      </aside>

      {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Жабу" />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileMenu(true)}><Menu size={21} /></button>
          <div className="breadcrumbs">Менің кеңістігім <ChevronRight size={14} /> <b>Менің шежірем</b></div>
          <div className="top-actions">
            <div className="search-box"><Search size={17} /><input placeholder="Адамды іздеу..." value={search} onChange={e => setSearch(e.target.value)} /><kbd>⌘ K</kbd></div>
            <button className="icon-button" aria-label="Хабарландырулар"><Bell size={19} /><i /></button>
            <div className="top-avatar">GE</div>
          </div>
        </header>

        <div className="content-wrap">
          <section className="welcome-row">
            <div><div className="eyebrow"><span /> ЖЕКЕ КЕҢІСТІК</div><h1>Ержігіт әулетінің <em>шежіресі</em></h1><p>Өткенді ұмытпай, келешекке аманат етейік.</p></div>
            <button className="primary-button" onClick={() => setShowModal(true)}><Plus size={18} /> Адам қосу</button>
          </section>

          <section className="stats-grid">
            <div className="stat-card"><div className="stat-icon green"><Users size={19} /></div><div><span>Шежіредегі адамдар</span><b>{people.length}</b><small>Отбасы мүшелері</small></div></div>
            <div className="stat-card"><div className="stat-icon gold"><GitBranch size={19} /></div><div><span>Ұрпақ саны</span><b>{new Set(people.map(p => p.generation)).size}</b><small>Буындар тарихы</small></div></div>
            <div className="stat-card"><div className="stat-icon sand"><Image size={19} /></div><div><span>Отбасылық мұра</span><b>0</b><small>Фото мен құжат</small></div></div>
            <div className="stat-card"><div className="stat-icon rose"><Heart size={19} /></div><div><span>Ортақ тарих</span><b>1</b><small>Жеке шежіре</small></div></div>
          </section>

          <section className="tree-section" id="tree">
            <div className="section-heading"><div><div className="eyebrow">ӘУЛЕТТІҢ ТАМЫРЫ</div><h2>Шежіре ағашы</h2><p>Ата-бабадан бүгінгі ұрпаққа дейінгі жол.</p></div><div className="tree-actions"><button className="outline-button" onClick={resetDemo}><Download size={16} /> Қалпына келтіру</button><button className="outline-button" onClick={() => setNotice('Бөлісу мүмкіндігі келесі кезеңде қосылады')}><Share2 size={16} /> Бөлісу</button></div></div>
            <div className="tree-legend"><span><i className="dot male-dot" /> Ер адам</span><span><i className="dot female-dot" /> Әйел адам</span><span><i className="line-dot" /> Ата-ана байланысы</span><span className="tree-hint">Карточканы басып, адам туралы мәліметті көріңіз</span></div>
            <div className="flow-wrap">
              <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.25 }} onNodeClick={(_, node) => setActive(node.id)} nodesDraggable nodesConnectable={false} elementsSelectable proOptions={{ hideAttribution: true }}>
                <Background color="#e8e7df" gap={22} size={1} />
                <Controls />
                <MiniMap pannable zoomable nodeColor={n => n.data.gender === 'female' ? '#c58b9a' : '#548477'} />
              </ReactFlow>
              {nodes.length === 0 && <div className="empty-tree">Әзірге адам қосылмаған</div>}
            </div>
          </section>

          <div className="lower-grid">
            <section className="panel people-panel" id="family">
              <div className="panel-title"><div><h3>Отбасы мүшелері</h3><p>Шежіредегі адамдар тізімі</p></div><button className="text-button" onClick={() => setShowModal(true)}>Барлығын көру <ArrowUpRight size={15} /></button></div>
              <div className="people-list">
                {filtered.slice(0, 5).map(p => <button className={`person-row ${active === p.id ? 'selected' : ''}`} key={p.id} onClick={() => setActive(p.id)}><div className={`list-avatar ${p.gender === 'female' ? 'female' : ''}`}>{p.name.slice(0,1)}{p.surname.slice(0,1)}</div><div className="person-info"><b>{p.name} {p.surname}</b><span>{p.role} · {p.years}</span></div><ChevronRight size={17} /></button>)}
                {filtered.length === 0 && <div className="no-results">Іздеу бойынша адам табылмады.</div>}
              </div>
            </section>
            <section className="panel profile-panel">
              <div className="panel-title"><div><h3>Адам туралы</h3><p>Таңдалған адамның деректері</p></div><button className="more-button"><MoreHorizontal size={19} /></button></div>
              {selected ? <><div className="profile-person"><div className={`profile-avatar ${selected.gender === 'female' ? 'female' : ''}`}>{selected.name.slice(0,1)}{selected.surname.slice(0,1)}</div><div><h4>{selected.name} {selected.surname}</h4><span>{selected.role}</span></div></div><div className="detail-list"><div><CalendarDays size={16} /><span>Өмір сүрген жылдары</span><b>{selected.years}</b></div><div><MapPin size={16} /><span>Туған жері</span><b>{selected.place || 'Көрсетілмеген'}</b></div><div><GitBranch size={16} /><span>Ұрпағы</span><b>{selected.generation}-буын</b></div></div><div className="profile-note"><Sparkles size={16} /><span>Бұл адамның өмір тарихын толықтыру арқылы әулет мұрасын сақтаңыз.</span></div></> : <div className="no-results">Адамды таңдаңыз.</div>}
            </section>
          </div>

          <footer className="footer"><span>© 2026 TAMYR</span><span>Ұрпақтан ұрпаққа жалғасқан мұра.</span><span>Қазақ тілінде жасалған <Crown size={13} /></span></footer>
        </div>
      </main>

      {showModal && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowModal(false)}><form className="person-modal" onSubmit={addPerson}><div className="modal-head"><div><div className="eyebrow">ШЕЖІРЕНІ ТОЛЫҚТЫРУ</div><h2>Жаңа адам қосу</h2><p>Әулет тарихына тағы бір есім енгізіңіз.</p></div><button type="button" className="icon-button" onClick={() => setShowModal(false)}><X size={19} /></button></div><label>Аты<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Мысалы, Ахмет" /></label><label>Тегі<input required value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })} placeholder="Мысалы, Ержігіт" /></label><div className="form-two"><label>Өмір сүрген жылдары<input value={form.years} onChange={e => setForm({ ...form, years: e.target.value })} placeholder="1950 — 2020" /></label><label>Туған жері<input value={form.place} onChange={e => setForm({ ...form, place: e.target.value })} placeholder="Ауыл, аудан" /></label></div><div className="form-two"><label>Туыстық атауы<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>Ата</option><option>Әже</option><option>Әке</option><option>Ана</option><option>Бала</option><option>Аға</option><option>Әпке</option><option>Нағашы</option><option>Басқа</option></select></label><label>Жынысы<select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option value="male">Ер адам</option><option value="female">Әйел адам</option></select></label></div><label>Шежіредегі байланысы<select value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })}>{people.map(p => <option key={p.id} value={p.id}>{p.name} {p.surname}</option>)}</select></label><div className="modal-actions"><button type="button" className="outline-button" onClick={() => setShowModal(false)}>Болдырмау</button><button className="primary-button" type="submit"><Plus size={17} /> Қосу</button></div></form></div>}
      {notice && <div className="toast"><span>✓</span>{notice}</div>}
    </div>
  )
}

export default App