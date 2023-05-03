import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  private formatter = new Intl.NumberFormat('pl-PL', {style: 'currency', currency: 'PLN'});

  transform(dataPrice: number, ...args: unknown[]): string {
    return this.formatter.format(dataPrice / 100);
  }

}
