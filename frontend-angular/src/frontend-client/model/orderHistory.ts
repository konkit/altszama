/**
 * Restaurant Import API
 * To use the API please use the Import API Key specified on \"Restaurants\" page
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { OrderHistoryCreatedEntry } from './orderHistoryCreatedEntry';
import { OrderHistoryParticipatedEntry } from './orderHistoryParticipatedEntry';

export interface OrderHistory { 
    entries: Array<OrderHistoryCreatedEntry | OrderHistoryParticipatedEntry>;
    owedMoney: { [key: string]: number; };
}