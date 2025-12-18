import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

interface Note {
  id: string;
  date: string;
  content: string;
}

export default function NotesTable() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', date: new Date().toISOString().split('T')[0], content: 'Sample note - edit or delete' }
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          content: newNote
        }
      ]);
      setNewNote('');
    }
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-muted/30 px-6 py-4 border-b">
        <h2 className="font-semibold text-lg text-foreground">Notes</h2>
        <p className="text-xs text-muted-foreground mt-1">Keep track of important information</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/20">
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="border-b hover:bg-muted/10 transition-colors">
                <td className="px-6 py-3 text-sm text-muted-foreground font-mono whitespace-nowrap">{note.date}</td>
                <td className="px-6 py-3 text-sm">
                  <input
                    type="text"
                    value={note.content}
                    onChange={(e) => updateNote(note.id, e.target.value)}
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 font-medium text-foreground placeholder-muted-foreground"
                    placeholder="Add your note here..."
                  />
                </td>
                <td className="px-6 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Note */}
      <div className="bg-muted/5 px-6 py-4 border-t flex gap-2">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addNote()}
          placeholder="Add a new note..."
          className="flex-1"
        />
        <Button
          onClick={addNote}
          className="bg-accent hover:bg-accent/90 text-white"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
}
