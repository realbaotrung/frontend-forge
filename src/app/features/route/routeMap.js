import {loadable as LoginPage} from '../auth/LoginPage/Loadable';
import {loadable as MissingPage} from '../notfound/MissingPage/Loadable';
import {loadable as UserPage} from '../user/UserPage/Loadable';
import routePaths from './routePaths';
import BundlePage from '../admin/AdminPage/BundlePage';
import UserCheckStandardPage from '../user/UserCheckStandardPage/UserCheckStandardPage';
import CategoriesPage from '../admin/AdminPage/CategoriesPage';
import CheckStandardPage from '../admin/AdminPage/CheckStandardPage';
import DashboardPage from '../admin/AdminPage/DashboardPage';

 const routes = [
  {
    id: 'default',
    path: routePaths.HOME_URL,
    isAuth: false,
    isAdmin: false,
    component: <LoginPage />,
  },
  {
    id: 'loginPage',
    path: routePaths.LOGIN_URL,
    isAuth: false,
    isAdmin: false,
    component: <LoginPage />,
  },
  {
    id: 'userPage',
    path: routePaths.USER_URL,
    isAuth: true,
    isAdmin: false,
    component: <UserPage />,
  },
  {
    id: 'userCheckStandardPage',
    path: routePaths.USER_CHECK_STANDARD_URL,
    isAuth: true,
    isAdmin: false,
    component: <UserCheckStandardPage />,
  },
  {
    id: 'admin',
    path: routePaths.ADMIN_URL,
    isAuth: true,
    isAdmin: true,
    component: <BundlePage />,
  },
  {
    id: 'bundlePage',
    path: routePaths.ADMIN_BUNDLE_URL,
    isAuth: true,
    isAdmin: true,
    component: <BundlePage />,
  },
  {
    id: 'categoriesPage',
    path: routePaths.ADMIN_CATEGORIES_URL,
    isAuth: true,
    isAdmin: true,
    component: <CategoriesPage />,
  },
  {
    id: 'checkStandardPage',
    path: '/admin/check-standard',
    isAuth: true,
    isAdmin: true,
    component: <CheckStandardPage />,
  },
  {
    id: 'dashboardPage',
    path: '/admin/dashboard',
    isAuth: true,
    isAdmin: true,
    component: <DashboardPage />,
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
