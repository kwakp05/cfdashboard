import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContestDetailsService {

  constructor(
    private http: HttpClient
  ) { }

  getContestDetails(contestId: number): Observable<any> {
    /**
     *  {
     *    type: "CF" | "ICPC",
     *    participation: [
     *      {
     *        rank: "legendary grandmaster",
     *        count: 30
     *      },
     *      ...
     *      {
     *        rank: "newbie",
     *        count: 420     
     *      }
     *    ],
     *    problems: [
     *      {
     *        index: "A",
     *        name: "Matching Names",
     *        solves: [
     *          {
     *            rank: "legendary grandmaster",
     *            count: 20
     *          },
     *          ...
     *          {
     *            rank: "newbie",
     *            count: 69
     *          }
     *        ]
     *      },
     *      ...  
     *    ],
     *    benchmarks: [
     *      {
     *        rank: "legendary grandmaster",
     *        models: [
     *          {
     *            handle: "rng_58",
     *            points: 7974,
     *            penalty: 0,
     *            rank: 1,
     *            successfulHackCount: 1,
     *            unsuccessfulHackCount: 0,
     *            problemResults: [
     *              {
     *                points: 1330,
     *                rejectedAttemptCount: 0,
     *                bestSubmissionTimeSeconds: 3624
     *              },
     *              ...
     *            ]
     *          },
     *          ...
     *        ]
     *      },
     *      ...
     *    ]
     *  }
     */
    return this.http.get(`${environment.apiUrl}/contest`, { params: { contestId: contestId.toString() } })
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
}