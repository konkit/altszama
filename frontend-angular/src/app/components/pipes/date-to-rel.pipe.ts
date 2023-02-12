import {Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment/moment";

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {

  transform(date?: Date): unknown {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }

}
