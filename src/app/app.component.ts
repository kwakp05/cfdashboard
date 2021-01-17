import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  userHandle: string = '';
  contestId: string = '';
  categoryUsers: boolean = true;
  categoryContests: boolean = false;

  switchToUsers(): void {
    this.categoryUsers = true;
    this.categoryContests = false;
  }

  switchToContests(): void {
    this.categoryUsers = false;
    this.categoryContests = true;
  }
}
