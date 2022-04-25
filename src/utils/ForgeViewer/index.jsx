import {useForgeViewer} from './hooks';

export default function ForgeViewer(props) {
  const {refs} = useForgeViewer(props)
  return (
    <div>
      <div ref={refs.viewer} className={props.className} style={props.style}></div>
    </div>
  );
}

export { Extension as ForgeExtension } from './extension';

/*
eslint
  react/destructuring-assignment: 0,
  react/prop-types: 0,
*/
