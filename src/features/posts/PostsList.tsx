import { useSelector } from 'react-redux';
import { useGetPostsQuery, selectPostIds, PostsExcerpt } from '~/features';

export const PostsList: React.FC = () => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();

  const orderedPostIds = useSelector(selectPostIds);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId as string} />
    ));
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return <section>{content}</section>;
};

export default PostsList;
