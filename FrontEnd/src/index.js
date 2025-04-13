import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import DiscoverChannels from './components/DiscoverChannels';
import Home from './components/Home';
import './App.css';
import LandingPage from './components/LandingPage';
import ChannelPage from './components/ChannelPage';
import { UserProvider } from './components/UserContext';

const router = createBrowserRouter([
  {path:'/', element:<LandingPage />},
  {path:'/home', element:<Home />},
  {path:'/discover', element:<DiscoverChannels />},
  {path:'/landing', element:<LandingPage />},
  {path:'/channel/:channelId', element:<ChannelPage />}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>
);
