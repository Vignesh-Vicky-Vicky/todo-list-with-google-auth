import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider } from "@angular/fire/auth"
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router) { }

  // Login 
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {
      localStorage.setItem('user', JSON.stringify(res.user));
      this.router.navigate(['/home']);
    }, err => {
      alert(err.message)
    })
  }

  // Signout
  signOut() {
    return this.fireauth.signOut().then(res => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}
