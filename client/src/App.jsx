import React, {useEffect,useState} from 'react'

const API = 'http://localhost:3000'

function ItemForm({ initial = { name: '', description: '' }, onCancel, onSave }) {
  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  return (
    <div className="item-form">
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <button onClick={() => onSave({ name, description })}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}

export default function App() {
  const [items, setItems] = useState([])
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  useEffect(()=>{
    if (!visible) return
    fetch(API + '/items').then(r=>r.json()).then(setItems).catch(()=>setItems([]))
  }, [visible])

  function refresh(){
    fetch(API + '/items').then(r=>r.json()).then(setItems).catch(()=>setItems([]))
  }

  async function handleCreate(data){
    await fetch(API + '/items', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
    setCreating(false)
    refresh()
  }

  async function handleUpdate(id, data){
    await fetch(API + '/items/' + id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
    setEditing(null)
    refresh()
  }

  async function handleDelete(id){
    await fetch(API + '/items/' + id, { method: 'DELETE' })
    refresh()
  }

  return (
    <div className="app">
      <h1>Welcome to the React client!</h1>

      <button onClick={() => setVisible(v => !v)}>{visible ? 'Hide Items' : 'Show Items'}</button>

      {visible && (
        <div className="items">
          <div style={{marginTop: '0.5rem'}}>
            <button onClick={() => setCreating(true)}>Create New Item</button>
            <button onClick={refresh} style={{marginLeft: '0.5rem'}}>Refresh</button>
          </div>

          {creating && (
            <ItemForm onCancel={() => setCreating(false)} onSave={handleCreate} />
          )}

          <ul>
            {items.map(it => (
              <li key={it.id} style={{marginTop: '0.5rem'}}>
                <strong>{it.name}</strong>: {it.description}
                <div style={{marginTop: '0.25rem'}}>
                  <button onClick={() => setEditing(it)}>Edit</button>
                  <button onClick={() => handleDelete(it.id)} style={{marginLeft: '0.5rem'}}>Delete</button>
                </div>
                {editing && editing.id === it.id && (
                  <ItemForm initial={editing} onCancel={() => setEditing(null)} onSave={(data)=>handleUpdate(it.id, data)} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}