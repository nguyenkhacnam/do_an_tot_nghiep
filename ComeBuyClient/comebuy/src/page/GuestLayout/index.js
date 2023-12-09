import * as React from 'react';
import { useState, useEffect } from 'react'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import NotFound from '../../container/NotFound';
import { useDispatch } from 'react-redux';

const GuestLayout = props => {
  const [pathname, setPathname] = useState(window.location.pathname);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    const path = window.location.pathname;
    setPathname(path);
  });

  const showRoutes = routes => {
    var result = null;
    if (routes.length > 0) {
      result = routes.map((route, index) => {
        return <Route key={index} path={route.path} element={route.page} />;
      });
    }
    result.push(<Route key={routes.length} path="/error" element={<NotFound />} />);
    return result;
  };

  const [state, setState] = React.useState(false)

  return (
    <div style={{ height: 850, width: '100%' }}>
      <div style={{ height: "80%", width: '100%' }}>
        <Routes>
          {showRoutes(props.routes)}
          {/* <Route element={
            <Navigate replace to={{ pathname: '/' }} />
          }>
          </Route> */}
        </Routes>
      </div>
    </div>
  );
};

export default GuestLayout;