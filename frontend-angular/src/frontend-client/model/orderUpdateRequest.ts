/**
 * Restaurant Import API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import {PaymentData} from './paymentData';
import {DeliveryData} from './deliveryData';


export interface OrderUpdateRequest {
    orderId?: string;
    orderDate?: string;
    timeOfOrder?: string;
    timeOfDelivery?: string;
    deliveryData: DeliveryData;
    paymentData: PaymentData;
}

