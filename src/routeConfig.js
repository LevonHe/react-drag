import * as _ from 'lodash';
import PageNotFound from './features/pageNotFound/PageNotFound';
import Layout from './features/layout/Layout';
import DragRoute from './features/drag/route';
import ComponentDragRoute from './features/componentDrag/route';
import ComSquareRoute from './features/componentSuqare/route';
import OrgSquareRoute from './features/organizationSquare/route';
import CodeViewRoute from './features/codeView/route';
import Login from './features/login/Login';
import Register from './features/login/Register';

const childRoutes = [DragRoute, ComponentDragRoute, ComSquareRoute, OrgSquareRoute, CodeViewRoute];

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
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
