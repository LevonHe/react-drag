import dva from 'dva';
import { persistEnhancer } from 'dva-model-persist';
import drag from './models/drag';
import organization from './models/organization';

const app = dva();
app.use({
  extraEnhancers: [persistEnhancer()],
});
app.model({ ...drag });
app.model({ ...organization });

export default app;
