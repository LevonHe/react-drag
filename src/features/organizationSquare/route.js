import WithLoadable from '../common/WithLoadable';

export default {
  path: 'org',
  name: 'org',
  component: WithLoadable(() => import('./OrganizationSquare')),
  canActive: true,
};
