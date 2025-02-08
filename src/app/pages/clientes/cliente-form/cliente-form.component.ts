import {Component, OnInit} from '@angular/core';
import {AlertsService} from '../../../services/alerts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientesService} from '../../../services/clientes.service';
import {Cliente} from '../../../models/cliente.model';
import {ReactiveFormsModule} from '@angular/forms';
import {Pais} from '../../../models/pais.model';
import {PaisesService} from '../../../services/paises.service';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  standalone: true,
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit{

  cliente: Cliente;
  paises: Pais[] = [];

  constructor(
    private clientesService: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertsService: AlertsService,
    private paisesService: PaisesService
  ) { }

  ngOnInit() {
    this.loadPaises();

    const id = this.activatedRoute.snapshot.params['id'];
    if (id && id !== 'new') {
      this.loadCliente(id);
    }
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

  fillForm() {

  }

}
