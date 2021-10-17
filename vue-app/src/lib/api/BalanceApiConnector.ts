import { AbstractApiConnector } from '@/lib/api/AbstractApiConnector';
import { BalanceControllerApi, OrderHistory } from '@/frontend-client';

export default class BalanceApiConnector extends AbstractApiConnector {
    private readonly balanceControllerApi: BalanceControllerApi;

    constructor() {
      super();
      this.balanceControllerApi = new BalanceControllerApi(this.createConfiguration());
    }

    getBalanceForUser(): Promise<OrderHistory> {
      return this.balanceControllerApi.getBalanceForUser(this.headersWithToken());
    }
}
