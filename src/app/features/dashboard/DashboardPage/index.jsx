import { useSelector } from 'react-redux';
import NavBar from '../../../components/Navbar';
import { selectRole } from '../../../slices/auth/selectors';
import AdminPage from './pages/AdminPage/AdminPage';
import UserPage from './pages/UserPage/UserPage';

// TODO: Bug, findDOMNode at InternalSubMenuList Component (by Antd)


export default function DashboardPage() {

  const role = useSelector(selectRole);

  const showPageDependByRole = (role === 'admin' ? <AdminPage /> : <UserPage />);
  return (
  <>
    <NavBar />
    {showPageDependByRole}
  </>
  );
}
