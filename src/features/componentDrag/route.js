import WithLoadable from '../common/WithLoadable';

export default {
  path: ':id/componentDrag',
  name: 'componentDrag',
  component: WithLoadable(() => import('./ComponentDrag')),
  // canActive: true,
};
