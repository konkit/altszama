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
import { ParticipantsDishEntry } from './participantsDishEntry';

export interface ParticipantsOrderEntry { 
    id: string;
    userId: string;
    username: string;
    dishEntries: Array<ParticipantsDishEntry>;
    finalPrice: number;
    paymentStatus: ParticipantsOrderEntry.PaymentStatusEnum;
}
export namespace ParticipantsOrderEntry {
    export type PaymentStatusEnum = 'UNPAID' | 'CONFIRMED';
    export const PaymentStatusEnum = {
        UNPAID: 'UNPAID' as PaymentStatusEnum,
        CONFIRMED: 'CONFIRMED' as PaymentStatusEnum
    };
}