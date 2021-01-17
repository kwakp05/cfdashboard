import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RatingService } from '../rating.service';
import { ContestDetailsService } from './contest-details.service';

@Component({
  selector: 'app-contest-details',
  templateUrl: './contest-details.component.html',
  styleUrls: ['./contest-details.component.css']
})
export class ContestDetailsComponent implements OnInit {
  contestId: number;
  participation: any;
  totalParticipation: number;
  problems: any;
  benchmarks: any;
  contestType: string;
  contestName: string;
  showError: boolean;

  participationDataLayout: any;
  problemsDataLayout: any;
  solvesDataLayout: any;

  constructor(
    private contestDetailsService: ContestDetailsService,
    public ratingService: RatingService,
    private route: ActivatedRoute
  ) {
    this.contestId = 0;
    this.participation = [];
    this.totalParticipation = 0;
    this.problems = [];
    this.benchmarks = [];
    this.contestType = "";
    this.contestName = "";
    this.showError = false;
  }

  renderGraphs(): void {
    const filteredParticipation = this.participation.filter((x: any) => x.count);
    this.participationDataLayout = {
      data: [{
        values: filteredParticipation.map((x: any) => x.count),
        labels: filteredParticipation.map((x: any) => x.rank),
        type: "pie",
        hole: .5,
        sort: false,
        direction: "clockwise",
        marker: {
          colors: filteredParticipation.map((x: any) => this.ratingService.fromTitleGetGridColor(x.rank))
        }
      }],
      layout: { width: 500, height: 400 }
    };

    this.solvesDataLayout = {
      data: [{
        x: this.problems.map((x: any) => x.index),
        y: this.problems.map((x: any) => x.solves.reduce((acc: number, cur: any) => acc + cur.count, 0)),
        type: "bar"
      }],
      layout: {
        width: 500,
        yaxis: {
          title: {
            text: "solves"
          }
        }
      }
    };

    let problemsSolveProportions = this.problems.map((problem: any) => {
      return problem.solves.map((solveStat: any, index: number) => solveStat.count / this.participation[index].count);
    });
    this.problemsDataLayout = problemsSolveProportions.map((prop: any, index: number) => ({
      data: [{
        x: this.participation.map((x: any) => this.ratingService.fromTitleAbbreviation(x.rank)),
        y: prop,
        type: "bar",
        marker: {
          color: this.participation.map((x: any) => this.ratingService.fromTitleGetUserColor(x.rank))
        }
      }],
      layout: {
        width: 500,
        title: {
          text: `${this.problems[index].index}: ${this.problems[index].name}`
        },
        yaxis: {
          title: {
            text: "percent solved"
          },
          range: [0, 1]
        }
      }
    }));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params["contestId"] != this.contestId) {
        this.contestId = params["contestId"];

        const observer = {
          next: (resp: any) => {
            this.showError = false;
            this.participation = resp["participation"];
            this.totalParticipation = this.participation.reduce((acc: number, rankGroup: any) => acc + rankGroup.count, 0);
            this.problems = resp["problems"];
            this.benchmarks = resp["benchmarks"].reverse();
            this.contestType = resp["type"];
            this.contestName = resp["name"];
  
            this.renderGraphs();
          },
          error: (err: any) => {
            this.showError = true;
            this.participationDataLayout = undefined;
            this.problemsDataLayout = undefined;
            this.solvesDataLayout = undefined;
          }
        }
        this.contestDetailsService.getContestDetails(this.contestId).subscribe(observer);
      }
    });
  }
}
