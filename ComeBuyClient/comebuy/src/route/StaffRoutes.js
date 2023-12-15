import React from 'react';
import Invoice from '../container/Invoice';

const staffRoutes = [
  {
    name: 'Hóa đơn',
    path: '/invoice/*',
    exact: true,
    page: <Invoice />,
  }
];

const staffMenuItems = [
  {
    name: 'Hóa đơn',
    path: '/invoice/*',
    page: <Invoice />,
  }
]





export { staffRoutes, staffMenuItems };