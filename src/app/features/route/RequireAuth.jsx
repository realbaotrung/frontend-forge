import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {selectAccessToken, selectRole} from '../../slices/auth/selectors';
import routePaths from './routePaths';
import { signOut } from '../../../utils/helpers.utils';
import { getItemFromSS, storageItem } from '../../../utils/storage.utils';

export default function RequireAuth({children, isAdmin}) {
  // const accessToken = useSelector(selectAccessToken);
  const accessToken = getItemFromSS(storageItem.auth)?.accessToken;
  const role = useSelector(selectRole);
  const navigate = useNavigate();

  console.log('role', role)

  useEffect(() => {
    if (!accessToken || isAdmin && role !== 'admin' || !isAdmin && role !== 'normal') {
      // signOut()
      navigate(routePaths.LOGIN_URL);
    }
  }, [accessToken, role]);

  return <div>{children}</div>;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
