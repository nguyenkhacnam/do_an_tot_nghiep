import React from 'react';
import HomePage from '../container/HomePage';
import ProductSpace from '../container/ProductSpace';
import Profile from '../container/Profile';
import CustomerPlace from './../container/CustomerPlace/index';
import DetailProduct from '../container/Product/DetailProduct';
import { ForgotPassword } from '../components';
import CustomerCart from '../container/CustomerCart';
import { CheckoutPage } from '../container/Checkout';
import FavoritePlace from './../container/Favourite/index';
import { CustomerOrderSpace } from '../container/CustomerOrder';

const customerRoutes = [
  {
    name: 'Customer Place',
    path: '/myplace',
    page: <CustomerPlace />,
  },
  {
    name: 'Product Space',
    path: '/productSpace',
    page: <ProductSpace />,
  },
  {
    name: 'Profile',
    path: '/profile',
    page: <Profile />,
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
    name: 'My Cart',
    path: '/myplace/mycart',
    page: <CustomerCart />,
  },
  {
    name: 'Check out cart',
    path: '/myplace/mycart/checkout',
    page: <CheckoutPage />
  },
  {
    name: ' Favorite place',
    path: '/myplace/myfavorite',
    page: <FavoritePlace />
  },
  {
    name: 'Orders space',
    path: '/myplace/myorders',
    page: <CustomerOrderSpace />
  }
];

const customerMenuItems = []

export { customerRoutes, customerMenuItems };