import {Component, OnInit} from '@angular/core';
import {AlertsService} from '../../../services/alerts.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ClientesService} from '../../../services/clientes.service';
import {Cliente} from '../../../models/cliente.model';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Pais} from '../../../models/pais.model';
import {PaisesService} from '../../../services/paises.service';
import {UsuariosService} from '../../../services/usuarios.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule, RouterLink, FormsModule, NgClass],
  templateUrl: './cliente-form.component.html',
  standalone: true,
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {

  clientForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    apellidos: new FormControl('', [Validators.maxLength(150)]),
    nif: new FormControl('', [Validators.maxLength(9)]),
    email: new FormControl('', [Validators.maxLength(150)]),
    telefono: new FormControl('', [Validators.maxLength(15)]),
    pais: new FormControl(''),
    provincia: new FormControl('', [Validators.maxLength(100)]),
    poblacion: new FormControl('', [Validators.maxLength(100)]),
    direccion: new FormControl('', [Validators.maxLength(255)]),
    codigoPostal: new FormControl('', [Validators.maxLength(5)]),
  });

  cliente: Cliente;
  paises: Pais[] = [];

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService,
    private paisesService: PaisesService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id !== 'new') {
      if (!this.checkPermissions('EDICION_CLIENTES')) return;
      this.loadCliente(id);
    } else if(!this.checkPermissions('CREACION_CLIENTES')) {
      return;
    }
    this.loadPaises();
  }

  loadPaises() {
    this.paisesService.getPaises().subscribe({
      next: (res) => {
        this.paises = res['data'];
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar los paises', err);
      }
    })
  }

  loadCliente(id: number) {
    this.clientesService.getClienteById(id).subscribe({
      next: (res) => {
        this.cliente = res['data'];
        this.fillForm();
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar el cliente', err);
        this.router.navigate(['/user/clientes-table']);
      }
    })
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      console.log('Formulario inválido');
      this.clientForm.markAllAsTouched();
      return;
    }

    if (this.cliente) {
      this.updateCliente();
    } else {
      this.createCliente();
    }
  }

  createCliente() {
    this.cliente = this.clientForm.value;
    this.cliente.pais = this.paises.find(pais => pais.id === this.cliente.pais);
    this.clientesService.createCliente(this.cliente).subscribe({
      next: (res) => {
        this.alertsService.showAlert('Cliente creado', 'El cliente se ha creado correctamente', 'success');
        this.router.navigate(['/user/clientes-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al crear el cliente', err);
      }
    });
  }

  updateCliente() {

  }

  fillForm() {
    this.clientForm.patchValue({
      nombre: this.cliente.nombre,
      apellidos: this.cliente.apellidos,
      nif: this.cliente.nif,
      email: this.cliente.email,
      telefono: this.cliente.telefono,
      pais: this.cliente.pais,
      provincia: this.cliente.provincia,
      poblacion: this.cliente.poblacion,
      direccion: this.cliente.direccion,
      codigoPostal: this.cliente.codigoPostal,
    });
  }

  checkPermissions(permission: string): boolean {
    if (!this.usuariosService.hasPermission(permission)) {
      this.alertsService.showError('No tienes permisos para acceder a esta página');
      this.usuariosService.logout();
      return false;
    }
    return true;
  }

}
