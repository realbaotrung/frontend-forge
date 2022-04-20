import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import NavBar from '../../components/Navbar';
import {loadable as LoginPage} from '../auth/LoginPage/Loadable';
import {loadable as DashboardPage} from '../dashboard/DashboardPage/Loadable';
import BundlePage from '../dashboard/DashboardPage/pages/AdminPage/BundlePage';
import {loadable as MissingPage} from '../notfound/MissingPage/Loadable';
import RequireAuth from './RequireAuth';
import routePaths from './routePaths';
import CategoriesPage
  from "../dashboard/DashboardPage/pages/AdminPage/CategoriesPage";

function RedirectDefaultRouteToLoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    // Navigate to login page when first access default URL
    navigate(routePaths.LOGIN_URL);
    // We want to reload the current window because, we have
    // stored info in Session Storage. When user click a new
    // tab in browser, they will redirect to DASHBOARD URL
    // without sign-in again.
    // combine with method 'shareSessionStorageBetweenTabs'
    window.location.reload();
  }, [navigate]);
  return null;
}

// function DashboardPageRequireAuth() {
//   return (
//     <RequireAuth>
//       <DashboardPage></DashboardPage>
//     </RequireAuth>
//   );
// }

// function NavbarWithPage({children}) {
//   return (
//     <RequireAuth>
//       <NavBar />
//       {children}
//     </RequireAuth>
//   );
// }
// NavbarWithPage.propTypes = {
//   children: PropTypes.node.isRequired,
// };


const routes = [
  {
    id: 'loginPage',
    path: routePaths.LOGIN_URL,
    isAuth: false,
    isAdmin: false,
    component: <LoginPage />,
  },
  {
    id: 'dashboardPage',
    path: routePaths.DASHBOARD_URL,
    isAuth: true,
    isAdmin: false,
    component: <DashboardPage />,    
  },
  {
    id: 'homePage',
    path: routePaths.HOME_URL,
    isAuth: true,
    component: <RedirectDefaultRouteToLoginPage />,
  },
  {
    id: 'dashboardPageAdmin',
    path: '/admin',
    isAuth: true,
    isAdmin: true,
    component: <BundlePage />,    
  },
  {
    id: 'bundlePage',
    path: '/dashboard/bundle',
    isAuth: true,
    isAdmin: true,
    component: <BundlePage />,    
  },
  {
    id: 'categoriesPage',
    path: '/dashboard/categories',
    isAuth: true,
    component: <CategoriesPage />,
  },
  {
    id: 'missingPage',
    path: '*',
    isAuth: false,
    isAdmin: false,
    component: <MissingPage />,
  },
];


export default routes;

/* eslint react/jsx-filename-extension: 0 */
