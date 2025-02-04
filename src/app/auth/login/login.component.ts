import { Component } from '@angular/core';
import { AlertsService } from '../../services/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private alertsService: AlertsService,
    private router: Router
  ) {}

  onSubmit() {
    this.router.navigate(['/user/dashboard']);
  }

}
