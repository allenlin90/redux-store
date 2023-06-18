import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectAllPosts,
  getPostsStatus,
  getPostsError,
  fetchPosts,
} from '~/features/posts/postsSlice';
import { useDispatchTyped } from '~/app/store';
import { PostsExcerpt } from '~/features';

export const PostsList: React.FC = () => {
  const dispatch = useDispatchTyped();
  const initRef = useRef<boolean>(false);

  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  useEffect(() => {
    if (!initRef.current) {
      if (postsStatus === 'idle') {
        dispatch(fetchPosts());
      }
    }

    return () => {
      initRef.current = true;
    };
  }, [postsStatus, dispatch]);

  let content;
  if (postsStatus === 'loading') {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === 'succeeded') {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post) => (
      <PostsExcerpt key={post.id} post={post} />
    ));
  } else if (postsStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};

export default PostsList;
