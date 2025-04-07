import { Component } from '@angular/core';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoginForm } from './loginForm';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    InputIcon,
    IconField,
    InputTextModule,
    FormsModule,
    ButtonModule,
    Toast,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent {
  loading: boolean = false;
  loginForm: LoginForm = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  login() {
    this.loading = true;

    if (!this.loginForm.email || !this.loginForm.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Champs requis',
        detail: "Le nom d'utilisateur et le mot de passe sont requis.",
      });
      this.loading = false;
      return;
    }

    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;

        const message =
          err?.error?.message || 'Erreur inconnue lors de la connexion.';

        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: message,
        });
      },
    });
  }
}
