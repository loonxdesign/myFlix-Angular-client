import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @Input() userData = { Username: "", Email: "", Birthday: "", FavoriteMovies: [] };

  user: any = {};
  FavoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    this.fetchApiData.fetchUserData().subscribe({
      next: (user) => {
        console.log("user", user);
        if (user) {
          this.userData.Username = user.Username;
          this.userData.Email = user.Email;
          this.userData.Birthday = user.Birthday;
          if (user.FavoriteMovies) {
            this.fetchFavoriteMovies(user.FavoriteMovies);
          }
        }
      },
      error: (error) => {
        console.error('Failed to fetch user data:', error);
      }
    });
  }

  fetchFavoriteMovies(favoriteMoviesIds: string[]): void {
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.FavoriteMovies = response.filter((movie: any) => favoriteMoviesIds.includes(movie._id));
    });
  }

  updateUser(): void {
    this.fetchApiData.editUserProfile(this.userData).subscribe((result) => {
      console.log('User update success:', result);
      // Fetch updated user data after successful update
      this.fetchApiData.fetchUserData().subscribe({
        next: (userData) => {
          // Update local storage with the latest user data
          localStorage.setItem('user', JSON.stringify(userData));
          this.userData = userData;
          // Show success message
          this.snackBar.open('User update successful', 'OK', {
            duration: 2000
          });
        },
        error: (error) => {
          console.error('Error fetching updated user data:', error);
          // Show error message
          this.snackBar.open('Failed to fetch updated user data', 'OK', {
            duration: 2000
          });
        }
      });
    }, (error) => {
      console.error('Error updating user:', error);
      // Show error message if user update fails
      this.snackBar.open('Failed to update user', 'OK', {
        duration: 2000
      });
    });
  }
  

  deleteUser(): void {
    const userId = this.user._id;
    this.router.navigate(['welcome']).then(() => {
      localStorage.clear();
      this.snackBar.open('User successfully deleted.', 'OK', {
        duration: 2000
      });
    });
    this.fetchApiData.deleteUser(userId).subscribe((result) => {
      console.log(result);
    });
  }

  openDirectorDialog(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth,
        Death: death
      },
      width: '450px',
    });
  }

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
      width: '450px',
    });
  }

  isFav(movie: any): any {
    return this.FavoriteMovies.some((favMovie) => favMovie._id === movie._id);
  }

  deleteFavMovies(movie: any): void {
    const username = this.userData.Username; // Get the username from userData
    const movieId = movie._id;
    console.log("delete user", username);
    console.log("delete movie", movieId);
    this.fetchApiData.deleteFavoriteMovie(username, movieId).subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.getProfile(); // Refresh user data after deletion
        this.snackBar.open('Movie has been deleted from your favorites!', 'OK', {
            duration: 3000,
        });
    });
}
}
