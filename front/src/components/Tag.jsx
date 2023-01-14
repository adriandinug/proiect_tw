import '../styles/tag.css';

function Tag({ name, deleteTag }) {
  return (
    <p className='tag'>
      {name}{' '}
      <span className='delete' onClick={deleteTag}>
        X
      </span>
    </p>
  );
}

export default Tag;
