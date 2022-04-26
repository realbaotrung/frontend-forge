import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Box} from '@chakra-ui/react';
import {selectAccessToken, selectRole} from '../../slices/auth/selectors';
import routePaths from './routePaths';

export default function RequireAuth({children, isAdmin}) {
  const accessToken = useSelector(selectAccessToken);
  const role = useSelector(selectRole);
  const navigate = useNavigate();

  console.log('role', role)

  useEffect(() => {
    if (!accessToken || isAdmin && role !== 'admin' || !isAdmin && role !== 'normal') {
      navigate(routePaths.HOME_URL);
    }
  }, [accessToken, role]);

  return <Box>{children}</Box>;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};
