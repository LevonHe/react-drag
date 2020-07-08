import WithLoadable from '../common/WithLoadable';

export default {
  path: '',
  childRoutes: [
    {
      path: 'dragView',
      name: 'dragView',
      component: WithLoadable(() => import('./dragView')),
      // canActive: true,
    },
  ],
};
