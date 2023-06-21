import { Outlet } from 'react-router-dom';
import { Header } from '~/components';

export const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <main className='app'>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
