import {
  Facebook,
  Instagram,
  MailOutline,
  Phone,
  Pinterest,
  Room,
  Twitter,
} from "@material-ui/icons";

import styled from "styled-components";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';

import { accountSlice } from "../../redux/slices/accountSlice";
import { Typography, Link } from '@mui/material';
import { currentUser } from './../../redux/selectors';


const BigFooter = () => {

  const _curUser = useSelector(currentUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const gotoHome = () => navigate('/')

  const gotoCart = () => {
    if (_curUser.role === "customer") {
      navigate('/myplace/mycart')
    }
  }

  const gotoFavorite = () => {
    if (_curUser.role === "customer") {
      navigate('/myplace/myfavorite')
    }
  }

  const gotoPlace = () => {
    if (_curUser.role === "customer") {
      navigate('/myplace')
    }
  }
  const gotoOrders = () => {
    if (_curUser.role === "customer") {
      navigate('/myplace/myorders')
    }
  }

  const logOut = async () => {
    dispatch(accountSlice.actions.logout());
    localStorage.setItem('role', '')
    localStorage.setItem('cart', JSON.stringify([]));
    navigate("/")
  }

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px'
        }}
      >
        <h1>COMEBUY.</h1>
        <p style={{ margin: '20px 0px' }}>
          ComeBuy is a web store which includes a lot of the best laptop in the world.
          Come with us, you will never be confused about choosing type, proper price of Laptop you want
        </p>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#3B5999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}
          >
            <Facebook />
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#E4405F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}
          >
            <Instagram />
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#55ACEE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}
          >
            <Twitter />
          </div>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#E60023',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px'
            }}
          >
            <Pinterest />
          </div>
        </div>
      </div>
      <div style={{
        flex: 1,
        padding: '20px'
      }}
      >
        <h3 style={{ marginBottom: '30px' }}>Useful Links</h3>
        <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexWrap: 'wrap'
        }}>
          <li style={{
            width: '50%',
            marginBottom: '10px'
          }}>
            <Link
              underline="hover"
              key="2"
              style={{ color: 'black', cursor: 'pointer' }}
              onClick={gotoHome}
            >
              Home
            </Link>
          </li>
          <li style={{
            width: '50%',
            marginBottom: '10px'
          }}>
            <Link
              underline="hover"
              key="2"
              style={{ color: 'black', cursor: 'pointer' }}
              onClick={gotoCart}
            >
              Your cart
            </Link>
          </li>
          <li style={{
            width: '50%',
            marginBottom: '10px'
          }}>
            <Link
              underline="hover"
              key="2"
              style={{ color: 'black', cursor: 'pointer' }}
              onClick={gotoPlace}
            >
              Your place
            </Link>
          </li>
          <li style={{
            width: '50%',
            marginBottom: '10px'
          }}>
            <Link
              underline="hover"
              key="2"
              style={{ color: 'black', cursor: 'pointer' }}
              onClick={gotoFavorite}
            >
              Your favorite
            </Link>
          </li>
          <li style={{
            width: '50%',
            marginBottom: '10px'
          }}>
            <Link
              underline="hover"
              key="2"
              style={{ color: 'black', cursor: 'pointer' }}
              onClick={gotoOrders}
            >
              Your orders
            </Link>
          </li>
          <li style={{
            width: '50%',
            marginBottom: '10px'
          }}>
            <Link
              underline="hover"
              key="2"
              style={{ color: 'black', cursor: 'pointer' }}
              onClick={logOut}
            >
              Log out
            </Link>
          </li>
        </ul>
      </div>
      <div style={{
        flex: 1,
        padding: '20px'
      }}>
        <h3 style={{ marginBottom: '30px' }}>Contact</h3>
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Room style={{ marginRight: "10px" }} /> KTPM2019, Software engineering team 89, UIT
        </div>
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Phone style={{ marginRight: "10px" }} /> +84 358075274
        </div>
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <MailOutline style={{ marginRight: "10px" }} /> comebuyproject@gmail.com
        </div>
        <img style={{ width: '50%' }} src="https://i.ibb.co/Qfvn4z6/payment.png" />
      </div>
    </div>
  );
};

export default BigFooter;