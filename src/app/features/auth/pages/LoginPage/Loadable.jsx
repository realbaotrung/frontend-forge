import {lazyLoad} from '../../../../../utils/loadable.utils';

const loading = () => {
  return <div>Loading...</div>;
};

export const loadable = lazyLoad(
  () => import('./index'),
  (module) => module.LoginPage,
  {
    fallback: loading,
  },
);
