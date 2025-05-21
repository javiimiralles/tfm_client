import {booleanAttribute, Component, Input} from '@angular/core';
import {DecimalPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-info-card',
  imports: [
    NgClass,
    DecimalPipe
  ],
  templateUrl: './info-card.component.html',
  standalone: true,
  styleUrl: './info-card.component.css'
})
export class InfoCardComponent {

  @Input() icon: string = 'group';
  @Input() iconClass?: string = 'bg-indigo-700 text-white';
  @Input() label: string = '';
  @Input({transform: booleanAttribute}) isMoney: boolean = false;
  @Input() value: number = 0;
  @Input() diff?: number;
}
