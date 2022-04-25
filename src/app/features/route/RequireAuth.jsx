import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Box} from '@chakra-ui/react';
import {selectAccessToken} from '../../slices/auth/selectors';
import routePaths from './routePaths';

export default function RequireAuth({children}) {
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate(routePaths.HOME_URL);
    }
  }, [accessToken]);

  return <Box>{children}</Box>;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};
