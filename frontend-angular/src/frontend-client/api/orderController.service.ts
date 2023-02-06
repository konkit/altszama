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
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { AllOrdersResponse } from '../model/allOrdersResponse';
import { CreateOrderInitialData } from '../model/createOrderInitialData';
import { EditOrderInitialData } from '../model/editOrderInitialData';
import { OrderSaveRequest } from '../model/orderSaveRequest';
import { OrderUpdateRequest } from '../model/orderUpdateRequest';
import { OrderViewInitialData } from '../model/orderViewInitialData';
import { SetAsOrderedResponse } from '../model/setAsOrderedResponse';
import { ShowOrderResponse } from '../model/showOrderResponse';
import { SseEmitter } from '../model/sseEmitter';
import { TodayOrdersResponse } from '../model/todayOrdersResponse';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class OrderControllerService {

    protected basePath = 'http://localhost:8080/';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public _delete(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public _delete(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public _delete(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public _delete(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling _delete.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('delete',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/delete`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public allOrders(observe?: 'body', reportProgress?: boolean): Observable<AllOrdersResponse>;
    public allOrders(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<AllOrdersResponse>>;
    public allOrders(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<AllOrdersResponse>>;
    public allOrders(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<AllOrdersResponse>('get',`${this.basePath}/api/orders/all.json`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public create(observe?: 'body', reportProgress?: boolean): Observable<CreateOrderInitialData>;
    public create(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<CreateOrderInitialData>>;
    public create(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<CreateOrderInitialData>>;
    public create(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<CreateOrderInitialData>('get',`${this.basePath}/api/orders/create.json`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public edit(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<EditOrderInitialData>;
    public edit(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<EditOrderInitialData>>;
    public edit(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<EditOrderInitialData>>;
    public edit(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling edit.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<EditOrderInitialData>('get',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/edit.json`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public handleSse(observe?: 'body', reportProgress?: boolean): Observable<SseEmitter>;
    public handleSse(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<SseEmitter>>;
    public handleSse(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<SseEmitter>>;
    public handleSse(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<SseEmitter>('get',`${this.basePath}/api/orders/sse`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public orderViewJson(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<OrderViewInitialData>;
    public orderViewJson(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<OrderViewInitialData>>;
    public orderViewJson(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<OrderViewInitialData>>;
    public orderViewJson(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling orderViewJson.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<OrderViewInitialData>('get',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/order_view.json`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public save(body: OrderSaveRequest, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public save(body: OrderSaveRequest, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public save(body: OrderSaveRequest, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public save(body: OrderSaveRequest, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling save.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<string>('post',`${this.basePath}/api/orders/save`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public setAsCreated(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public setAsCreated(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public setAsCreated(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public setAsCreated(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling setAsCreated.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('put',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/set_as_created`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public setAsDelivered(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public setAsDelivered(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public setAsDelivered(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public setAsDelivered(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling setAsDelivered.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('put',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/set_as_delivered`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public setAsOrdered(body: SetAsOrderedResponse, orderId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public setAsOrdered(body: SetAsOrderedResponse, orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public setAsOrdered(body: SetAsOrderedResponse, orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public setAsOrdered(body: SetAsOrderedResponse, orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling setAsOrdered.');
        }

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling setAsOrdered.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<string>('put',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/set_as_ordered`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public setAsOrdering(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public setAsOrdering(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public setAsOrdering(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public setAsOrdering(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling setAsOrdering.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('put',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/set_as_ordering`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public setAsRejected(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public setAsRejected(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public setAsRejected(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public setAsRejected(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling setAsRejected.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('put',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/set_as_rejected`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public setBackAsOrdered(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public setBackAsOrdered(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public setBackAsOrdered(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public setBackAsOrdered(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling setBackAsOrdered.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<string>('put',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/set_back_as_ordered`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param orderId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public show(orderId: string, observe?: 'body', reportProgress?: boolean): Observable<ShowOrderResponse>;
    public show(orderId: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ShowOrderResponse>>;
    public show(orderId: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ShowOrderResponse>>;
    public show(orderId: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (orderId === null || orderId === undefined) {
            throw new Error('Required parameter orderId was null or undefined when calling show.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<ShowOrderResponse>('get',`${this.basePath}/api/orders/${encodeURIComponent(String(orderId))}/show.json`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public todayOrders(observe?: 'body', reportProgress?: boolean): Observable<TodayOrdersResponse>;
    public todayOrders(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<TodayOrdersResponse>>;
    public todayOrders(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<TodayOrdersResponse>>;
    public todayOrders(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<TodayOrdersResponse>('get',`${this.basePath}/api/orders/today.json`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public update(body: OrderUpdateRequest, observe?: 'body', reportProgress?: boolean): Observable<string>;
    public update(body: OrderUpdateRequest, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<string>>;
    public update(body: OrderUpdateRequest, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<string>>;
    public update(body: OrderUpdateRequest, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling update.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<string>('put',`${this.basePath}/api/orders/update`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}