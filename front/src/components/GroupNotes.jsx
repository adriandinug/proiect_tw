import Filters from './Filters';
import NotesList from './NotesList';
import { useParams } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';

function GroupNotes({ user }) {
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [notes, setNotes] = useState([]);

  const { id } = useParams();

  const getNotes = useCallback(() => {
    if (user) {
      fetch('http://localhost:3000/api/groups/notes/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Group-Id': id,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setNotes(data.notes);
          setFilteredNotes(data.notes);
        });
    }
  }, [user, id]);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <div className='group-notes'>
      <h4 style={{ marginBottom: '20px' }}>Group notes</h4>
      <Filters notes={notes || []} changeNotes={setFilteredNotes} />
      <NotesList notes={filteredNotes || []} user={user} refresh={getNotes} />
    </div>
  );
}

export default GroupNotes;
