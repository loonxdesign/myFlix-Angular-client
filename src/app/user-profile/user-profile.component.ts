import { Component, OnInit, OnDestroy } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})

export class UserProfileComponent implements OnInit, OnDestroy {
  user: any = { Username: '', Password: '', Email: '', Birth: '' };
  favoriteMovies: any[] = [];
  movies: any[] = [];
  favorites: any[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.getAllMovies();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public loadUser(): void {
    this.fetchApiData.getUser().pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      this.user = user;
      this.getFavoriteMovies(user._id);
    });
  }

  public back(): void {
    this.router.navigate(['movies']);
  }

  public updateUser(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '400px',
      height: '400px',
      data: {
        title: 'UPDATE USER',
        button: 'Update',
        function: 'updateUser()',
      },
    });
  }

  public deleteUser(): void {
    if (confirm('Do you want to delete your account permanently?')) {
      this.fetchApiData.deleteUser(this.user._id).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        this.router.navigate(['welcome']).then(() => {
          localStorage.clear();
          this.snackBar.open('Your account has been deleted', 'OK', {
            duration: 3000,
          });
        });
      });
    }
  }

  public getAllMovies(): void {
    this.fetchApiData.getAllMovies().pipe(takeUntil(this.unsubscribe$)).subscribe((resp: any) => {
      this.movies = resp;
    });
  }

  public getFavoriteMovies(userId: string): void {
    this.fetchApiData.getFavoriteMovies(userId).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (resp: any) => {
        if (resp && resp.FavoriteMovies) {
          this.favoriteMovies = resp.FavoriteMovies;
        } else {
          this.favoriteMovies = [];
        }
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.favoriteMovies = [];
      }
    );
  }

  public isFavoriteMovie(movieID: string): boolean {
    return this.favoriteMovies.includes(movieID);
  }

  public addToFavorites(id: string): void {
    this.fetchApiData.addFavoriteMovie(this.user._id, id).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.getFavoriteMovies(this.user._id);
    });
  }

  public removeFavoriteMovie(id: string): void {
    this.fetchApiData.deleteFavoriteMovie(this.user._id, id).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.snackBar.open('Removed from favorites', 'OK', {
        duration: 2000,
      });
      this.getFavoriteMovies(this.user._id);
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