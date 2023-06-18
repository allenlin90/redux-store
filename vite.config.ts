import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const PORT = +process.env.PORT;
  const port = Number.isNaN(PORT) ? 3000 : PORT;

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port,
    },
  });
};
