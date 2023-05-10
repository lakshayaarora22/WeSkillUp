import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Learn from './pages/Learn';
import { Toaster } from 'react-hot-toast';
import DailyChallenge from './pages/DailyChallenge';
import PersonalInformation from './pages/PersonalInformation';
import Level from './pages/Level';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Game from './pages/Game';
import OneVsOne from './sockets/OneVsOne';
import Multiplayer from './sockets/Multiplayer';
import MultiplayerGame from './sockets/MultiplayerGame';
import Settings from './pages/Settings';
import DeleteAccount from './pages/DeleteAccount';
import OneVsOneGame from './sockets/OneVsOneGame';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: '/learn',
    element: <Learn />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: 'dailyChallenge',
    element: <DailyChallenge />,
  },
  {
    path: 'personalInformation',
    element: <PersonalInformation />,
  },
  {
    path: 'level',
    element: <Level />,
  },
  {
    path: 'profile',
    element: <Profile />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/game',
    element: <Game />,
  },
  {
    path: '/oneVsOne',
    element: <OneVsOne />,
  },
  {
    path: '/multiplayer', 
    element: <Multiplayer />,
  },
  {
    path: '/multiplayer/:roomId',
    element: <MultiplayerGame />
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/deleteAccount',
    element: <DeleteAccount />,
  },
  {
    path: '/singlePlayer/:accepter',
    element: <OneVsOneGame />,
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
