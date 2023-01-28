import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AuthControllerService } from './api/authController.service';
import { BalanceControllerService } from './api/balanceController.service';
import { DishControllerService } from './api/dishController.service';
import { NotificationControllerService } from './api/notificationController.service';
import { OrderControllerService } from './api/orderController.service';
import { OrderEntryControllerService } from './api/orderEntryController.service';
import { RestaurantControllerService } from './api/restaurantController.service';
import { TestAuthControllerService } from './api/testAuthController.service';
import { TestEnvironmentControllerService } from './api/testEnvironmentController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AuthControllerService,
    BalanceControllerService,
    DishControllerService,
    NotificationControllerService,
    OrderControllerService,
    OrderEntryControllerService,
    RestaurantControllerService,
    TestAuthControllerService,
    TestEnvironmentControllerService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
