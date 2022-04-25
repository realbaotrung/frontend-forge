import {lazyLoad} from '../../../../utils/loadable.utils';

const loading = () => {
  return <div>Loading...</div>;
};

export const loadable = lazyLoad(
  () => import('./UserPage'),
  (module) => module.UserPage,
  {
    fallback: loading,
  },
);
