import WithLoadable from '../common/WithLoadable';

export default {
  path: 'drag',
  name: 'drag',
  component: WithLoadable(() => import('./Drag')),
  canActive: true,
};
