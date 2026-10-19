import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
    selector: 'app-view-wrapper',
    templateUrl: './view-wrapper.component.html',
    styleUrls: ['./view-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class ViewWrapperComponent {
}
