import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useDispatchTyped } from '~/app/store';
import { increaseCount, getCount } from '~/features';

export const Header: React.FC = () => {
  const dispatch = useDispatchTyped();
  const count = useSelector(getCount);

  return (
    <header className='Header'>
      <h1>Redux Blog</h1>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='post'>Post</Link>
          </li>
          <li>
            <Link to='user'>Users</Link>
          </li>
        </ul>
        <button onClick={() => dispatch(increaseCount())}>{count}</button>
      </nav>
    </header>
  );
};

export default Header;
