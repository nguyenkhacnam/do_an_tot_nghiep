import React from 'react';
import CounterForManager from '../container/CounterForManger';
import Distribution from '../container/Distribution';
import Revenue from '../container/Revenue';

const managerRoutes = [
  {
    name: 'Workspace',
    path: '/workspace/*',
    page: <CounterForManager />,
  },
  {
    name: 'Doanh thu',
    path: '/revenue/*',
    page: <Revenue />,
  },
  {
    name: 'Distribution',
    path: '/distribution/*',
    exact: true,
    page: <Distribution />,
  },
];

const managerMenuItems = [
  {
    name: 'Workspace',
    path: '/workspace/*',
    page: <CounterForManager />,
  },
  {
    name: 'Doanh thu',
    path: '/revenue/*',
    page: <Revenue />,
  },
  {
    name: 'Distribution',
    path: '/distribution/*',
    exact: true,
    page: <Distribution />,
  },
]


export { managerRoutes, managerMenuItems };