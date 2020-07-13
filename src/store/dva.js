import dva from 'dva';
import { BrowserRouter } from 'dva/router';
import { persistEnhancer } from 'dva-model-persist';
import drag from './models/drag';
import organization from './models/organization';
import application from './models/application';
import components from './models/components';
import login from './models/login';

const app = dva({
  history: BrowserRouter,
});
app.use({
  extraEnhancers: [persistEnhancer()],
});
app.model({ ...drag });
app.model({ ...organization });
app.model({ ...application });
app.model({ ...components });
app.model({ ...login });

export default app;
