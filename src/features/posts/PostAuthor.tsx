import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users';
import { Link } from 'react-router-dom';

export const PostAuthor: React.FC<{ userId: number }> = ({ userId }) => {
  const users = useSelector(selectAllUsers);

  const author = users.find((user) => user.id === userId);

  return (
    <span>
      by&nbsp;
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        'Unknown author'
      )}
    </span>
  );
};

export default PostAuthor;
