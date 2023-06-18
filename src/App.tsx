import './App.css';
import { AddPostForm, PostsList } from '~/features';

function App() {
  return (
    <>
      <main className='App'>
        <AddPostForm />
        <PostsList />
      </main>
    </>
  );
}

export default App;
