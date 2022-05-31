import {loadable as LoginPage} from '../auth/LoginPage/Loadable';
import {loadable as MissingPage} from '../notfound/MissingPage/Loadable';
import {loadable as UserPage} from '../user/UserPage/Loadable';
import routePaths from './routePaths';
import BundlePage from '../admin/AdminPage/BundlePage';
import CategoriesPage
  from "../admin/AdminPage/CategoriesPage";
import CheckStandardPage from '../admin/AdminPage/CheckStandardPage';

 const routes = [
  {
    id: 'default',
    path: routePaths.HOME_URL,
    isAuth: false,
    isAdmin: false,
    component: <LoginPage/>,
  },
  {
    id: 'loginPage',
    path: routePaths.LOGIN_URL,
    isAuth: false,
    isAdmin: false,
    component: <LoginPage/>,
  },
  {
    id: 'userPage',
    path: routePaths.USER_URL,
    isAuth: true,
    isAdmin: false,
    component: <UserPage/>,
  },
  {
    id: 'dashboardPageAdmin',
    path: '/admin',
    isAuth: true,
    isAdmin: true,
    component: <BundlePage/>,
  },
  {
    id: 'bundlePage',
    path: '/admin/bundle',
    isAuth: true,
    isAdmin: true,
    component: <BundlePage/>,
  },
  {
    id: 'categoriesPage',
    path: '/admin/categories',
    isAuth: true,
    isAdmin: true,
    component: <CategoriesPage/>,
  },
  {
    id: 'checkStandardPage',
    path: '/admin/check-standard',
    isAuth: true,
    isAdmin: true,
    component: <CheckStandardPage/>,
  },
  {
    id: 'missingPage',
    path: '*',
    isAuth: false,
    isAdmin: false,
    component: <MissingPage/>,
  },
];


export default routes;

/* eslint react/jsx-filename-extension: 0 */
