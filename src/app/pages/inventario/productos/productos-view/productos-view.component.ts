import {Component, OnInit} from '@angular/core';
import {Producto} from '../../../../models/producto.model';
import {ProductoFilter} from '../../../../filters/producto.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {UsuariosService} from '../../../../services/usuarios.service';
import {AlertsService} from '../../../../services/alerts.service';
import {ProductosService} from '../../../../services/productos.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-productos-view',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './productos-view.component.html',
  standalone: true,
  styleUrl: './productos-view.component.css'
})
export class ProductosViewComponent implements OnInit {

  loading: boolean = true;

  productos: Producto[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  showCreateButton = false;
  showEditButton = false;
  showDeleteButton = false;

  productoFilter: ProductoFilter = new ProductoFilter();
  filtersSubject = new BehaviorSubject<ProductoFilter>(new ProductoFilter());

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly productosService: ProductosService
  ) { }

  ngOnInit(): void {
    if (!this.checkPermissions()) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadProductos();
    });
  }

  onFilterChange() {
    this.filtersSubject.next(this.productoFilter);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.loadProductos();
    }
  }

  private loadProductos() {
    this.loading = true;

    this.productoFilter = this.filtersSubject.getValue();
    this.productoFilter.page = this.pageNumber;
    this.productoFilter.size = this.pageSize;

    this.productosService.getProductosByFilter(this.productoFilter).subscribe({
      next: (res: any) => {
        this.productos = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los productos', err);
        this.loading = false;
      }
    })
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_PRODUCTOS')) return false;

    this.showCreateButton = this.usuariosService.hasPermission('CREACION_PRODUCTOS');
    this.showEditButton = this.usuariosService.hasPermission('EDICION_PRODUCTOS');
    this.showDeleteButton = this.usuariosService.hasPermission('ELIMINACION_PRODUCTOS');

    return true;
  }

}
