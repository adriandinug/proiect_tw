import { useState, useEffect, useCallback } from 'react';
import '../styles/filters.css';

function Filters({ notes, changeNotes }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sort, setSort] = useState('created');
  const [subjects, setSubjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');

  const filterType = useCallback(
    (type) => {
      const filteredNotes = notes.filter((note) => {
        if (type === 'ALL') {
          return true;
        } else {
          return note.type === type;
        }
      });
      return filteredNotes;
    },
    [notes],
  );

  const filterSubject = useCallback(
    (sub) => {
      const filteredNotes = notes.filter((note) => {
        if (sub === 'ALL') {
          return true;
        } else {
          return note.materie.toUpperCase() === sub;
        }
      });
      return filteredNotes;
    },
    [notes],
  );

  const filterTag = useCallback(
    (tag) => {
      const filteredNotes = notes.filter((note) => {
        if (tag === 'ALL') {
          return true;
        } else {
          if (note.tags.length === 0) return false;
          const tags = note.tags.split(',').map((t) => t.toUpperCase());
          return tags.includes(tag);
        }
      });
      return filteredNotes;
    },
    [notes],
  );

  const setFirstLetter = useCallback((str) => {
    return str[0].toUpperCase() + str.slice(1);
  }, []);

  useEffect(() => {
    const subjects = [];
    const tags = [];
    notes.forEach((note) => {
      const upperSubjects = subjects.map((s) => s.toUpperCase());
      if (!upperSubjects.includes(note.materie.toUpperCase())) {
        subjects.push(setFirstLetter(note.materie));
      }
      if (note.tags.length > 0) {
        note.tags.split(',').forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      }
    });
    setSubjects(subjects);
    setTags(tags);
  }, [notes, setFirstLetter]);

  const sortFunc = useCallback(
    (filtered) => {
      const sortedNotes = filtered.sort((a, b) => {
        if (sort === 'created') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sort === 'updated') {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        } else if (sort === 'name') {
          return a.fileName.localeCompare(b.fileName);
        }
        return 0;
      });
      return sortedNotes;
    },
    [sort],
  );

  const filter = useCallback(() => {
    const filteredType = filterType(typeFilter.toUpperCase());
    const filteredSubject = filterSubject(subjectFilter.toUpperCase());
    const filteredTag = filterTag(tagFilter.toUpperCase());
    const filteredNotes = filteredType.filter((note) => {
      return filteredSubject.includes(note) && filteredTag.includes(note);
    });
    return filteredNotes;
  }, [typeFilter, subjectFilter, tagFilter, filterType, filterSubject, filterTag]);

  const searchFunc = useCallback(
    (sorted) => {
      const searchedNotes = sorted.filter((note) => {
        return note.fileName.toUpperCase().includes(search.toUpperCase());
      });
      return searchedNotes;
    },
    [search],
  );

  useEffect(() => {
    const filteredNotes = filter();
    const sortedNotes = sortFunc(filteredNotes);
    const searchedNotes = searchFunc(sortedNotes);
    changeNotes(searchedNotes);
  }, [
    typeFilter,
    subjectFilter,
    tagFilter,
    sort,
    filter,
    sortFunc,
    changeNotes,
    searchFunc,
    search,
  ]);

  const resetFilters = () => {
    setTypeFilter('all');
    setSubjectFilter('all');
    setTagFilter('all');
    setSort('created');
    setSearch('');
  };

  return (
    <>
      <div className='filters'>
        <div className='filter'>
          <h5>Filter by type</h5>
          <select
            name='type'
            id='type'
            onChange={(e) => setTypeFilter(e.target.value)}
            value={typeFilter}
          >
            <option value='all'>All</option>
            <option value='curs'>Curs</option>
            <option value='seminar'>Seminar</option>
          </select>
        </div>
        <div className='filter'>
          <h5>Filter by subject</h5>
          <select
            name='subject'
            id='subject'
            onChange={(e) => setSubjectFilter(e.target.value)}
            value={subjectFilter}
          >
            <option value='all'>All</option>
            {subjects.map((subject, i) => (
              <option value={subject} key={i}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className='filter'>
          <h5>Filter by tag</h5>
          <select
            name='tag'
            id='tag'
            onChange={(e) => {
              setTagFilter(e.target.value);
            }}
            value={tagFilter}
          >
            <option value='all'>All</option>
            {tags.map((tag, i) => (
              <option value={tag} key={i}>
                {tag}
              </option>
            ))}
          </select>
        </div>
        <div className='filter'>
          <h5>Sort by</h5>
          <select
            name='sort'
            id='sort'
            onChange={(e) => setSort(e.target.value)}
            value={sort}
          >
            <option value='created'>Created at</option>
            <option value='updated'>Updated at</option>
            <option value='name'>Name</option>
          </select>
        </div>
        <div className='filter reset'>
          <button className='button button--secondary' onClick={resetFilters}>
            Reset filters
          </button>
        </div>
      </div>
      <div className='search'>
        <h5>Search</h5>
        <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
    </>
  );
}

export default Filters;
