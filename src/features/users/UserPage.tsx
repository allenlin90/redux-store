import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import type { RootState } from '~/app/store';
import { selectUserById, useGetPostsByUserIdQuery } from '~/features';

export const UserPage: React.FC = () => {
  const { userId } = useParams();
  const user = useSelector((state: RootState) =>
    selectUserById(state, Number(userId))
  );

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId!);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;
    content = ids.map((id) => (
      <li key={id}>{<Link to={`/post/${id}`}>{entities[id]?.title}</Link>}</li>
    ));
  } else if (isError) {
    content = <p>{JSON.stringify(error)}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};
