import {Injectable} from '@angular/core';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

// Remembers which page the current navigation started from, so a view can tell where the user came from.
// Captured at NavigationStart because routed views inside a layout are created only after NavigationEnd.
@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {

  private lastCompletedUrl: string | null = null
  private previousUrl: string | null = null

  constructor(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.previousUrl = this.lastCompletedUrl
      } else if (event instanceof NavigationEnd) {
        this.lastCompletedUrl = event.urlAfterRedirects
      }
    })
  }

  getPreviousUrl(): string | null {
    return this.previousUrl
  }
}
