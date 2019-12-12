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

    var current = -1;
    var listLevel1Menu = document.querySelectorAll('.menu-level-1 li');
    var listLevel2Menu = document.querySelectorAll('.menu-level-2 > div');
    for (let i = 0; i < listLevel1Menu.length; i++) {
        listLevel1Menu[i].addEventListener('mouseover', () => {
            if (current != -1) {
                listLevel2Menu[current].style.display = 'none';
                listLevel2Menu[i].style.display = 'block';
            }
            current = i;
        })
    }
});