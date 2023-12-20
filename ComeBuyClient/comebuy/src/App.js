import "./App.css";
import LoginRegister from "./container/LoginAndRegister/LoginRegister";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./container/HomePage";
import MainLayout from "./page/MainLayout";
import { adminRoutes, adminMenuItems } from "./route/AdminRoutes";
import { staffMenuItems, staffRoutes } from "./route/StaffRoutes";
import { managerRoutes, managerMenuItems } from "./route/ManagerRoutes";
import { useEffect } from "react";
import { currentUser } from "./redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { customerMenuItems, customerRoutes } from "./route/CustomerRoutes";
import GuestLayout from "./page/GuestLayout";
import { ForgotPasswordInLogin } from "./components";
import { guestMenuItems, guestRoutes } from "./route/GuestRoutes";
import { getAccountWithID } from "./redux/slices/accountSlice";
import SetUpFunction from "./lib/utils/setUpFunction";

function App() {
  /// For the first open website
  SetUpFunction();

  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const _currentUser = useSelector(currentUser);

  const LoadCurrentUser = async () => {
    if (
      localStorage.getItem("idUser") &&
      localStorage.getItem("idUser") != ""
    ) {
      try {
        await dispatch(getAccountWithID(localStorage.getItem("idUser")));
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.log(rejectedValueOrSerializedError.message);
      }
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const role = localStorage.getItem("role"); // Lấy giá trị role từ localStorage trong useEffect
      await LoadCurrentUser();
      // navigate("/");
      // navigate(previousPath);
    };

    loadUserData();
  }, []); // Không cần dependency

  // useEffect(() => {
  //   console.log('abccccc')
  //   const loadUserData = async () => {
  //     await LoadCurrentUser();
  //     navigate('/');
  //     // navigate(previousPath);
  //   };

  //   loadUserData();
  // }, [role]);

  // useEffect(() => {
  //   window.scrollTo(0, 0); // Đặt vị trí cuộn trang về đầu trang khi component được mount
  // }, []);

  const renderRoutes = () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      switch (role) {
        case "manager":
          return (
            <MainLayout routes={managerRoutes} itemRoutes={managerMenuItems} />
          );
        case "staff":
          return (
            <MainLayout routes={staffRoutes} itemRoutes={staffMenuItems} />
          );
        case "admin":
          return (
            <MainLayout routes={adminRoutes} itemRoutes={adminMenuItems} />
          );
        case "customer":
          return (
            <GuestLayout
              routes={customerRoutes}
              itemRoutes={customerMenuItems}
            />
          );
        default:
          return (
            <GuestLayout routes={guestRoutes} itemRoutes={guestMenuItems} />
          ); // Guest/Customer
      }
    }
  };

  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/login" element={<LoginRegister />} />
      <Route path="*" element={renderRoutes()} />
      <Route
        path="/forgetpasswordinlogin"
        element={<ForgotPasswordInLogin />}
      />
    </Routes>
  );
}
export default App;
