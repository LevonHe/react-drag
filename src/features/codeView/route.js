import WithLoadable from '../common/WithLoadable';

export default {
  path: 'codeView',
  name: 'codeView',
  component: WithLoadable(() => import('./CodeView')),
  canActice: true,
};
