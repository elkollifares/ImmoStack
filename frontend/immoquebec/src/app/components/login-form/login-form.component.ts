import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute ,Router, RouterModule} from '@angular/router';
import { first } from 'rxjs';
import { UserInfo } from '../../models/user-info.model';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnInit {

  loginFormGroup!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  userInfo!: UserInfo;


  constructor(private formBuilder: FormBuilder, private router: Router,
              private authenticationService: AuthenticationService, private route: ActivatedRoute,
              private userService: UserService) {

    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {

    this.loginFormGroup = this.formBuilder.group({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])

      }
    );
  }


  get f() {
    return this.loginFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f['email'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {

          this.userService.getUserInfo(this.authenticationService.currentUserValue!.id).subscribe({
            next: response => {
              this.userInfo = response;
              this.userService.getImage.next(this.userInfo.imageUrl);


              if (this.authenticationService.currentUserValue!.roles.includes('ADMIN')) {
                this.router.navigateByUrl('/admin-panel');
              }
            },
            error: err => {
              this.router.navigateByUrl('/full-info');
            }
          });

          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });

  }
}

