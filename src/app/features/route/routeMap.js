import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {loadable as LoginPage} from '../auth/pages/LoginPage/Loadable';
import {loadable as DashboardPage} from '../dashboard/pages/DashboardPage/Loadable';
import {loadable as MissingPage} from '../notfound/pages/MissingPage/Loadable';
import RequireAuth from './RequireAuth';
import routePaths from './routePaths';

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

function DashboardPageRequireAuth() {
  return (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  );
}

const routes = [
  {
    id: 'loginPage',
    path: routePaths.LOGIN_URL,
    component: LoginPage,
  },
  {
    id: 'dashboardPage',
    path: routePaths.DASHBOARD_URL,
    component: DashboardPageRequireAuth,
  },
  {
    id: 'homePage',
    path: routePaths.HOME_URL,
    component: RedirectDefaultRouteToLoginPage,
  },
  {
    id: 'missingPage',
    path: '*',
    component: MissingPage,
  },
];

export default routes;

/* eslint react/jsx-filename-extension: 0 */
