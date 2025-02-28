import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProveedoresService} from '../../../services/proveedores.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertsService} from '../../../services/alerts.service';
import {PaisesService} from '../../../services/paises.service';
import {UsuariosService} from '../../../services/usuarios.service';
import {Proveedor} from '../../../models/proveedor.model';
import {Pais} from '../../../models/pais.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-proveedor-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './proveedor-form.component.html',
  standalone: true,
  styleUrl: './proveedor-form.component.css'
})
export class ProveedorFormComponent implements OnInit {

  proveedorForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    nif: new FormControl('', [Validators.maxLength(9)]),
    email: new FormControl('', [Validators.maxLength(150)]),
    telefono: new FormControl('', [Validators.maxLength(15)]),
    pais: new FormControl(''),
    provincia: new FormControl('', [Validators.maxLength(100)]),
    poblacion: new FormControl('', [Validators.maxLength(100)]),
    direccion: new FormControl('', [Validators.maxLength(255)]),
    codigoPostal: new FormControl('', [Validators.maxLength(5)]),
  })

  cardTitle: string = 'Crear un nuevo proveedor';
  proveedor: Proveedor;
  paises: Pais[] = [];

  constructor(
    private readonly proveedoresService: ProveedoresService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertsService: AlertsService,
    private readonly paisesService: PaisesService,
    private readonly usuariosService: UsuariosService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id !== 'new') {
      if (!this.usuariosService.checkPermissions('EDICION_PROVEEDORES')) return;
      this.cardTitle = 'Editar proveedor';
      this.loadProveedor(id);
    } else if(!this.usuariosService.checkPermissions('CREACION_PROVEEDORES')) {
      return;
    }
    this.loadPaises();
  }

  onSubmit() {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    if (this.proveedor) {
        this.updateProveedor();
    } else {
        this.createProveedor();
    }
  }

  private loadProveedor(id: number) {
    this.proveedoresService.getProveedorById(id).subscribe({
      next: (res) => {
        if (!res['data']) {
          this.alertsService.showError('Proveedor no encontrado');
          this.router.navigate(['/user/proveedores-table']);
          return;
        }
        this.proveedor = res['data'];
        this.fillForm();
      }
    });
  }

  private createProveedor() {
    this.fillObject();
    this.proveedoresService.createProveedor(this.proveedor).subscribe({
      next: () => {
        this.alertsService.showAlert('Proveedor creado', 'El proveedor ha sido creado correctamente', 'success');
        this.router.navigate(['/user/proveedores-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al crear el proveedor', err);
      }
    });
  }

  private updateProveedor() {
    this.fillObject();
    this.proveedoresService.updateProveedor(this.proveedor).subscribe({
      next: () => {
        this.alertsService.showAlert('Proveedor actualizado', 'El proveedor ha sido actualizado correctamente', 'success');
        this.router.navigate(['/user/proveedores-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al actualizar el proveedor', err);
      }
    });
  }

  private loadPaises() {
    this.paisesService.getPaises().subscribe({
      next: (res) => {
        this.paises = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los paises', err);
      }
    })
  }

  private fillForm() {
    this.proveedorForm.patchValue({
      nombre: this.proveedor.nombre,
        nif: this.proveedor.nif,
        email: this.proveedor.email,
        telefono: this.proveedor.telefono,
        pais: this.proveedor.pais ? (this.proveedor.pais as Pais).id : null,
        provincia: this.proveedor.provincia,
        poblacion: this.proveedor.poblacion,
        direccion: this.proveedor.direccion,
        codigoPostal: this.proveedor.codigoPostal
    })
  }

  private fillObject() {
    if (!this.proveedor) this.proveedor = new Proveedor();
    this.proveedor.nombre = this.proveedorForm.get('nombre').value;
    this.proveedor.nif = this.proveedorForm.get('nif').value;
    this.proveedor.email = this.proveedorForm.get('email').value;
    this.proveedor.telefono = this.proveedorForm.get('telefono').value;
    this.proveedor.pais = this.proveedorForm.get('pais').value != null
      ? this.paises.find(pais => pais.id == Number.parseInt(this.proveedorForm.get('pais').value))
      : null;
    this.proveedor.provincia = this.proveedorForm.get('provincia').value;
    this.proveedor.poblacion = this.proveedorForm.get('poblacion').value;
    this.proveedor.direccion = this.proveedorForm.get('direccion').value;
    this.proveedor.codigoPostal = this.proveedorForm.get('codigoPostal').value;
  }

}
