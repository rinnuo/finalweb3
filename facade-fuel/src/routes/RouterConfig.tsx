import { createBrowserRouter, Outlet } from "react-router-dom";
import { Routes } from "./CONSTANTS";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import NavMenu from "../components/NavMenu";
import UserList from "../pages/access/users/UserList";
import UserEdit from "../pages/access/users/UserEdit";
import UserCreate from "../pages/access/users/UserCreate";
import StationList from "../pages/access/stations/StationList";

export const routerConfig = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavMenu />
        <Outlet />
      </>
    ),
    children: [
      {
        path: Routes.LOGIN,
        element: <LoginPage />,
      },
      {
        path: Routes.HOME,
        element: <HomePage />,
      },
      {
        path: Routes.ACCESS.USERS.LIST,
        element: <UserList />,
      },
      {
      	path: Routes.ACCESS.USERS.CREATE,
      	element: <UserCreate />,
      },
      {
        path: Routes.ACCESS.USERS.EDIT,
        element: <UserEdit />,
      },
      {
        path: Routes.ACCESS.STATIONS.LIST,
        element: <StationList />,
      },
    ],
  },
]);
