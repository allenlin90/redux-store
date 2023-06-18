import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAdded } from '~/features/posts/postsSlice';
import { selectAllUsers } from '../users';

export const AddPostForm: React.FC = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  const users = useSelector(selectAllUsers);

  const onTitleChanged: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (e) => setTitle(e.target.value);
  const onContentChanged: React.EventHandler<
    React.ChangeEvent<HTMLTextAreaElement>
  > = (e) => setContent(e.target.value);
  const onAuthChanged: React.EventHandler<
    React.ChangeEvent<HTMLSelectElement>
  > = (e) => setUserId(e.target.value);

  const onSavePostClicked: React.EventHandler<
    React.MouseEvent<HTMLButtonElement>
  > = () => {
    if (title && content) {
      dispatch(postAdded({ title, content, userId }));

      setTitle('');
      setContent('');
    }
  };

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor='postTitle'>Post Title</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor='postAuthor'>Author:</label>
        <select id='postAuthor' value={userId} onChange={onAuthChanged}>
          <option value='' disabled />
          {usersOptions}
        </select>
        <label htmlFor='postContent'>Content:</label>
        <textarea
          id='postContent'
          name='postContent'
          value={content}
          onChange={onContentChanged}
        />
        <button type='button' onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
