import { useSelector } from 'react-redux';
import {
  getPostsStatus,
  getPostsError,
  selectPostIds,
  PostsExcerpt,
} from '~/features';

export const PostsList: React.FC = () => {
  const orderedPostIds = useSelector(selectPostIds);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  let content;
  if (postsStatus === 'loading') {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === 'succeeded') {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId as string} />
    ));
  } else if (postsStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};

export default PostsList;
