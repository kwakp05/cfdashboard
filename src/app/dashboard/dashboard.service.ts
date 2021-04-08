import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getUserContestHistory(userHandle: string, pageNum: number): Observable<any> {
    /**
     *  {
     *    numPages: 2,
     *    result: [
     *      {
     *        contestId: 1,
     *        contestName: "Codeforces Beta Round #1",
     *        expectedRank: 1,
     *        actualRank: 1,
     *        oldRating: 2000,
     *        newRating: 2000,
     *        performance: 2000
     *      }
     *    ]
     *  }
     */
    return this.http.get(`${environment.apiUrl}/dashboard`, { params: { handle: userHandle, page: pageNum.toString() } })
      .pipe( catchError(this.handleError) );
  }

  private handleError(error: HttpErrorResponse) {
    // Source: https://angular.io/guide/http#handling-request-errors

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  constructor(
    private http: HttpClient
  ) { }
}