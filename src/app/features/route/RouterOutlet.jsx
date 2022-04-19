import {Route, Routes, useLocation} from 'react-router-dom';
import routes from './routeMap';
import Layout from './Layout';
import RequireAuth from './RequireAuth';
import NavBar from '../../components/Navbar';

export default function RouterOutlet() {

  const routeComponents = routes.map((routeItem) => {
    if(!routeItem.isAuth) {
      return <Route key={routeItem.id} path={routeItem.path} element={routeItem.component} />;
    } 
    return <Route key={routeItem.id} path={routeItem.path} element={<RequireAuth>
      <NavBar />
      {routeItem.component}
    </RequireAuth>} />
    ;
  });

  return (
      <Routes>
          {routeComponents}
      </Routes>
  );
}
