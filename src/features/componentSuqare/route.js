import WithLoadable from '../common/WithLoadable';

export default {
  path: 'comsquare',
  name: 'comsquare',
  component: WithLoadable(() => import('./ComponentSquare')),
  canActive: true,
};
