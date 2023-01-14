import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Tag from './Tag';

function EditNote({ user, updateNote }) {
  const params = useParams();
  const { id } = params;
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: `${note?.fileName || ''}`,
      type: `${note?.type || ''}`,
      subject: `${note?.materie || ''}`,
    },
    onSubmit: (values) => {
      saveNote(values);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    fetch('http://localhost:3000/api/user/note/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNote(data.note);
        const tags = data.note.tags;
        const newTags = tags.length > 0 ? data.note.tags.split(',') : [];
        setTags(newTags);
      });
  }, [user, id]);

  const setFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const saveNote = (values) => {
    const { name: fileName, type, subject } = values;
    const materie = setFirstLetter(subject);
    const newTags = tags.length > 0 ? tags.join(',') : '';
    const data = {
      fileName,
      type,
      materie,
      content: note.content,
      tags: newTags,
    };
    fetch('http://localhost:3000/api/user/note/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Token': user.token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.updated === true) {
          setNote(data.note);
          updateNote(data.note);
        }
      });
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tag !== '' && tag.length <= 10) {
      if (!tags.includes(tag)) {
        setTags([...tags, tag]);
        setTag('');
      }
    }
  };

  const deleteTag = (e) => {
    const tag = e.target.parentElement.textContent.split(' ')[0];
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
  };

  return (
    <form className='edit-wrapper' onSubmit={formik.handleSubmit}>
      <div className='field'>
        <label htmlFor='name'>Note Name</label>
        <input
          type='text'
          id='name'
          onChange={formik.handleChange}
          value={formik.values.name}
        />
      </div>

      <div className='field'>
        <label htmlFor='subject'>Subject</label>
        <input
          type='text'
          id='subject'
          onChange={formik.handleChange}
          value={formik.values.subject}
        />
      </div>
      <div className='field'>
        <p>Type</p>
        <div>
          <div>
            <input
              type='radio'
              id='curs'
              name='type'
              value='CURS'
              onChange={formik.handleChange}
              checked={formik.values.type === 'CURS'}
            />
            <label htmlFor='curs'>Curs</label>
          </div>
          <div>
            <input
              type='radio'
              id='seminar'
              name='type'
              value='SEMINAR'
              checked={formik.values.type === 'SEMINAR'}
              onChange={formik.handleChange}
            />
            <label htmlFor='seminar'>Seminar</label>
          </div>
        </div>
      </div>
      <div className='field-tags'>
        <div>
          <label htmlFor='tags'>Tags</label>
          <input
            type='text'
            id='tags'
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <button className='add-tag' onClick={addTag}>
            Add
          </button>
          <div className='tags'>
            {tags.map((tag, index) => (
              <Tag name={tag} key={index} deleteTag={deleteTag} />
            ))}
          </div>
        </div>
      </div>
      <button type='submit' className='button button--primary'>
        Save note details
      </button>
    </form>
  );
}

export default EditNote;
