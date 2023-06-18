import { useSelector } from 'react-redux';
import { selectAllUsers } from '../users';

export const PostAuthor: React.FC<{ userId: string }> = ({ userId }) => {
  const users = useSelector(selectAllUsers);

  const author = users.find((user) => user.id === userId);

  return <span>by {author ? author.name : 'Unknown author'}</span>;
};

export default PostAuthor;
