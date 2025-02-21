import {Component, HostListener, OnInit} from '@angular/core';
import {CategoriaProducto} from '../../../../models/categoria-producto.model';
import {CategoriaProductoFilter} from '../../../../filters/categoria-producto.filter';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {UsuariosService} from '../../../../services/usuarios.service';
import {AlertsService} from '../../../../services/alerts.service';
import {CategoriasProductoService} from '../../../../services/categorias-producto.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-categorias-productos-table',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './categorias-productos-table.component.html',
  standalone: true,
  styleUrl: './categorias-productos-table.component.css'
})
export class CategoriasProductosTableComponent implements OnInit{

  // Tabla
  categorias: CategoriaProducto[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 1;

  dropdownStates: { [key: number]: boolean } = {};

  showCreateButton = false;
  showEditButton = false;
  showDeleteButton = false;

  categoriaFilter: CategoriaProductoFilter = new CategoriaProductoFilter();
  filtersSubject = new BehaviorSubject<CategoriaProductoFilter>(new CategoriaProductoFilter());

  // Modal
  modal: Modal;

  categoriaForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    descripcion: new FormControl('', [Validators.maxLength(255)]),
  })

  modalTitle: string = 'Crear una nueva categoría';
  categoria: CategoriaProducto;
  saving: boolean = false;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly alertsService: AlertsService,
    private readonly categoriasProductoService: CategoriasProductoService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    if (!this.checkPermissions()) return;

    this.filtersSubject.pipe(debounceTime(500)).subscribe(() => {
      this.loadCategorias();
    });
  }

  onSubmit() {
    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    if (this.categoria) {
      this.updateCategoria();
    } else {
      this.createCategoria();
    }
  }

  openModal(categoria: CategoriaProducto) {
    this.fillForm(categoria);
    this.categoria = categoria;
    this.modalTitle = categoria ? 'Editar categoría' : 'Crear una nueva categoría';
    const modalElement = document.getElementById('modal');
    if (!modalElement) return;
    this.modal = new Modal(modalElement);
    this.modal.show();
  }

  closeModal() {
    if (this.modal) this.modal.hide();
  }

  onFilterChange() {
    this.filtersSubject.next(this.categoriaFilter);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.pageNumber = page;
      this.loadCategorias();
    }
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

  private loadCategorias() {
    this.categoriaFilter = this.filtersSubject.getValue();
    this.categoriaFilter.page = this.pageNumber;
    this.categoriaFilter.size = this.pageSize;

    this.categoriasProductoService.getCategoriasProductoByFilter(this.categoriaFilter).subscribe({
      next: (res) => {
        this.categorias = res['data']?.content;
        this.totalElements = res['data']?.totalElements;
        this.totalPages = res['data']?.totalPages;
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar las categorías de productos', err);
      }
    });
  }

  private createCategoria() {
    this.fillObject();
    this.categoriasProductoService.createCategoriaProducto(this.categoria).subscribe({
      next: (res) => {
        this.alertsService.showAlert('Categoría creada', 'La categoría se ha creado correctamente', 'success');
        this.closeModal();
        this.loadCategorias();
        this.saving = false;
      },
      error: (err) => {
        this.alertsService.showError('Error al crear la categoría', err);
        this.saving = false;
      }
    });
  }

  private updateCategoria() {
    this.fillObject();
    this.categoriasProductoService.updateCategoriaProducto(this.categoria).subscribe({
      next: (res) => {
        this.alertsService.showAlert('Categoría actualizada', 'La categoría se ha actualizado correctamente', 'success');
        this.closeModal();
        this.loadCategorias();
        this.saving = false;
      },
      error: (err) => {
        this.alertsService.showError('Error al actualizar la categoría', err);
        this.saving = false;
      }
    });
  }

  private fillObject() {
    if (!this.categoria) this.categoria = new CategoriaProducto();
    this.categoria.nombre = this.categoriaForm.get('nombre').value;
    this.categoria.descripcion = this.categoriaForm.get('descripcion').value;
  }

  private fillForm(categoria: CategoriaProducto) {
    if (!categoria) return;
    this.categoriaForm.get('nombre').setValue(categoria.nombre);
    this.categoriaForm.get('descripcion').setValue(categoria.descripcion);
  }

  private checkPermissions(): boolean {
    if (!this.usuariosService.checkPermissions('ACCESO_CATEGORIAS_PRODUCTOS')) return false;

    this.showCreateButton = this.usuariosService.hasPermission('CREACION_CATEGORIAS_PRODUCTOS');
    this.showEditButton = this.usuariosService.hasPermission('EDICION_CATEGORIAS_PRODUCTOS');
    this.showDeleteButton = this.usuariosService.hasPermission('ELIMINACION_CATEGORIAS_PRODUCTOS');

    return true;
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

  protected readonly onsubmit = onsubmit;
}
