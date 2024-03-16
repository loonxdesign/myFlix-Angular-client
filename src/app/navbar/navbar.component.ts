import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'], // Corrected here
})
export class NavbarComponent implements OnInit {
  constructor(
    public router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }

  public openMovies(): void {
    this.router.navigate(['movies']);
  }

  public openProfile(): void {
    this.router.navigate(['profile']);
  }
  
  public logoutUser(): void {
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    this.router.navigate(['welcome']);
    this.snackBar.open('User logout successful', 'OK', {
      duration: 2000
    });
  }
}
