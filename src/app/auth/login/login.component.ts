import { Component } from '@angular/core';
import { AlertsService } from '../../services/alerts.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UsuariosService } from '../../services/usuarios.service';
import { LoginFormInterface } from '../../interfaces/login-form.interface';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(
    private alertsService: AlertsService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginFormValue: LoginFormInterface = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }

    this.usuariosService.login(loginFormValue).subscribe({
      next: () => {
        this.alertsService.showAlert('Inicio de sesión', 'Se ha iniciado sesión correctamente', 'success');
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => {
        this.alertsService.showError('Error al iniciar sesión', err);
      }
    })

  }

}
