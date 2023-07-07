import { useAddReactionMutation, type Post, type Reactions } from '~/features';

type ReactionEmoji = Record<keyof Reactions, string>;

const reactionEmoji: ReactionEmoji = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕',
};

export const ReactionButtons: React.FC<{ post: Post }> = ({ post }) => {
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    const reactionKey = name as keyof Reactions;

    return (
      <button
        key={name}
        type='button'
        className='reactionButton'
        onClick={() => {
          const newValue = post.reactions[reactionKey] + 1;
          addReaction({
            postId: post.id,
            reactions: { ...post.reactions, [name]: newValue },
          });
        }}
      >
        {emoji} {post.reactions[reactionKey]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
