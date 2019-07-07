import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import storage from '../storage';

@Injectable({
  providedIn: 'root'
})
export class ToberecoverService {
  private baseUrl = '/bbm/ylzlzz/soa';
  public getrecoverdata;
  constructor(
    public http: HttpClient
  ) { }

  toberecoverdata(data): Observable<any> {
    return this.http.post<any>(this.baseUrl, JSON.stringify(data)).pipe(
      catchError(this.handleError<any>('error'))
    );
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
