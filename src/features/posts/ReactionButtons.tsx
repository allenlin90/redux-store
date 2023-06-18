import { useDispatch } from 'react-redux';
import { type Post, type Reactions, reactionAdded } from '~/features';

type ReactionEmoji = Record<keyof Reactions, string>;

const reactionEmoji: ReactionEmoji = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕',
};

export const ReactionButtons: React.FC<{ post: Post }> = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    const reactionKey = name as keyof Reactions;

    return (
      <button
        key={name}
        type='button'
        className='reactionButton'
        onClick={() =>
          dispatch(reactionAdded({ postId: post.id, reaction: reactionKey }))
        }
      >
        {emoji} {post.reactions[reactionKey]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
