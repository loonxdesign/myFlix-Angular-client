import { Component, Input, OnInit, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  user: any = { Username: '', Password: '', Email: '', Birth: '' };

  FavoriteMovies: any[] = [];
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  /**
   * first this component loaded, it will load the current user data, update localstorage
   */

  ngOnInit(): void {
    this.loadUser();
    this.getAllMovies();
  }

  public loadUser(): void {
    this.user = this.fetchApiData.getOneUser();
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.FavoriteMovies = response.filter((movie: any) =>
        this.user.FavoriteMovies.includes(movie._id)
      );
    });
  }
  /**
   * this will redirect to the home page
   */
  public back(): void {
    this.router.navigate(['movies']);
  }

  public updateUser(): void {
    // Used registartionComponent with another shared variables
    this.dialog.open(UserRegistrationFormComponent, {
      width: '400px',
      height: '400px',
      data: {
        title: 'UPDATE USER',
        button: 'Update',
        function: 'updateUser()',
      },
    });
    this.fetchApiData.currentUser.subscribe(
      (userData) => (this.user = userData)
    );
  }

  deleteUser(): void {
    if (confirm('Do you want to delete your account permanently?')) {
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('Your account has been deleted', 'OK', {
          duration: 3000,
        });
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
      });
    }
  }

  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getFavorites(): void {
    this.fetchApiData.getOneUser().subscribe(
      (resp: any) => {
        if (resp.user && resp.user.FavoriteMovies) {
          this.favorites = resp.user.FavoriteMovies;
        } else {
          this.favorites = []; // Set an empty array if data is not available
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favorites = []; // Set an empty array on error as well
      }
    );
  }

  isFavoriteMovie(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }

  addToFavorites(id: string): void {
    if (this.isFavoriteMovie(id)) {
      // Movie is already a favorite, so remove it
      this.removeFavoriteMovie(id);
    } else {
      // Movie is not a favorite, so add it
      this.fetchApiData.addFavoriteMovies(id).subscribe(() => {
        this.snackBar.open('Movie added to favorites', 'OK', {
          duration: 2000,
        });
        this.getFavorites();
      });
    }
  }

  removeFavoriteMovie(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(id).subscribe(() => {
      this.snackBar.open('removed from favorites', 'OK', {
        duration: 2000,
      });
    });
  }

  public getGenre(genre: any) {
    this.dialog.open(GenreComponent, {
      width: '400px',
      height: '300px',
      data: { genre: genre },
    });
  }

  public getOneDirector(director: any) {
    this.dialog.open(DirectorComponent, {
      width: '400px',
      height: '300px',
      data: { director: director },
    });
  }

  public openMovieDetails(details: string) {
    this.dialog.open(MovieDetailsComponent, {
      width: '400px',
      height: '300px',
      data: { details: details },
    });
  }
}
