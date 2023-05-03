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

export interface PaymentData { 
    paymentByCash: boolean;
    paymentByBankTransfer: boolean;
    bankTransferNumber: string;
    paymentByBlik: boolean;
    blikPhoneNumber: string;
}