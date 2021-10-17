import {
  CreateDishResponse,
  DishControllerApi,
  DishCreateRequest,
  DishUpdateRequest,
  EditDishResponse,
  EditRestaurantResponse,
  IndexResponse,
  RestaurantControllerApi,
  RestaurantSaveRequest,
  RestaurantUpdateRequest,
  ShowRestaurantResponse,
} from '@/frontend-client/api';
import AbstractApiConnector from '@/lib/api/AbstractApiConnector';

export default class DishesApiConnector extends AbstractApiConnector {
  private readonly restaurantApi: RestaurantControllerApi;

  private readonly dishApi: DishControllerApi;

  constructor() {
    super();
    const configuration = this.createConfiguration();
    this.restaurantApi = new RestaurantControllerApi(configuration);
    this.dishApi = new DishControllerApi(configuration);
  }

  getRestaurants(): Promise<IndexResponse> {
    return this.restaurantApi.indexRestaurants(this.headersWithToken());
  }

  getShowRestaurantData(restaurantId: string): Promise<ShowRestaurantResponse> {
    return this.restaurantApi.showRestaurant(restaurantId, this.headersWithToken());
  }

  saveRestaurant(restaurant: RestaurantSaveRequest): Promise<string> {
    return this.restaurantApi.saveRestaurant(restaurant, this.headersWithToken());
  }

  getRestaurantEditData(restaurantId: string): Promise<EditRestaurantResponse> {
    return this.restaurantApi.editRestaurant(restaurantId, this.headersWithToken());
  }

  editRestaurant(restaurantId: string, restaurant: RestaurantUpdateRequest): Promise<string> {
    return this.restaurantApi.updateRestaurant(restaurant, this.headersWithToken());
  }

  deleteRestaurant(restaurantId: string): Promise<string> {
    return this.restaurantApi.deleteRestaurant(restaurantId, this.headersWithToken());
  }

  getDishCreateData(restaurantId: string): Promise<CreateDishResponse> {
    return this.dishApi.createDish(restaurantId, this.headersWithToken());
  }

  createDish(restaurantId: string, formData: DishCreateRequest): Promise<string> {
    return this.dishApi.saveDish(formData, restaurantId, this.headersWithToken());
  }

  getDishEditData(restaurantId: string, dishId: string): Promise<EditDishResponse> {
    return this.dishApi.editDish(restaurantId, dishId, this.headersWithToken());
  }

  editDish(restaurantId: string, dishObj: DishUpdateRequest): Promise<string> {
    return this.dishApi.updateDish(dishObj, restaurantId, this.headersWithToken());
  }

  deleteDish(restaurantId: string, dishId: string): Promise<string> {
    return this.dishApi.deleteDish(dishId, this.headersWithToken());
  }
}
