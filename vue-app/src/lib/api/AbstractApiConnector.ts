import { Configuration } from '@/frontend-client';
import { getConfig } from '@/lib/config';
import store from '@/store';

export default abstract class AbstractApiConnector {
  createConfiguration() {
    return new Configuration({
      basePath: getConfig().currentDomain,
    });
  }

  headersWithToken() {
    return { headers: { Authorization: `Bearer ${store.state.token}` } };
  }
}
