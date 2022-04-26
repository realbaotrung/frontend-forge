import { useEffect, useState } from 'react';
import {useForgeViewer} from './hooks';

export default function ForgeViewer({urn, token, className, style, ...remainProps}) {
  const {refs} = useForgeViewer({urn, token, ...remainProps});

  return (
    <div>
      <div ref={refs.viewer} className={className} style={style}></div>
    </div>
  );
}

export { Extension as ForgeExtension } from './extension';

/*
eslint
  react/destructuring-assignment: 0,
  react/prop-types: 0,
*/
