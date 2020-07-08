import * as _ from 'lodash';
import Layout from './features/layout/Layout';
import PageNotFound from './features/common/PageNotFound';
import dragViewRoute from './features/dragView/route';

const childRoutes = [dragViewRoute];

const routes = [
  {
    path: '/',
    component: Layout,
    // canActive: true,
    childRoutes: [...childRoutes, { path: '*', name: 'Page not found', component: PageNotFound }].filter(
      (r) => r.component || (r.childRoutes && r.childRoutes.length > 0)
    ),
  },
];

function handleIndexRoute(route) {
  if (!route.childRoutes || route.childRoutes.length === 0) {
    return;
  }
  const indexRoute = _.find(route.childRoutes, (child) => child.isIndex);
  if (indexRoute) {
    const first = { ...indexRoute };
    first.path = '';
    first.exact = true;
    first.autoIndexRoute = true;
    route.childRoutes.unshift(first);
  }
  route.childRoutes.forEach(handleIndexRoute);
}

routes.forEach(handleIndexRoute);
export default routes;
