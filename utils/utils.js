const moment = require('moment');
module.exports = {
    formatDuration: (duration) => {
        let now = moment()
        duration = moment(duration, "YYYY-MM-DD-HH-mm-ss");
        let diffInSeconds = duration.diff(now, "seconds");
        if (diffInSeconds <= 0) return "Time out"
        else {
            let time = moment(diffInSeconds * 1000).utc();
            let remaining = time.format("HH:mm:ss");
            let day = time.date() - 1;
            if (day < 3) {
                if (day > 0) {
                    if (day > 1)
                        remaining = day + "days " + remaining;
                    else
                        remaining = "1 day " + remaining;
                }
                return "End in: " + remaining;
            } else {
                return "End at: " + duration.format("HH:mm:ss DD/MM/YYYY");
            }
        }
    },
}