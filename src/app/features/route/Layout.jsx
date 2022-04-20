import { Outlet, useLocation } from "react-router-dom";
import RequireAuth from './RequireAuth';
import NavBar from '../../components/Navbar';

export default function Layout() {
  const location = useLocation();
  console.log(location)

  const showLayout = () => {
    switch (location.pathname) {
      case '/auth/signin': return <Outlet />;
      default: {
        return(<RequireAuth>
          <NavBar />
          <Outlet />
        </RequireAuth>)
      }
    }
  }

  return <RequireAuth>
  <NavBar />
  <Outlet />
</RequireAuth>
}