/**
 * Restaurant Import API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import {OrderHistoryEntry} from './orderHistoryEntry';


export interface OrderHistory {
    entries: Array<OrderHistoryEntry>;
    owedMoney: { [key: string]: number; };
}

