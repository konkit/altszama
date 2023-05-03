import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {

  transform(date?: Date | string): string {
    if (date) {
      if (typeof date === "string") {
        return this.timeSince(Date.parse(date))
      } else {
        return this.timeSince(date.getDate());
      }
    } else {
      return "";
    }
  }

  timeSince(dateInMilis: number): string {
    const secondsSince = Math.floor((Date.now() - dateInMilis) / 1000);
    const numberOfYears = Math.floor(secondsSince / (365 * 24 * 60 * 60));
    if (numberOfYears > 1) {
      return `${numberOfYears} years ago`;
    }
    if (numberOfYears === 1) {
      return '1 year ago';
    }

    const numberOfMonths = Math.floor(secondsSince / (30 * 24 * 60 * 60));
    if (numberOfMonths > 1) {
      return `${numberOfMonths} months ago`;
    }
    if (numberOfMonths === 1) {
      return '1 month ago';
    }

    const numberOfDays = Math.floor(secondsSince / (24 * 60 * 60));
    if (numberOfDays > 1) {
      return `${numberOfDays} days ago`;
    }
    if (numberOfDays === 1) {
      return '1 day ago';
    }

    const numberOfHours = Math.floor(secondsSince / (60 * 60));
    if (numberOfHours > 1) {
      return `${numberOfHours} hours ago`;
    }
    if (numberOfHours === 1) {
      return '1 hour ago';
    }

    const numberOfMinutes = Math.floor(secondsSince / 60);
    if (numberOfMinutes > 1) {
      return `${numberOfMinutes} minutes ago`;
    }
    if (numberOfMinutes === 1) {
      return '1 minute ago';
    }

    return 'just now';
  }

}
