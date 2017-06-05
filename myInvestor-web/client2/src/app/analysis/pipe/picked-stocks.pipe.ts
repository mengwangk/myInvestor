import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pickedStocksFilter',
  pure: false,
})
export class PickedStocksPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value)
      return null;
    return Object.keys(value)
      .map((key) => ({ 'key': key, 'value': value[key] }));
  }

}
