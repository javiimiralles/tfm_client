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

  cardTitle: string = 'Crear un nuevo cliente';
  cliente: Cliente;
  paises: Pais[] = [];

  constructor(
    private readonly clientesService: ClientesService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly alertsService: AlertsService,
    private readonly paisesService: PaisesService,
    private readonly usuariosService: UsuariosService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id !== 'new') {
      if (!this.usuariosService.checkPermissions('EDICION_CLIENTES')) return;
      this.cardTitle = 'Editar cliente';
      this.loadCliente(id);
    } else if(!this.usuariosService.checkPermissions('CREACION_CLIENTES')) {
      return;
    }
    this.loadPaises();
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    if (this.cliente) {
      this.updateCliente();
    } else {
      this.createCliente();
    }
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

  private loadCliente(id: number) {
    this.clientesService.getClienteById(id).subscribe({
      next: (res) => {
        if (!res['data']) {
          this.alertsService.showError('Cliente no encontrado');
          this.router.navigate(['/user/clientes-table']);
          return;
        }
        this.cliente = res['data'];
        this.fillForm();
      },
      error: (err) => {
        this.alertsService.showError('Error al cargar el cliente', err);
        this.router.navigate(['/user/clientes-table']);
      }
    })
  }

  private createCliente() {
    this.cliente = this.clientForm.value;
    this.cliente.pais = this.clientForm.get('pais').value != null
      ? this.paises.find(pais => pais.id == Number.parseInt(this.clientForm.get('pais').value))
      : null;
    this.clientesService.createCliente(this.cliente).subscribe({
      next: () => {
        this.alertsService.showAlert('Cliente creado', 'El cliente se ha creado correctamente', 'success');
        this.router.navigate(['/user/clientes-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al crear el cliente', err);
      }
    });
  }

  private updateCliente() {
    this.fillObject();
    this.clientesService.updateCliente(this.cliente).subscribe({
      next: () => {
        this.alertsService.showAlert('Cliente actualizado', 'El cliente se ha actualizado correctamente', 'success');
        this.router.navigate(['/user/clientes-table']);
      },
      error: (err) => {
        this.alertsService.showError('Error al actualizar el cliente', err);
      }
    });
  }

  private fillForm() {
    this.clientForm.patchValue({
      nombre: this.cliente.nombre,
      apellidos: this.cliente.apellidos,
      nif: this.cliente.nif,
      email: this.cliente.email,
      telefono: this.cliente.telefono,
      pais: this.cliente.pais ? (this.cliente.pais as Pais).id : null,
      provincia: this.cliente.provincia,
      poblacion: this.cliente.poblacion,
      direccion: this.cliente.direccion,
      codigoPostal: this.cliente.codigoPostal,
    });
  }

  private fillObject() {
    this.cliente.nombre = this.clientForm.get('nombre').value;
    this.cliente.apellidos = this.clientForm.get('apellidos').value;
    this.cliente.nif = this.clientForm.get('nif').value;
    this.cliente.email = this.clientForm.get('email').value;
    this.cliente.telefono = this.clientForm.get('telefono').value;
    this.cliente.pais = this.clientForm.get('pais').value != null
      ? this.paises.find(pais => pais.id == Number.parseInt(this.clientForm.get('pais').value))
      : null;
    this.cliente.provincia = this.clientForm.get('provincia').value;
    this.cliente.poblacion = this.clientForm.get('poblacion').value;
    this.cliente.direccion = this.clientForm.get('direccion').value;
    this.cliente.codigoPostal = this.clientForm.get('codigoPostal').value;
  }
}
