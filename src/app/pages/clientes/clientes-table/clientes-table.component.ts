import {Component, HostListener, OnInit} from '@angular/core';
import {Cliente} from '../../../models/cliente.model';
import {ClientesService} from '../../../services/clientes.service';
import {AlertsService} from '../../../services/alerts.service';
import {EmpleadosService} from '../../../services/empleados.service';
import {formatDate} from '../../../utils/date.util';

@Component({
  selector: 'app-clientes-table',
  imports: [],
  templateUrl: './clientes-table.component.html',
  standalone: true,
  styleUrl: './clientes-table.component.css'
})
export class ClientesTableComponent implements OnInit {

  clientes: Cliente[] = [];
  idEmpresa: number;
  dropdownStates: { [key: number]: boolean } = {};

  constructor(
    private clientesService: ClientesService,
    private alertsService: AlertsService,
    private empleadosService: EmpleadosService
  ) { }

  ngOnInit() {
    this.idEmpresa = this.empleadosService.idEmpresa!;
    this.loadClientes();
  }

  loadClientes() {
    this.clientesService.getClientesByEmpresa(this.idEmpresa).subscribe({
      next: (res) => {
        this.clientes = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los clientes', err);
      }
    })
  }

  toggleDropdownState(idCliente: number) {
    this.dropdownStates = {
      ...this.dropdownStates,
      [idCliente]: !this.dropdownStates[idCliente],
    };

    // Cerrar los demás dropdowns
    Object.keys(this.dropdownStates).forEach((key) => {
      if (Number(key) !== idCliente) {
        this.dropdownStates[Number(key)] = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Verifica si el clic fue dentro de un dropdown o botón
    if (!target.closest('.dropdown') && !target.closest('.dropdown-button')) {
      // Si el clic fue fuera, cierra todos los dropdowns
      this.dropdownStates = {};
    }
  }

  formatDate(date: Date): string {
    return formatDate(date);
  }


}
