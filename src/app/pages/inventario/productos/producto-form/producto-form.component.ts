import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Producto} from '../../../../models/producto.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertsService} from '../../../../services/alerts.service';
import {ProductosService} from '../../../../services/productos.service';
import {UsuariosService} from '../../../../services/usuarios.service';
import {CategoriaProducto} from '../../../../models/categoria-producto.model';
import {CategoriasProductoService} from '../../../../services/categorias-producto.service';
import {NgClass} from '@angular/common';
import {CategoriaProductoFilter} from '../../../../filters/categoria-producto.filter';

@Component({
  selector: 'app-producto-form',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './producto-form.component.html',
  standalone: true,
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {

  productoForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    descripcion: new FormControl('', [Validators.maxLength(255)]),
    categoria: new FormControl(''),
    precioVenta: new FormControl('', [Validators.required]),
    impuestoVenta: new FormControl(21, [Validators.required]),
    coste: new FormControl('', [Validators.required]),
    impuestoCompra: new FormControl(21, [Validators.required]),
    stock: new FormControl('', [Validators.required])
  });

  cardTitle: string = 'Crear un nuevo producto';
  producto: Producto;
  categorias: CategoriaProducto[] = [];
  precioVentaConImpuesto: number = 0;
  precioCompraConImpuesto: number = 0;

  imagenUrl: string | null = null;
  imagenFile: File | null = null;

  loading: boolean = false;
  imageChanged: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertsService: AlertsService,
    private readonly productosService: ProductosService,
    private readonly usuariosService: UsuariosService,
    private readonly categoriasProductoService: CategoriasProductoService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id !== 'new') {
      if (!this.usuariosService.checkPermissions('EDICION_PRODUCTOS')) return;
      this.cardTitle = 'Editar producto';
      this.loadProducto(id);
    } else if(!this.usuariosService.checkPermissions('CREACION_PRODUCTOS')) {
      return;
    }
    this.loadCategorias();
    this.calculatePrecioVentaConImpuesto();
    this.calculatePrecioCompraConImpuesto();
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    if (this.producto) {
      this.updateProducto();
    } else {
      this.createProducto();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    this.imageChanged = true;
  }

  removeImage() {
    this.imagenUrl = null;
    this.imagenFile = null;
    this.imageChanged = true;
  }

  calculatePrecioVentaConImpuesto() {
    const precioVenta = this.productoForm.get('precioVenta')?.value || 0;
    const impuestoVenta = this.productoForm.get('impuestoVenta')?.value || 0;
    this.precioVentaConImpuesto = parseFloat((precioVenta * (1 + impuestoVenta / 100)).toFixed(2));
  }

  calculatePrecioCompraConImpuesto() {
    const coste = this.productoForm.get('coste')?.value || 0;
    const impuestoCompra = this.productoForm.get('impuestoCompra')?.value || 0;
    this.precioCompraConImpuesto = parseFloat((coste * (1 + impuestoCompra / 100)).toFixed(2));
  }

  private loadProducto(id: number) {
    this.productosService.getProductoById(id).subscribe({
      next: (res: any) => {
        this.producto = res['data'];
        this.fillForm();
      },
      error: (err) => {
        this.alertsService.showError('No se ha podido cargar el producto', err);
      }
    })
  }

  private createProducto() {
    this.fillObject();
    this.productosService.createProducto(this.producto, this.imagenFile).subscribe({
      next: (res: any) => {
        this.alertsService.showAlert('Producto creado', 'El producto se ha creado correctamente', 'success');
        this.router.navigate(['/user/inventario/productos-view']);
        this.loading = false;
      },
      error: (err) => {
        this.alertsService.showError('Error al crear el producto', err);
        this.loading = false;
      }
    });
  }

  private updateProducto() {
    this.fillObject();
    this.productosService.updateProducto(this.producto, this.imagenFile, this.imageChanged).subscribe({
      next: (res: any) => {
        this.alertsService.showAlert('Producto actualizado', 'El producto se ha actualizado correctamente', 'success');
        this.router.navigate(['/user/inventario/productos-view']);
        this.loading = false;
      },
      error: (err) => {
        this.alertsService.showError('Error al actualizar el producto', err);
        this.loading = false;
      }
    });
  }

  private loadCategorias() {
    this.categoriasProductoService.getCategoriasProductoByFilter(new CategoriaProductoFilter()).subscribe({
      next: (res: any) => {
        this.categorias = res['data']?.content;
      },
      error: (err) => {
        this.alertsService.showError('No se han podido cargar las categorías de producto', err);
      }
    })
  }

  private fillForm() {
    this.productoForm.patchValue({
      nombre: this.producto.nombre,
      descripcion: this.producto.descripcion,
      categoria: this.producto.categoria ? (this.producto.categoria as CategoriaProducto).id : '',
      precioVenta: this.producto.precioVenta,
      impuestoVenta: this.producto.impuestoVenta,
      coste: this.producto.coste,
      impuestoCompra: this.producto.impuestoCompra,
      stock: this.producto.stock
    })

    console.log(this.producto);
    if (this.producto.imagenUrl) {
      this.imagenUrl = this.producto.imagenUrl;
    }
  }

  private fillObject() {
    if (!this.producto) {
      this.producto = new Producto();
    }
    this.producto.nombre = this.productoForm.get('nombre')?.value;
    this.producto.descripcion = this.productoForm.get('descripcion')?.value;
    this.producto.categoria = this.productoForm.get('categoria').value != null
      ? this.categorias.find(categoria => categoria.id == Number.parseInt(this.productoForm.get('categoria').value))
      : null;
    this.producto.precioVenta = this.productoForm.get('precioVenta')?.value;
    this.producto.impuestoVenta = this.productoForm.get('impuestoVenta')?.value;
    this.producto.coste = this.productoForm.get('coste')?.value;
    this.producto.impuestoCompra = this.productoForm.get('impuestoCompra')?.value;
    this.producto.stock = this.productoForm.get('stock')?.value;
  }

}
