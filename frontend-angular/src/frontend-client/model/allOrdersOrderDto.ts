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

export interface AllOrdersOrderDto { 
    id: string;
    restaurantName: string;
    orderCreatorUsername: string;
    orderDate: string;
    orderState: AllOrdersOrderDto.OrderStateEnum;
}
export namespace AllOrdersOrderDto {
    export type OrderStateEnum = 'CREATED' | 'ORDERING' | 'ORDERED' | 'DELIVERED' | 'REJECTED';
    export const OrderStateEnum = {
        CREATED: 'CREATED' as OrderStateEnum,
        ORDERING: 'ORDERING' as OrderStateEnum,
        ORDERED: 'ORDERED' as OrderStateEnum,
        DELIVERED: 'DELIVERED' as OrderStateEnum,
        REJECTED: 'REJECTED' as OrderStateEnum
    };
}