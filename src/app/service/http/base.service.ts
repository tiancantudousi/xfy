import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {Jsonp} from "@angular/http";    //注入Jsonp模块
import storage from '../storage';
import 'rxjs/Rx';
// import 'rxjs/add/operator/map';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};
const httpOptionjson = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private posturl='/bbm/ylzlzz/soa';
  private printurl='/bbm/ylzlzz/servlets/dyServlet';
  private testinfourl='/api/print';

  // private printurl='/bbm/DyServlet';

  constructor(
    public http: HttpClient,
    public jsonp:Jsonp
  ) {

   }
   testinfo(data): Observable<any> {
    return this.http.post<any>(this.testinfourl, JSON.stringify(data),httpOptionjson).pipe(
      catchError(this.handleError<any>('error'))
    );
  }

  postInfo(data): Observable<any> {
    return this.http.post<any>(this.posturl, JSON.stringify(data)).pipe(
      catchError(this.handleError<any>('error'))
    );
  }

  printInfo(data): Observable<any> {
    return this.http.post<any>(this.printurl, data,httpOptions).pipe(
      catchError(this.handleError<any>('error'))
    );
    // return this.http.post<any>(this.posturl, JSON.stringify(data)).pipe(
    //   catchError(this.handleError<any>('error'))
    // );
  }
  printInfotwo(): Observable<any> {
    return this.http.get<any>(this.printurl).pipe(
      catchError(this.handleError<any>('error'))
    );}
  printInfothree(): Observable<any> {
        let myHeaders:Headers = new Headers();
        return this.http.get('/api/products')
  }
//     // return this.http.post<any>(this.posturl, JSON.stringify(data)).pipe(
//     //     catchError(this.handleError<any>('error'))
//     //   );
   
//   }

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
