/**
 * Restaurant Import API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import {SideDishData} from './sideDishData';


export interface OrderEntrySaveRequest {
    orderId: string;
    dishId?: string;
    additionalComments: string;
    newDish?: boolean;
    newDishName?: string;
    newDishPrice?: number;
    sideDishes: Array<SideDishData>;
}

