import React from 'react';
import HomePage from '../container/HomePage';
import ProductSpace from '../container/ProductSpace';
import DetailProduct from '../container/Product/DetailProduct';
import { ForgotPassword } from '../components';
import GuestCart from '../container/GuestCart';
import { CheckoutPage } from '../container/Checkout';

const guestRoutes = [
  {
    name: 'Guest Cart',
    path: '/guestCart',
    page: <GuestCart />,
  },
  {
    name: 'Product Space',
    path: '/productSpace',
    page: <ProductSpace />,
  },
  {
    name: 'Home',
    path: '/',
    page: <HomePage />,
  },
  {
    name: 'ForgotPassword',
    path: '/myplace/resetpassword',
    page: <ForgotPassword />,
  },
  {
    name: 'DetailProduct',
    path: '/productSpace/:id',
    page: <DetailProduct />
  },
  {
    name: 'Check out cart',
    path: '/myplace/mycart/checkout',
    page: <CheckoutPage />
  }
];

const guestMenuItems = []

export { guestRoutes, guestMenuItems };