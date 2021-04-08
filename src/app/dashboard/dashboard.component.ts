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
  numPages: number;
  curPage: number;
  showError: boolean;

  constructor(
    private dashboardService: DashboardService,
    public ratingService: RatingService,
    private route: ActivatedRoute
  ) {
    this.userHandle = "";
    this.contests = [];
    this.numPages = 0;
    this.curPage = 0;
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
      if (params["handle"] != this.userHandle || params["page"] != this.curPage) {
          this.userHandle = params["handle"];
          this.curPage = Number(params["page"]) || 1;
          this.contests = [];

          const observer = {
            next: (data: any) => {
              this.showError = false;
              this.contests = data.result;
              this.numPages = Number(data.numPages);
            },
            error: (err: any) => {
              this.showError = true;
              this.contests = [];
              this.numPages = 0;
            }
          }
          this.dashboardService.getUserContestHistory(this.userHandle, this.curPage).subscribe(observer);
      }
    });
  }
}
