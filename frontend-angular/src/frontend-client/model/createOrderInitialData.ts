/**
 * Restaurant Import API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import {RestaurantDto} from './restaurantDto';


export interface CreateOrderInitialData {
    restaurantsList: Array<RestaurantDto>;
    orderDate: string;
    timeOfOrder: string;
    bankTransferNumber: string;
    blikPhoneNumber: string;
}

