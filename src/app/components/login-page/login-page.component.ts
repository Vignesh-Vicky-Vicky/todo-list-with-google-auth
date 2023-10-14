import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private googleAuth: AuthService, private router: Router) { }

  ngOnInit(): void {
    const user = window.localStorage.getItem("user");

    if (user) {
      this.router.navigate(["/home"]);
    }
  }

  //SignIn with google
  signinWithGoogle() {
    this.googleAuth.googleSignIn();
  }
}
