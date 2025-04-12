import {Component, HostListener, OnInit} from '@angular/core';
import {Factura} from '../../../../models/factura.model';
import {FacturaFilter} from '../../../../filters/factura.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {UsuariosService} from '../../../../services/usuarios.service';
import {AlertsService} from '../../../../services/alerts.service';
import {FacturasService} from '../../../../services/facturas.service';
import {formatDate} from '../../../../utils/date.util';
import {CurrencyPipe, NgClass} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {forzarDescarga} from '../../../../utils/pdf.util';

@Component({
  selector: 'app-facturas-table',
  imports: [
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './facturas-table.component.html',
  standalone: true,
  styleUrl: './facturas-table.component.css'
})
export class FacturasTableComponent implements OnInit {

  facturas: Factura[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  facturaFilter: FacturaFilter = new FacturaFilter();
  filtersSubject = new BehaviorSubject<FacturaFilter>(new FacturaFilter());

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly facturasService: FacturasService
  ) {}

  ngOnInit() {
    if (!this.usuariosService.checkPermissions("ACCESO_FACTURAS")) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadFacturas();
    });
  }

  exportarFactura(id: number) {
    this.facturasService.genrarFacturaPdf(id).subscribe({
      next: (res) => {
        forzarDescarga(res as Blob, `factura.pdf`);
      },
      error: (err) => {
        this.alertsService.showError('Error al descargar la factura', err);
      }
    })
  }

  onFilterChange() {
    this.filtersSubject.next(this.facturaFilter);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.loadFacturas();
    }
  }

  toggleDropdownState(idFactura: number) {
    this.dropdownStates = {
      ...this.dropdownStates,
      [idFactura]: !this.dropdownStates[idFactura],
    };

    // Cerrar los demás dropdowns
    Object.keys(this.dropdownStates).forEach((key) => {
      if (Number(key) !== idFactura) {
        this.dropdownStates[Number(key)] = false;
      }
    });
  }

  formatDate(date: Date): string {
    return formatDate(date);
  }

  private loadFacturas(): void {
    this.facturaFilter = this.filtersSubject.getValue();
    this.facturaFilter.page = this.pageNumber;
    this.facturaFilter.size = this.pageSize;

    this.facturasService.getFacturasByFilter(this.facturaFilter).subscribe({
      next: (res) => {
        this.facturas = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar las facturas', err);
      }
    })
  }

  @HostListener('document:click', ['$event'])
  private onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Verifica si el clic fue dentro de un dropdown o botón
    if (!target.closest('.dropdown') && !target.closest('.dropdown-button')) {
      // Si el clic fue fuera, cierra todos los dropdowns
      this.dropdownStates = {};
    }
  }

}
