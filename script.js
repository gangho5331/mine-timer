

const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

const statusText = document.getElementById("status");

const finishEffect = document.getElementById("finishEffect");


/* =========================
   위 / 아래 버튼
========================= */

const hourUp = document.getElementById("hourUp");
const hourDown = document.getElementById("hourDown");

const minuteUp = document.getElementById("minuteUp");
const minuteDown = document.getElementById("minuteDown");

const secondUp = document.getElementById("secondUp");
const secondDown = document.getElementById("secondDown");


/* =========================
   타이머 변수
========================= */

let timer = null;

let totalSeconds = 0;

let savedSeconds = 0;

let running = false;


/* =========================
   숫자를 0~범위로 제한
========================= */

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}


/* =========================
   입력값 정리
========================= */

function cleanInputs() {

    let hours =
        clamp(
            Number(hoursInput.value) || 0,
            0,
            99
        );

    let minutes =
        clamp(
            Number(minutesInput.value) || 0,
            0,
            59
        );

    let seconds =
        clamp(
            Number(secondsInput.value) || 0,
            0,
            59
        );


    hoursInput.value =
        String(hours).padStart(2, "0");

    minutesInput.value =
        String(minutes).padStart(2, "0");

    secondsInput.value =
        String(seconds).padStart(2, "0");


    return {
        hours,
        minutes,
        seconds
    };

}


/* =========================
   입력된 시간을 초로 변환
========================= */

function getInputSeconds() {

    const time = cleanInputs();


    /*
        예:

        00 : 00 : 10
        = 10초

        00 : 10 : 00
        = 600초

        01 : 00 : 00
        = 3600초
    */

    return (
        time.hours * 60 * 60 +
        time.minutes * 60 +
        time.seconds
    );

}


/* =========================
   타이머 화면 표시
========================= */

function displayTime() {

    const hours =
        Math.floor(totalSeconds / 3600);


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    hoursInput.value =
        String(hours).padStart(2, "0");


    minutesInput.value =
        String(minutes).padStart(2, "0");


    secondsInput.value =
        String(seconds).padStart(2, "0");

}


/* =========================
   입력창 잠금
========================= */

function setInputsDisabled(disabled) {

    hoursInput.disabled = disabled;

    minutesInput.disabled = disabled;

    secondsInput.disabled = disabled;

    hourUp.disabled = disabled;

    hourDown.disabled = disabled;

    minuteUp.disabled = disabled;

    minuteDown.disabled = disabled;

    secondUp.disabled = disabled;

    secondDown.disabled = disabled;

}


/* =========================
   숫자 변경 함수
========================= */

function changeInput(input, amount, max) {

    if (running) {
        return;
    }


    let value =
        Number(input.value) || 0;


    value += amount;


    if (value > max) {
        value = 0;
    }


    if (value < 0) {
        value = max;
    }


    input.value =
        String(value).padStart(2, "0");


    finishEffect.classList.remove("show");

    statusText.textContent = "READY";

}


/* =========================
   시간 ▲ ▼
========================= */

hourUp.addEventListener("click", function () {

    changeInput(hoursInput, 1, 99);

});


hourDown.addEventListener("click", function () {

    changeInput(hoursInput, -1, 99);

});


minuteUp.addEventListener("click", function () {

    changeInput(minutesInput, 1, 59);

});


minuteDown.addEventListener("click", function () {

    changeInput(minutesInput, -1, 59);

});


secondUp.addEventListener("click", function () {

    changeInput(secondsInput, 1, 59);

});


secondDown.addEventListener("click", function () {

    changeInput(secondsInput, -1, 59);

});


/* =========================
   직접 숫자 입력
========================= */

function limitTwoDigits(input, max) {

    let value =
        input.value.replace(/\D/g, "");


    if (value.length > 2) {

        value =
            value.slice(0, 2);

    }


    let number =
        Number(value) || 0;


    number =
        clamp(number, 0, max);


    input.value =
        String(number).padStart(2, "0");

}


/* 시간 */

hoursInput.addEventListener("input", function () {

    limitTwoDigits(hoursInput, 99);

});


/* 분 */

minutesInput.addEventListener("input", function () {

    limitTwoDigits(minutesInput, 59);

});


/* 초 */

secondsInput.addEventListener("input", function () {

    limitTwoDigits(secondsInput, 59);

});


/* 입력을 바꾼 경우 */

[hoursInput, minutesInput, secondsInput]
.forEach(function (input) {

    input.addEventListener("change", function () {

        if (running) {
            return;
        }

        cleanInputs();

        totalSeconds = 0;

        savedSeconds = 0;

        statusText.textContent = "READY";

        finishEffect.classList.remove("show");

    });

});


/* =========================
   종료 효과음
========================= */

function playEndSound() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {
        return;
    }


    const audioContext =
        new AudioContext();


    /*
        게임 느낌의 짧은 효과음
    */

    const notes = [
        660,
        660,
        880,
        660,
        990
    ];


    notes.forEach(function (frequency, index) {

        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        oscillator.type = "square";

        oscillator.frequency.value =
            frequency;


        const startTime =
            audioContext.currentTime +
            index * 0.18;


        gain.gain.setValueAtTime(
            0.001,
            startTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.18,
            startTime + 0.02
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + 0.15
        );


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        oscillator.start(startTime);

        oscillator.stop(
            startTime + 0.16
        );

    });

}


/* =========================
   START
========================= */

startButton.addEventListener("click", function () {

    /*
        이미 실행 중이면 아무것도 하지 않음
    */

    if (timer !== null) {
        return;
    }


    /*
        처음 시작할 때
    */

    if (!running) {

        /*
            현재 입력된 값을
            정확하게 가져옴
        */

        if (totalSeconds === 0) {

            totalSeconds =
                getInputSeconds();

            savedSeconds =
                totalSeconds;

        }

    }


    /*
        시간이 0이면 실행하지 않음
    */

    if (totalSeconds <= 0) {

        statusText.textContent =
            "SET A TIME FIRST";

        return;

    }


    running = true;

    setInputsDisabled(true);

    statusText.textContent =
        "RUNNING...";


    /*
        1초마다 실행
    */

    timer = setInterval(function () {

        totalSeconds--;

        displayTime();


        /*
            00:00:00
        */

        if (totalSeconds <= 0) {

            clearInterval(timer);

            timer = null;

            running = false;

            totalSeconds = 0;

            displayTime();


            /*
                종료 효과
            */

            finishEffect.classList.add("show");


            /*
                효과음
            */

            playEndSound();


            /*
                상태
            */

            statusText.textContent =
                "⏰ TIME'S UP!";


            /*
                다시 설정 가능
            */

            setInputsDisabled(false);

        }

    }, 1000);

});


/* =========================
   PAUSE
========================= */

pauseButton.addEventListener("click", function () {

    if (timer === null) {
        return;
    }


    clearInterval(timer);

    timer = null;

    running = false;


    statusText.textContent =
        "PAUSED";

});


/* =========================
   RESET
========================= */

resetButton.addEventListener("click", function () {

    /*
        타이머 정지
    */

    clearInterval(timer);

    timer = null;

    running = false;


    /*
        종료 화면 제거
    */

    finishEffect.classList.remove("show");


    /*
        처음 설정했던 시간으로 복구
    */

    totalSeconds =
        savedSeconds;


    /*
        아직 시작한 적 없다면
        현재 입력값을 기준으로 저장
    */

    if (savedSeconds === 0) {

        totalSeconds =
            getInputSeconds();

        savedSeconds =
            totalSeconds;

    }


    displayTime();


    setInputsDisabled(false);


    statusText.textContent =
        "READY";

});