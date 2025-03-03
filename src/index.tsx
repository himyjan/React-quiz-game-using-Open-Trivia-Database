import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider {...{ withNormalizeCSS: true, withGlobalStyles: true }}>
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
