import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '~/App';
import './index.css';

import { Provider } from 'react-redux';
import { store } from '~/app/store';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { apiSlice } from '~/features';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ApiProvider api={apiSlice}>
        <Router>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </Router>
      </ApiProvider>
    </Provider>
  </React.StrictMode>
);
