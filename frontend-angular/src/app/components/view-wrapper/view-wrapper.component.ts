import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-view-wrapper',
  templateUrl: './view-wrapper.component.html',
  styleUrls: ['./view-wrapper.component.scss']
})
export class ViewWrapperComponent {

  @Input() title!: string

}
