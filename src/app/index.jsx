/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import { loadScripts } from '../utils/ForgeViewer/helpers';
import RouterOutlet from './features/route/RouterOutlet';

export default function App() {
  return <RouterOutlet />;
}
