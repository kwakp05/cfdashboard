import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  readonly ratingCutoffs: any = [
    { title: "newbie", from: 0, to: 1199, gridColor: "#ccc", userColor: "gray", class: "rating-gray", abbreviation: "newbie"},
    { title: "pupil", from: 1200, to: 1399, gridColor: "#7f7", userColor: "green", class: "rating-green", abbreviation: "pupil"},
    { title: "specialist", from: 1400, to: 1599, gridColor: "#77ddbb", userColor: "#03A89E", class: "rating-cyan", abbreviation: "specialist"},
    { title: "expert", from: 1600, to: 1899, gridColor: "#aaf", userColor: "blue", class: "rating-blue", abbreviation: "expert"},
    { title: "candidate master", from: 1900, to: 2099, gridColor: "#f8f", userColor: "#a0a", class: "rating-purple", abbreviation: "CM"},
    { title: "master", from: 2100, to: 2299, gridColor: "#ffcc88", userColor: "#FF8C00", class: "rating-orange", abbreviation: "master"},
    { title: "international master", from: 2300, to: 2399, gridColor: "#ffbb55", userColor: "#FF8C00", class: "rating-orange", abbreviation: "IM"},
    { title: "grandmaster", from: 2400, to: 2599, gridColor: "#f77", userColor: "red", class: "rating-red", abbreviation: "GM"},
    { title: "international grandmaster", from: 2600, to: 2999, gridColor: "#f33", userColor: "red", class: "rating-red", abbreviation: "IGM"},
    { title: "legendary grandmaster", from: 3000, to: 5000, gridColor: "#a00", userColor: "red", class: "rating-red", abbreviation: "LGM"}
  ];

  constructor() { }

  fromRatingGetCSSClass(rating: number): string {
    for (let cutoff of this.ratingCutoffs) {
      if (rating >= cutoff.from && rating <= cutoff.to)
        return cutoff.class;
    }
    return "";
  }

  fromTitleGetCSSClass(title: string): string {
    for (let cutoff of this.ratingCutoffs) {
      if (title == cutoff.title)
        return cutoff.class;
    }
    return "";
  }

  fromTitleGetUserColor(title: string): string {
    for (let cutoff of this.ratingCutoffs) {
      if (title == cutoff.title)
        return cutoff.userColor;
    }
    return "";
  }

  fromTitleGetGridColor(title: string): string {
    for (let cutoff of this.ratingCutoffs) {
      if (title == cutoff.title)
        return cutoff.gridColor;
    }
    return "";
  }

  fromTitleAbbreviation(title: string): string {
    for (let cutoff of this.ratingCutoffs) {
      if (title == cutoff.title)
        return cutoff.abbreviation;
    }
    return "";
  }
}
