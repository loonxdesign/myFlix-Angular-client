import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';


import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  userData = { Username: "", FavoriteMovies: [] };
  FavoriteMovies: any[] = [];
  isFavMovie: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }


  openMovieDetails(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      data: { details: movie.Description /* Adjust based on your data structure */ },
    });
  }

  ngOnInit(): void {
    this.getMovies();
    this.getFavMovies();
    this.loadUserData();
  }

  loadUserData(): void {
    this.fetchApiData.fetchUserData().subscribe({
      next: (userData) => {
        this.userData = userData;
        console.log('User data loaded:', this.userData);
        // Call addFavMovies() here to ensure userData is loaded before attempting to add favorites
        if (this.isFavMovie) {
          this.addFavMovies(this.movies);
        }
      },
      error: (error) => {
        console.error('Failed to load user data:', error);
      }
    });
  }
  

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach(movie => console.log(movie));
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
  
  getFavMovies(): void {
    this.fetchApiData.fetchUserData().subscribe({
      next: (user: any) => {
        this.userData = user;
        // Check if user.FavoriteMovies exists and is an array; if not, default to an empty array
        this.FavoriteMovies = Array.isArray(user.FavoriteMovies) ? user.FavoriteMovies : [];
        console.log('Fav Movies in getFavMovies', this.FavoriteMovies);
        // Call toggleFav() here to update the state of favorite movies
        //this.toggleFav(null); // Pass null or any placeholder since we don't need to use movie data here
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        // Default to an empty array in case of error
        this.FavoriteMovies = [];
      }
    });
  }
  isFav(movie: any): boolean {
    console.log(this.FavoriteMovies.includes(movie._id));
    return this.FavoriteMovies.includes(movie._id);
  }
  
  toggleFav(movie: any): void {
    if (!movie) {
      console.error('Invalid movie data.');
      return;
    }
  
    const isFavorite = this.isFav(movie);
    isFavorite
      ? this.deleteFavMovies(movie)
      : this.addFavMovies(movie);
  }

  addFavMovies(movie: any): void {
    if (!this.userData || !this.userData.Username) {
      console.error('User data is not loaded. Cannot add to favorites.');
      // Optionally, prompt the user to log in or provide feedback
      return;
    }
    
    const storedUserData = localStorage.getItem('user');
    if (storedUserData === null) {
      console.error('User data not found in local storage.');
      return;
    }
    
    const userData = JSON.parse(storedUserData);
    
    this.fetchApiData.addFavoriteMovie(userData.Username, movie._id).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavMovies();
      console.log('Adding favorite movie:', userData.Username, movie._id);
      this.snackBar.open('Movie has been added to your favorites!', 'OK', {
        duration: 3000,
      });
    });
  }
  
  deleteFavMovies(movie: any): void {
    if (!this.userData || !this.userData.Username) {
      console.error('User data is not loaded. Cannot delete from favorites.');
      // Optionally, prompt the user to log in or provide feedback
      return;
    }
    
    const storedUserData = localStorage.getItem('user');
    if (storedUserData === null) {
      console.error('User data not found in local storage.');
      return;
    }
    
    const userData = JSON.parse(storedUserData);
    
    this.fetchApiData.deleteFavoriteMovie(userData.Username, movie._id).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavMovies();
      console.log('Deleting favorite movie:', userData.Username, movie._id);
      this.snackBar.open('Movie has been deleted from your favorites!', 'OK', {
        duration: 3000,
      });
    });
  }
}
