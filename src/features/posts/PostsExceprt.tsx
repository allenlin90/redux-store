import { memo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '~/app/store';
import {
  PostAuthor,
  ReactionButtons,
  TimeAgo,
  selectPostById,
} from '~/features';

export const PostsExcerpt: React.FC<{ postId: string }> = memo(({ postId }) => {
  const post = useSelector((state: RootState) => selectPostById(state, postId));

  if (!post) return null;

  return (
    <article>
      <h2>{post.title}</h2>
      <p className='excerpt'>{post.body.substring(0, 75)}</p>
      <p className='postCredit'>
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
});

export default PostsExcerpt;
