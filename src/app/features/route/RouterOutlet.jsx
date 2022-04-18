import {Route, Routes} from 'react-router-dom';
import routes from './routeMap';
import Layout from './Layout';


export default function RouterOutlet() {
  const routeComponents = routes.map((routeItem) => {
    const {id, path, component: Page} = routeItem;
    return <Route key={id} path={path} element={<Page />} />;
  });

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {routeComponents}
      </Route>
    </Routes>
  );
}
