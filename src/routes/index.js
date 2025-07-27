import React from 'react';
import { useRoutes } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard'
import Calender from '../components/Calender/CalenderComponent'

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '/home',
      element: <Calender />,
    },
  ]);

  return routes;
}

export default AppRoutes;