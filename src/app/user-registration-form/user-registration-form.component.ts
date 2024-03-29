import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';


// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Component for user registration form
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService, // Updated service type
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

/**
   * Initializes the component
   */  
ngOnInit(): void {
}

/**
   * Registers a new user
   */
// This is the function responsible for sending the form inputs to the backend
registerUser(): void {
  this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
    this.dialogRef.close(); // This will close the modal on success!
    console.log(result); // Assuming 'result' contains the information you need
    this.snackBar.open('Registration successful', 'OK', {
      duration: 2000
    });
  }, (error) => { // Renamed for clarity
    console.log(error);
    this.snackBar.open('Registration failed', 'OK', {
      duration: 2000
    });
  });
}

  }