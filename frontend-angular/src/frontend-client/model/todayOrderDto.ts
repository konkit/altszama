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
import { LocalTime } from './localTime';

export interface TodayOrderDto { 
    id: string;
    restaurantId: string;
    restaurantName: string;
    orderCreatorId: string;
    orderCreatorUsername: string;
    orderDate: string;
    timeOfOrder?: string;
    timeOfDelivery?: LocalTime;
    orderState: TodayOrderDto.OrderStateEnum;
    decreaseInPercent: number;
    deliveryCostPerEverybody: number;
    deliveryCostPerDish: number;
    paymentByCash: boolean;
    paymentByBankTransfer: boolean;
    bankTransferNumber: string;
}
export namespace TodayOrderDto {
    export type OrderStateEnum = 'CREATED' | 'ORDERING' | 'ORDERED' | 'DELIVERED' | 'REJECTED';
    export const OrderStateEnum = {
        CREATED: 'CREATED' as OrderStateEnum,
        ORDERING: 'ORDERING' as OrderStateEnum,
        ORDERED: 'ORDERED' as OrderStateEnum,
        DELIVERED: 'DELIVERED' as OrderStateEnum,
        REJECTED: 'REJECTED' as OrderStateEnum
    };
}