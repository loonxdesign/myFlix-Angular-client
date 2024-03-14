import { FetchApiDataService } from '../fetch-api-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public FetchApiDataService: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Function responsible for sending the form inputs to the backend
   */
  loginUser(): void {
    this.FetchApiDataService.userLogin(this.userData).subscribe(
      (result) => {
        console.log(result);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close();
        this.snackBar.open('User logged in successfully', 'OK', {
          duration: 2000
        });
        this.router.navigate(['movies']);
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Login failed', 'OK', {
          duration: 2000
        });
      }
    );
  }
}
