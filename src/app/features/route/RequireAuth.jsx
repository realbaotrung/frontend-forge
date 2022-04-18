import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {createStructuredSelector} from 'reselect';
import {Box} from '@chakra-ui/react';
import {selectAccessToken} from '../../slices/auth/selectors';
import routePaths from './routePaths';

const stateSelector = createStructuredSelector({
  accessToken: selectAccessToken,
});

export default function RequireAuth({children}) {
  const {accessToken} = useSelector(stateSelector);
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
