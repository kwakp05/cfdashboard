import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { RatingService } from '../rating.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userHandle: string;
  @Output() contestRequest = new EventEmitter<number>();
  contests: any;
  showError: boolean;

  constructor(
    private dashboardService: DashboardService,
    public ratingService: RatingService,
    private route: ActivatedRoute
  ) {
    this.userHandle = "";
    this.contests = [];
    this.showError = false;
  }

  addSignNumber(inputNum: number): string {
    if (inputNum >= 0)
      return "+" + inputNum;
    return "" + inputNum;
  }

  viewContestDetails(contestId: number): void {
    this.contestRequest.emit(contestId);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params["handle"] != this.userHandle) {
          this.userHandle = params["handle"];
          this.contests = [];

          const observer = {
            next: (data: any) => {
              this.showError = false;
              this.contests = data.reverse();
            },
            error: (err: any) => {
              this.showError = true;
              this.contests = [];
            }
          }
          this.dashboardService.getUserContestHistory(this.userHandle).subscribe(observer);
      }
    });
  }
}
