'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Note = {
  id: number
  content: string
  created_at: string
}

export default function Home() {
  const [text, setText] = useState('')
  const [notes, setNotes] = useState<Note[]>([])

  async function loadNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setNotes(data)
  }

  async function saveNote() {
    if (!text.trim()) return

    const { error } = await supabase
      .from('notes')
      .insert([{ content: text }])

    if (error) {
      alert(error.message)
      return
    }

    setText('')
    loadNotes()
  }

  useEffect(() => {
    loadNotes()
  }, [])

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Mike OS</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-40 bg-zinc-900 border border-zinc-700 p-4 rounded"
        placeholder="Dump thoughts here..."
      />

      <button
        onClick={saveNote}
        className="mt-4 bg-blue-600 px-6 py-3 rounded"
      >
        Save
      </button>

      <h2 className="text-2xl font-bold mt-10 mb-4">Saved Notes</h2>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-zinc-900 border border-zinc-700 p-4 rounded">
            <p>{note.content}</p>
            <p className="text-xs text-zinc-500 mt-2">
              {new Date(note.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}