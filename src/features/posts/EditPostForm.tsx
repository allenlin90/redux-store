import { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { type RootState, useDispatchTyped } from '~/app/store';
import {
  selectPostById,
  updatePost,
  deletePost,
  selectAllUsers,
} from '~/features';

export const EditPostForm: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useSelector((state: RootState) =>
    selectPostById(state, Number(postId))
  );
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);
  const [requestStatus, setRequestStatus] = useState<Status>('idle');

  const dispatch = useDispatchTyped();

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const onTitleChanged: React.EventHandler<ChangeEvent<HTMLInputElement>> = (
    e
  ) => setTitle(e.target.value);
  const onContentChanged: React.EventHandler<
    ChangeEvent<HTMLTextAreaElement>
  > = (e) => setContent(e.target.value);
  const onAuthorChanged: React.EventHandler<ChangeEvent<HTMLSelectElement>> = (
    e
  ) => setUserId(+e.target.value);

  const canSave =
    [title, content, userId].every(Boolean) && requestStatus === 'idle';

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus('pending');
        dispatch(
          updatePost({
            id: post.id,
            title: title!,
            body: content!,
            userId: userId!,
            reactions: post.reactions,
          })
        ).unwrap();

        setTitle('');
        setContent('');
        setUserId(undefined);
        navigate(`/post/${postId}`);
      } catch (error) {
        console.error('Failed to save the post', error);
      } finally {
        setRequestStatus('idle');
      }
    }
  };

  const userOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const onDeletePostClicked = () => {
    try {
      setRequestStatus('pending');
      dispatch(deletePost({ id: post.id })).unwrap();

      setTitle('');
      setContent('');
      setUserId(undefined);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete the post', error);
    } finally {
      setRequestStatus('idle');
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor='postAuthor'>Author:</label>
        <select
          id='postAuthor'
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
          <option value=''></option>
          {userOptions}
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
        <button
          className='deleteButton'
          type='button'
          onClick={onDeletePostClicked}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
