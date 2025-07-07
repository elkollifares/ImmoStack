import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { LoginFormComponent } from "../login-form/login-form.component";
import { RegisterFormComponent } from '../register-form/register-form.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [LoginFormComponent,RegisterFormComponent,CommonModule]
})
export class LoginComponent implements OnInit {

  isRegistration!: boolean;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(v => {
      this.isRegistration = v['registration'];
    });
  }
}
