import React, {lazy, Suspense} from 'react';

export const lazyLoad = (importFunc, {fallback = null} = {fallback: null}) => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/*
eslint
  react/function-component-definition: 0
*/
