/**
 * Restaurant Import API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import {SideDish} from './sideDish';


export interface DishDto {
    id: string;
    name: string;
    price: number;
    sideDishes: Array<SideDish>;
    category: string;
    lastCrawled?: string;
}

