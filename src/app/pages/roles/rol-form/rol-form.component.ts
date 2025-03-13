import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Rol} from '../../../models/rol.model';
import {Accion} from '../../../models/accion.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertsService} from '../../../services/alerts.service';
import {UsuariosService} from '../../../services/usuarios.service';
import {AccionesService} from '../../../services/acciones.service';
import {RolesService} from '../../../services/roles.service';
import {NgClass} from '@angular/common';
import {Permiso} from '../../../models/permiso.model';
import {PermisosService} from '../../../services/permisos.service';
import {forkJoin} from 'rxjs';
import {RolForm} from '../../../forms/rol.form';

@Component({
  selector: 'app-rol-form',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './rol-form.component.html',
  standalone: true,
  styleUrl: './rol-form.component.css'
})
export class RolFormComponent implements OnInit {

  rolForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    descripcion: new FormControl('', [Validators.maxLength(255)])
  })

  cardTitle: string = 'Crear un nuevo rol';
  rol: Rol;
  rolData: RolForm = new RolForm();
  acciones: Accion[] = [];
  agrupacionesAcciones: Accion[][] = [];
  accordionStates: boolean[] = [];
  permisos: Permiso[] = [];
  checkedPermissions: { [accionId: number]: boolean } = {};

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertsService: AlertsService,
    private readonly usuariosService: UsuariosService,
    private readonly rolesService: RolesService,
    private readonly accionesService: AccionesService,
    private readonly permisosService: PermisosService
  ) {
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id !== 'new') {
      if (!this.usuariosService.checkPermissions('EDICION_ROLES')) return;
      this.cardTitle = 'Editar rol';
      forkJoin({
        rol: this.rolesService.getRolById(id),
        acciones: this.accionesService.getAcciones()
      }).subscribe({
        next: ({ rol, acciones }) => {
          if (!rol['data']) {
            this.alertsService.showError('Rol no encontrado');
            this.router.navigate(['/user/roles-table']);
            return;
          }
          this.rol = rol['data'];
          this.acciones = acciones['data'];
          this.agruparAcciones();

          // Una vez que ambas han cargado, llamamos a loadPermisos
          this.loadPermisos();
        },
        error: (err) => {
          this.alertsService.showError('Error al cargar los datos', err);
          this.router.navigate(['/user/roles-table']);
        }
      });
    } else if(!this.usuariosService.checkPermissions('CREACION_ROLES')) {
      return;
    } else {
      this.loadAcciones();
    }
  }

  onSubmit() {
    if (!this.rolForm.valid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    if (!this.rol) {
      this.createRol();
    } else {
      this.updateRol();
    }

  }

  toggleAccordion(index: number) {
    this.accordionStates[index] = !this.accordionStates[index];
  }

  togglePermission(accionId: number) {
    this.checkedPermissions[accionId] = !this.checkedPermissions[accionId];
  }

  private loadAcciones() {
    this.accionesService.getAcciones().subscribe({
      next: (res) => {
        this.acciones = res['data'];
        this.agruparAcciones();
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar las acciones', err);
        this.router.navigate(['/user/roles-table']);
      }
    });
  }

  private createRol() {
    this.fillObject();
    this.rolesService.createRol(this.rolData).subscribe({
      next: (res) => {
        this.alertsService.showAlert('Rol creado', 'Se ha creado el rol correctamente', 'success');
        this.router.navigate(['/user/roles-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al crear el rol', err);
      }
    })
  }

  private updateRol() {
    this.fillObject();
    this.rolesService.updateRol(this.rol.id, this.rolData).subscribe({
      next: (res) => {
        this.alertsService.showAlert('Rol actualizado', 'Se ha actualizado el rol correctamente', 'success');
        this.router.navigate(['/user/roles-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al actualizar el rol', err);
      }
    })
  }

  private loadPermisos() {
    this.permisosService.getPermisosByRol(this.rol.id).subscribe({
      next: (res) => {
        this.permisos = res['data'];
        this.fillForm();
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los permisos', err);
        this.router.navigate(['/user/roles-table']);
      }
    });
  }

  private agruparAcciones() {
    const agrupaciones: { [key: string]: Accion[] } = {};
    this.acciones.forEach(accion => {
      if (!agrupaciones[accion.grupo]) {
        agrupaciones[accion.grupo] = [];
      }
      agrupaciones[accion.grupo].push(accion);
    });

    this.agrupacionesAcciones = Object.values(agrupaciones);
    this.accordionStates = new Array(this.agrupacionesAcciones.length).fill(false);
  }

  private fillForm() {
    this.rolForm.patchValue(this.rol);
    this.checkedPermissions = {};

    this.permisos.forEach(permiso => {
      this.checkedPermissions[permiso.accion.id] = true;
    });
  }

  private fillObject() {
    this.rolData.nombre = this.rolForm.get('nombre').value;
    this.rolData.descripcion = this.rolForm.get('descripcion').value;
    this.rolData.acciones = [];
    this.acciones.forEach(accion => {
      if (this.checkedPermissions[accion.id]) {
        this.rolData.acciones.push(accion);
      }
    });
  }

}
