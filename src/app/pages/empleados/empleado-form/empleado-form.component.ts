import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Empleado} from '../../../models/empleado.model';
import {Pais} from '../../../models/pais.model';
import {EmpleadosService} from '../../../services/empleados.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertsService} from '../../../services/alerts.service';
import {PaisesService} from '../../../services/paises.service';
import {UsuariosService} from '../../../services/usuarios.service';
import {NgClass} from '@angular/common';
import {GeneroEnum} from '../../../enums/genero.enum';
import Datepicker from 'flowbite-datepicker/Datepicker';
import {Rol} from '../../../models/rol.model';
import {RolesService} from '../../../services/roles.service';

@Component({
  selector: 'app-empleado-form',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './empleado-form.component.html',
  standalone: true,
  styleUrl: './empleado-form.component.css'
})
export class EmpleadoFormComponent implements OnInit, AfterViewInit {

  datosBasicosForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    apellidos: new FormControl('', [Validators.maxLength(150)]),
    nif: new FormControl('', [Validators.maxLength(9)]),
    fechaNacimiento: new FormControl(''),
    genero: new FormControl(''),
    telefono: new FormControl('', [Validators.maxLength(15)]),
  });

  direccionForm: FormGroup = new FormGroup({
    pais: new FormControl(''),
    provincia: new FormControl('', [Validators.maxLength(100)]),
    poblacion: new FormControl('', [Validators.maxLength(100)]),
    direccion: new FormControl('', [Validators.maxLength(255)]),
    codigoPostal: new FormControl('', [Validators.maxLength(5)]),
  });

  infoUsuarioForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    password: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    rol: new FormControl(''),
  });

  cardTitle: string = 'Crear un nuevo empleado';
  empleado: Empleado;
  paises: Pais[] = [];
  roles: Rol[] = [];
  generos: string[] = Object.values(GeneroEnum);
  activeTab: string = 'datosBasicosTab';

  constructor(
    private readonly empleadosService: EmpleadosService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertsService: AlertsService,
    private readonly paisesService: PaisesService,
    private readonly usuariosService: UsuariosService,
    private readonly rolesService: RolesService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id !== 'new') {
      if (!this.checkPermissions('EDICION_CLIENTES')) return;
      this.cardTitle = 'Editar cliente';
      this.loadEmpleado(id);
    } else if(!this.checkPermissions('CREACION_CLIENTES')) {
      return;
    }
    this.loadRoles();
    this.loadPaises();
  }

  ngAfterViewInit() {
    this.initDatepicker();
  }

  onSubmit() {
    if (this.datosBasicosForm.invalid || this.direccionForm.invalid || this.infoUsuarioForm.invalid) {
      this.datosBasicosForm.markAllAsTouched();
      this.direccionForm.markAllAsTouched();
      this.infoUsuarioForm.markAllAsTouched();
      this.alertsService.showAlert('Advertencia', 'Hay campos obligatorios sin rellenar', 'warning');
      return;
    }

    if (this.empleado) {
      this.updateEmpleado();
    } else {
      this.createEmpleado();
    }
  }

  onChangeTab(targetTab: string) {
    const inactiveClass = 'tab cursor-pointer inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';
    const activeClass = 'tab cursor-pointer inline-block p-4 text-indigo-600 border-b-2 border-indigo-600 rounded-t-lg active dark:text-indigo-500 dark:border-indigo-500';

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.classList.value = inactiveClass;
    });

    const target = document.getElementById(targetTab);
    target.classList.value = activeClass;
    this.activeTab = targetTab;
  }

  generateRandomPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+<>?";
    let password = "";
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    this.infoUsuarioForm.patchValue({
      password: password,
    });
  }

  private loadEmpleado(id: number) {
    this.empleadosService.getEmpleadoById(id).subscribe({
      next: (res) => {
        if (!res['data']) {
          this.alertsService.showError('Empleado no encontrado');
          this.router.navigate(['/user/empleados-table']);
          return;
        }
        this.empleado = res['data'];
        this.fillForm();
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar el empleado', err);
        this.router.navigate(['/user/empleados-table']);
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

  private loadRoles() {
    this.rolesService.getRoles().subscribe({
      next: (res) => {
        this.roles = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los roles', err);
      }
    });
  }

  private loadPermisosAsociados(idRol: number) {

  }

  private createEmpleado() {

  }

  private updateEmpleado() {

  }

  private initDatepicker() {
    const datepickerEl = document.getElementById('fechaNacimiento');
    new Datepicker(datepickerEl, {
      autohide: true,
    });
  }

  private fillForm() {
    this.datosBasicosForm.patchValue({
      nombre: this.empleado.nombre,
      apellidos: this.empleado.apellidos,
      nif: this.empleado.nif,
      fechaNacimiento: this.empleado.fechaNacimiento,
      genero: this.empleado.genero,
      telefono: this.empleado.telefono,
    });
    this.direccionForm.patchValue({
      pais: this.empleado.pais ? this.empleado.pais.id : null,
      provincia: this.empleado.provincia,
      poblacion: this.empleado.poblacion,
      direccion: this.empleado.direccion,
      codigoPostal: this.empleado.codigoPostal,
    });
    this.infoUsuarioForm.patchValue({
      email: this.empleado.email,
      password: '',
      rol: this.empleado.rol,
    });
  }

  private checkPermissions(permission: string): boolean {
    if (!this.usuariosService.hasPermission(permission)) {
      this.alertsService.showError('No tienes permisos para acceder a esta página');
      this.usuariosService.logout();
      return false;
    }
    return true;
  }

}
