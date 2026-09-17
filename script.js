/* ==================================================
   비밀번호
================================================== */

const PASSWORD = "2049";


const passwordScreen =
    document.getElementById("passwordScreen");

const passwordInput =
    document.getElementById("passwordInput");

const passwordButton =
    document.getElementById("passwordButton");


/* 비밀번호 확인 */

function checkPassword() {

    if (passwordInput.value === PASSWORD) {

        passwordScreen.style.display = "none";

        passwordInput.value = "";

    } else {

        passwordInput.classList.remove("wrong");

        /*
            애니메이션을 다시 실행하기 위해
            잠깐 화면을 다시 계산
        */

        void passwordInput.offsetWidth;

        passwordInput.classList.add("wrong");

        passwordInput.value = "";

        passwordInput.focus();
    }
}


/* ENTER 버튼 */

passwordButton.addEventListener(
    "click",
    checkPassword
);


/* 키보드 Enter */

passwordInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            checkPassword();

        }

    }
);


/* ==================================================
   HTML 요소 가져오기
================================================== */

const hoursInput =
    document.getElementById("hours");

const minutesInput =
    document.getElementById("minutes");

const secondsInput =
    document.getElementById("seconds");


const startButton =
    document.getElementById("start");

const pauseButton =
    document.getElementById("pause");

const resetButton =
    document.getElementById("reset");


const statusText =
    document.getElementById("status");


const finishEffect =
    document.getElementById("finishEffect");


/* ==================================================
   위 / 아래 버튼
================================================== */

const hourUp =
    document.getElementById("hourUp");

const hourDown =
    document.getElementById("hourDown");


const minuteUp =
    document.getElementById("minuteUp");

const minuteDown =
    document.getElementById("minuteDown");


const secondUp =
    document.getElementById("secondUp");

const secondDown =
    document.getElementById("secondDown");


/* ==================================================
   타이머 변수
================================================== */

let timer = null;

let totalSeconds = 0;

let savedSeconds = 0;

let running = false;


/* ==================================================
   알람 변수
================================================== */

let alarmTimer = null;

let audioContext = null;


/* ==================================================
   숫자를 범위 안으로 제한
================================================== */

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );
}


/* ==================================================
   입력값 정리
================================================== */

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


/* ==================================================
   입력한 시간을 초로 변환
================================================== */

function getInputSeconds() {

    const time =
        cleanInputs();


    /*
        00 : 00 : 10
        → 10초

        00 : 10 : 00
        → 600초

        01 : 00 : 00
        → 3600초
    */

    return (
        time.hours * 60 * 60 +
        time.minutes * 60 +
        time.seconds
    );
}


/* ==================================================
   타이머 화면 표시
================================================== */

function displayTime() {

    const hours =
        Math.floor(
            totalSeconds / 3600
        );


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


/* ==================================================
   입력창 잠금
================================================== */

function setInputsDisabled(disabled) {

    hoursInput.disabled =
        disabled;

    minutesInput.disabled =
        disabled;

    secondsInput.disabled =
        disabled;


    hourUp.disabled =
        disabled;

    hourDown.disabled =
        disabled;


    minuteUp.disabled =
        disabled;

    minuteDown.disabled =
        disabled;


    secondUp.disabled =
        disabled;

    secondDown.disabled =
        disabled;
}


/* ==================================================
   시간 ▲ ▼ 변경
================================================== */

function changeInput(
    input,
    amount,
    max
) {

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


    finishEffect.classList.remove(
        "show"
    );


    statusText.textContent =
        "READY";
}


/* ==================================================
   시간 ▲ ▼ 이벤트
================================================== */

hourUp.addEventListener(
    "click",
    function () {

        changeInput(
            hoursInput,
            1,
            99
        );

    }
);


hourDown.addEventListener(
    "click",
    function () {

        changeInput(
            hoursInput,
            -1,
            99
        );

    }
);


minuteUp.addEventListener(
    "click",
    function () {

        changeInput(
            minutesInput,
            1,
            59
        );

    }
);


minuteDown.addEventListener(
    "click",
    function () {

        changeInput(
            minutesInput,
            -1,
            59
        );

    }
);


secondUp.addEventListener(
    "click",
    function () {

        changeInput(
            secondsInput,
            1,
            59
        );

    }
);


secondDown.addEventListener(
    "click",
    function () {

        changeInput(
            secondsInput,
            -1,
            59
        );

    }
);


/* ==================================================
   직접 숫자 입력
================================================== */

function limitTwoDigits(
    input,
    max
) {

    let value =
        input.value.replace(
            /\D/g,
            ""
        );


    if (value.length > 2) {

        value =
            value.slice(0, 2);
    }


    let number =
        Number(value) || 0;


    number =
        clamp(
            number,
            0,
            max
        );


    input.value =
        String(number).padStart(2, "0");
}


hoursInput.addEventListener(
    "input",
    function () {

        limitTwoDigits(
            hoursInput,
            99
        );

    }
);


minutesInput.addEventListener(
    "input",
    function () {

        limitTwoDigits(
            minutesInput,
            59
        );

    }
);


secondsInput.addEventListener(
    "input",
    function () {

        limitTwoDigits(
            secondsInput,
            59
        );

    }
);


/* ==================================================
   입력값 변경
================================================== */

[
    hoursInput,
    minutesInput,
    secondsInput
].forEach(
    function (input) {

        input.addEventListener(
            "change",
            function () {

                if (running) {

                    return;
                }


                cleanInputs();


                totalSeconds = 0;

                savedSeconds = 0;


                statusText.textContent =
                    "READY";


                finishEffect.classList.remove(
                    "show"
                );

            }
        );

    }
);


/* ==================================================
   종료 효과음
================================================== */

function playEndSound() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {

        return;
    }


    /*
        AudioContext를 한 번만 생성
    */

    if (!audioContext) {

        audioContext =
            new AudioContext();
    }


    /*
        브라우저가 AudioContext를
        일시정지한 경우 다시 시작
    */

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();
    }


    /*
        마인크래프트 느낌의
        짧은 알림음
    */

    const notes = [

        660,
        660,
        880,
        660,
        990

    ];


    notes.forEach(
        function (
            frequency,
            index
        ) {

            const oscillator =
                audioContext.createOscillator();


            const gain =
                audioContext.createGain();


            oscillator.type =
                "square";


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


            oscillator.start(
                startTime
            );


            oscillator.stop(
                startTime + 0.16
            );

        }
    );
}


/* ==================================================
   알람 무한 반복 시작
================================================== */

function startAlarm() {

    /*
        이미 알람이 실행 중이면
        중복으로 실행하지 않음
    */

    if (alarmTimer !== null) {

        return;
    }


    /*
        첫 번째 알람 즉시 재생
    */

    playEndSound();


    /*
        1초마다 반복
    */

    alarmTimer =
        setInterval(
            function () {

                playEndSound();

            },
            1000
        );
}


/* ==================================================
   알람 정지
================================================== */

function stopAlarm() {

    if (alarmTimer !== null) {

        clearInterval(
            alarmTimer
        );

        alarmTimer = null;
    }
}


/* ==================================================
   START
================================================== */

startButton.addEventListener(
    "click",
    function () {


        /*
            이미 실행 중이면
            중복 타이머 방지
        */

        if (timer !== null) {

            return;
        }


        /*
            처음 START를 누른 경우
        */

        if (!running) {


            /*
                타이머가 0이면
                입력값을 가져옴
            */

            if (totalSeconds === 0) {

                totalSeconds =
                    getInputSeconds();


                savedSeconds =
                    totalSeconds;
            }

        }


        /*
            시간이 0이면 시작하지 않음
        */

        if (totalSeconds <= 0) {

            statusText.textContent =
                "SET A TIME FIRST";

            return;
        }


        /*
            알람이 혹시 켜져 있다면
            시작할 때 정지
        */

        stopAlarm();


        finishEffect.classList.remove(
            "show"
        );


        running = true;


        setInputsDisabled(
            true
        );


        statusText.textContent =
            "RUNNING...";


        /*
            타이머 시작
        */

        timer =
            setInterval(
                function () {


                    totalSeconds--;


                    displayTime();


                    /*
                        00:00:00 도달
                    */

                    if (
                        totalSeconds <= 0
                    ) {


                        clearInterval(
                            timer
                        );


                        timer = null;


                        running = false;


                        totalSeconds = 0;


                        displayTime();


                        /*
                            화면 종료 효과
                        */

                        finishEffect.classList.add(
                            "show"
                        );


                        /*
                            알람 무한 반복
                        */

                        startAlarm();


                        /*
                            상태
                        */

                        statusText.textContent =
                            "⏰ TIME'S UP!";


                        /*
                            다시 시간 설정 가능
                        */

                        setInputsDisabled(
                            false
                        );

                    }


                },
                1000
            );

    }
);


/* ==================================================
   PAUSE
================================================== */

pauseButton.addEventListener(
    "click",
    function () {


        /*
            실행 중이 아니면
            아무것도 하지 않음
        */

        if (timer === null) {

            return;
        }


        clearInterval(
            timer
        );


        timer = null;


        running = false;


        statusText.textContent =
            "PAUSED";

    }
);


/* ==================================================
   RESET
================================================== */

resetButton.addEventListener(
    "click",
    function () {


        /*
            가장 먼저 알람 정지
        */

        stopAlarm();


        /*
            타이머 정지
        */

        clearInterval(
            timer
        );


        timer = null;


        running = false;


        /*
            종료 화면 제거
        */

        finishEffect.classList.remove(
            "show"
        );


        /*
            저장해둔 시간으로 복구
        */

        totalSeconds =
            savedSeconds;


        /*
            저장된 시간이 없다면
            현재 입력값을 사용
        */

        if (savedSeconds === 0) {


            totalSeconds =
                getInputSeconds();


            savedSeconds =
                totalSeconds;

        }


        displayTime();


        /*
            입력 가능하게 변경
        */

        setInputsDisabled(
            false
        );


        statusText.textContent =
            "READY";

    }
);
