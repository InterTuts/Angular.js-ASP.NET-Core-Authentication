// System Utils
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { MatCardTitle, MatCardContent, MatCardActions, MatCardFooter } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// App Utils
import { environment } from '../../environment';
import { AuthLayoutComponent } from '../../shared/layouts/auth-layout/auth-layout.component';
import { UserService } from '../../shared/services/user.service';

// Configuration
@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatCardFooter,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    AuthLayoutComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: '../../shared/styles/auth/_main.scss',
  standalone: true
})

// Logic
export class SignUpComponent implements OnInit {
  // Site Name
  siteName = environment.siteName;

  // Sign up form
  signUpForm: FormGroup = new FormGroup({});

  // Errors messages
  errors = {
    email: '',
    password: '',
  };

  // Submitting status
  isSubmitting = false;

  // Success user creation message
  successMessage = '';

  // Error user creation message
  errorMessage = '';

  // Reference for component destroy
  destroyRef = inject(DestroyRef);

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('sign_up').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Initialize FormGroup
    this.signUpForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
    });

  }

  /**
   * Handle sign in submit
   *
   * @param event
   */
  onSignUp(event: Event) {
    event.preventDefault();

    // Reset error messages
    this.errors.email = '';
    this.errors.password = '';

    // Get the inputs data
    const email = this.signUpForm.get('email');
    const password = this.signUpForm.get('password');

    // Enable the animation
    this.isSubmitting = true;

    // Verify if the received user data is valid
    if (this.signUpForm.valid) {

      // Reset messages
      this.successMessage = '';
      this.errorMessage = '';

      // Register the user
      const observable = this.userService.register(
        this.signUpForm.value as { email: string; password: string },
      );

      // Subscribe to the registration response
      observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data: unknown) => {
          const received = data as { success: boolean; message: string };
          if (received.success) {
            this.successMessage = received.message;
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          } else {
            this.errorMessage = received.message;
            console.log(this.errorMessage);
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          // Hide the animation
          this.isSubmitting = false;
        }
      });

    } else {

      // Check if errors exists for email
      if (email && email.errors) {
        // Detect email format error
        this.errors.email =
          typeof email.errors['email'] !== 'undefined'
            ? this.translateService.instant('auth_email_not_valid')
            : '';

        // Detect required error
        this.errors.email =
          typeof email.errors['required'] !== 'undefined'
            ? this.translateService.instant('auth_email_short')
            : this.errors.email;
      }

      // Verify if errors exists for password
      if (password && password.errors) {
        // Detect short password
        this.errors.password =
          typeof password.errors['minlength'] !== 'undefined'
            ? this.translateService.instant('auth_password_short')
            : '';

        // Detect long password
        this.errors.password =
          typeof password.errors['maxlength'] !== 'undefined'
            ? this.translateService.instant('auth_password_long')
            : '';

        // Detect required error
        this.errors.password =
          typeof password.errors['required'] !== 'undefined'
            ? this.translateService.instant('auth_password_short')
            : this.errors.password;
      }

      // Hide the animation
      this.isSubmitting = false;

    }

  }
}