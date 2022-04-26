import {Route, Routes} from 'react-router-dom';

import routes from './routeMap';
import RequireAuth from './RequireAuth';

import NavBarAdmin from '../../components/NavbarAdmin';
import Navbar from '../../components/Navbar'

export default function RouterOutlet() {
  const routeComponents = routes.map((routeItem) => {
    if (!routeItem.isAuth) {
      return (
        <Route
          key={routeItem.id}
          path={routeItem.path}
          element={routeItem.component}
        />
      );
    }
    return (
      <Route
        key={routeItem.id}
        path={routeItem.path}
        element={
          <RequireAuth isAdmin={routeItem?.isAdmin}>
            {routeItem.isAdmin && <NavBarAdmin>{routeItem.component}</NavBarAdmin>}
            {!routeItem.isAdmin && <><Navbar />{routeItem.component}</>}
          </RequireAuth>
        }
      />
    );
  });
  return (
    <Routes>{routeComponents}</Routes>
  );
}
