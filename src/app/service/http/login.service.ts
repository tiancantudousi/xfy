import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({ providedIn: 'root' })
export class LoginService {
  islogin:boolean=false;
  redirectUrl: string;
  private heroesUrl = '/bbm/ylzlzz/soa';  // URL to web api

 
  constructor(
    private http: HttpClient
  ) { }
 
  /** GET heroes from the server */
  userlogin (hero): Observable<any> {
    return this.http.post<any>(this.heroesUrl, hero,httpOptions).pipe(
      // tap((hero: Hero) => console.log(`added hero w/ id=${hero.username}`)),
      catchError(this.handleError<any>('addHero'))
    );
  }

  getHouse(params): Observable<any> {
    return this.http.post<any>(this.heroesUrl, params).pipe(
      // tap((hero: Hero) => console.log(`added hero w/ id=${hero.username}`)),
      catchError(this.handleError<any>('addHero'))
    );
  }
  getlogin(){
    if(sessionStorage.getItem('islogin')){
      this.islogin=true;
    }
    else{
      this.islogin=false;
    }
    return this.islogin;
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
