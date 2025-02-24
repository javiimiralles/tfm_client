import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  standalone: true,
  styleUrl: './confirmation-modal.component.css'
})
export class ConfirmationModalComponent implements OnInit{

  @Input() message: string = '¿Estás seguro de que quieres continuar?';
  @Input() confirmText: string = 'Aceptar';
  @Input() confirmBtnType: 'primary' | 'danger' = 'primary';
  @Input() cancelText: string = 'Cancelar';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirmBtnClass: string = 'cursor-pointer items-center justify-center text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800';

  constructor() {}

  ngOnInit() {
    if (this.confirmBtnType === 'danger') {
      this.confirmBtnClass = 'cursor-pointer items-center justify-center text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800';
    }
  }

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
