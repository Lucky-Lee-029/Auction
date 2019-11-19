var $ = jQuery.noConflict();
$(document).ready(() => {
    var interval = setInterval(() => {
            var timeArray = $(".time");
            for (let i = 0; i < timeArray.length; i++) {
                time = timeArray[i].innerText;
                time = time.split(":");
                var hour = parseInt(time[0]);
                var minute = parseInt(time[1]);
                var second = parseInt(time[2]);
                time = (hour * 60 + minute) * 60 + second - 1;
                if (time >= 0) {
                    var hour = parseInt(time / 3600);
                    time = time % 3600;
                    var minute = parseInt(time / 60);
                    var second = parseInt(time % 60);

                    timeArray[i].innerText = new Date(0, 0, 0, hour, minute, second).toLocaleTimeString();
                } else timeArray[i].innerText = "Time out!"
            }
        },
        1000);
    $(".carousel-control-next").click(() => $(".carousel").carousel("next"));
    $(".carousel-control-prev").click(() => $(".carousel").carousel("prev"));
});