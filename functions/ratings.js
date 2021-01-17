exports.fromRatingGetTitle = function(rating) {
    // Apparently, negative rating is a thing
    // https://codeforces.com/profile/worse
    if (rating < 0)
        return "newbie";

    for (cutoff of this.ratingCutoffs) {
        const cutoff = this.ratingCutoffs[i];
        if (rating >= cutoff.from && rating <= cutoff.to)
            return cutoff.title;
    }
    return "invalid";
}

exports.fromRatingGetIndex = function(rating) {
    if (rating < 0)
        return 0;
        
    for (let i = 0; i < this.ratingCutoffs.length; i++) {
        const cutoff = this.ratingCutoffs[i];
        if (rating >= cutoff.from && rating <= cutoff.to) 
            return i;
    }
    return -1;
}

exports.ratingCutoffs = [
    { title: "newbie", from: 0, to: 1199},
    { title: "pupil", from: 1200, to: 1399},
    { title: "specialist", from: 1400, to: 1599},
    { title: "expert", from: 1600, to: 1899},
    { title: "candidate master", from: 1900, to: 2099},
    { title: "master", from: 2100, to: 2299},
    { title: "international master", from: 2300, to: 2399},
    { title: "grandmaster", from: 2400, to: 2599},
    { title: "international grandmaster", from: 2600, to: 2999},
    { title: "legendary grandmaster", from: 3000, to: 5000}
];