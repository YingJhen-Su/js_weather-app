// variable for draggable slider
let isDragging = false;
let hasMove = false;
let prevX;
let scrollLeft;

// 目前呈現預報詳細資料的index
let prevIndex = 0;

// hourly forecast data from api
let forecastData = {};

// drag start
const dragStart = (event) => {
    isDragging = true;
    const slider = event.currentTarget;
    slider.classList.add("grabbing");

    prevX = event.pageX || event.touches[0].pageX;
    scrollLeft = slider.scrollLeft;
};

// drag end with click
const dragEnd = (event) => {
    isDragging = false;
    const slider = event.currentTarget;
    slider.classList.remove("grabbing");
    event.preventDefault();

    // click
    if (!hasMove) {
        const target = event.target;
        handleForecastClick(slider, target);
    }

    hasMove = false;
};

// handle drag move
const dragMove = (event) => {
    if (!isDragging) return;
    // if hasmove not click
    hasMove = true;
    event.preventDefault();

    const currentX = event.pageX || event.touches[0].pageX;
    const diff = currentX - prevX;
    event.currentTarget.scrollLeft = scrollLeft - diff;
};

// 處理預報列表按鈕點擊
const handleForecastClick = (slider, target) => {
    const allButtons = slider.querySelectorAll("button");

    let currentIndex = prevIndex;
    allButtons.forEach((btn, index) => {
        if (btn.contains(target) && index !== prevIndex) {
            currentIndex = index;

            // update forecast
            updateWeatherForecast(btn.dataset.index);
        }
    });

    if (currentIndex !== prevIndex) {
        allButtons.forEach((btn) => {
            btn.classList.remove("clicked");
        });
        allButtons[currentIndex].classList.add("clicked");
        prevIndex = currentIndex;
    }
};

// 用鍵盤tab在button間移動並以enter執行click
const handleKeyDown = (event) => {
    if (event.target.tagName !== "BUTTON") return;

    // click
    if (event.code === "Enter") {
        const slider = event.currentTarget;
        const target = event.target;
        handleForecastClick(slider, target);
    }
};

// create element with class name
const createElem = (tag, className = null) => {
    const elem = document.createElement(tag);
    if (className) {
        elem.classList.add(className);
    }

    return elem;
};

// 載入city列表
export const loadCityOption = (cityData) => {
    // append each city
    const selectOption = createElem("div", "selectBox__option");
    cityData.forEach((data) => {
        const btn = createElem("button");
        btn.innerHTML = data.city;
        selectOption.appendChild(btn);
    });

    // append container
    document.getElementById("selectBox").appendChild(selectOption);

    return selectOption;
};

// 處理觀測資料
export const updateWeatherObserve = (result) => {
    let observeData;
    let { data, error } = result;

    // handle error
    if (error) {
        weatherObserveError(error);
        return;
    }

    // check data
    if (data?.records?.Station && data.records.Station.length > 0) {
        const weatherData = data.records.Station[0].WeatherElement;

        if (
            weatherData &&
            weatherData.AirTemperature !== "x" &&
            weatherData.AirTemperature !== -99 &&
            weatherData.Weather !== "x" &&
            weatherData.Weather !== "-99"
        ) {
            observeData = `${Math.round(weatherData.AirTemperature)}°C ‧ ${
                weatherData.Weather
            }`;
        } else {
            error = "觀測資料異常或缺值";
        }
    } else {
        error = "觀測資料異常或缺值";
    }

    if (error) {
        weatherObserveError(error);
        return;
    }

    weatherObserveDisplay(observeData);
};

// 觀測資料異常處理
const weatherObserveError = (error) => {
    const weatherTemp = document.getElementById("weatherObserve__temp");
    const informBtn = weatherTemp.nextElementSibling;

    weatherTemp.innerHTML = error;
    informBtn.classList.add("none");
};

// 更新觀測資料
const weatherObserveDisplay = (data) => {
    const weatherTemp = document.getElementById("weatherObserve__temp");
    const informBtn = weatherTemp.nextElementSibling;

    weatherTemp.innerHTML = data;
    if (informBtn.classList.contains("none")) {
        informBtn.classList.remove("none");
    }
};

// 處理預報資料
export const updateHourlyForecast = (result) => {
    let { data, error } = result;

    // remove dom
    const hourlyForecast = document.getElementById("hourlyForecast");
    deletehourlyForecast(hourlyForecast);

    // handle error
    if (error) {
        hourlyForecastError(error);
        return;
    }

    // if no data
    if (
        !data?.records?.locations[0]?.location ||
        data.records.locations[0].location.length == 0
    ) {
        error = "預報資料異常或缺值，請稍後再試!";
        hourlyForecastError(error);
        return;
    }

    // save forecast data
    forecastData = data.records.locations[0].location[0].weatherElement;

    // get display data & append
    const buttonDiv = getHourlyForecastDisplay();
    hourlyForecast.appendChild(buttonDiv);

    // add event listener
    handleListener(buttonDiv);
};

// remove dom
const deletehourlyForecast = (hourlyForecast) => {
    if (hourlyForecast.lastElementChild) {
        const prevButtonDiv = hourlyForecast.lastElementChild;

        prevButtonDiv.removeEventListener("mousedown", dragStart);
        prevButtonDiv.removeEventListener("touchstart", dragStart);
        prevButtonDiv.removeEventListener("mousemove", dragMove);
        prevButtonDiv.removeEventListener("touchmove", dragMove);
        prevButtonDiv.removeEventListener("mouseup", dragEnd);
        prevButtonDiv.removeEventListener("touchend", dragEnd);
        prevButtonDiv.removeEventListener("mouseleave", dragEnd);
        prevButtonDiv.removeEventListener("keydown", handleKeyDown);

        hourlyForecast.removeChild(prevButtonDiv);
    }
};

// 處理預報呈現資料
const getHourlyForecastDisplay = () => {
    const buttonDiv = createElem("div", "hourlyForecast__buttons");
    const now = new Date();

    let buttonCount = 0;
    for (let i = 0; i < forecastData[1].time.length; i++) {
        // 只呈現9筆 當下+未來24小時
        if (buttonCount >= 9) break;

        // 過去資料跳過
        const endTime = new Date(forecastData[1].time[i].endTime);
        if (endTime.getTime() < now.getTime()) {
            continue;
        }

        // time
        const startTime = new Date(forecastData[1].time[i].startTime);
        const timeP = createElem("p");
        timeP.innerHTML = getSimpleTime(startTime);

        // icon
        const icon = getIconDisplay(
            Number(forecastData[1].time[i].elementValue[1].value),
            startTime
        );

        // temp
        const tempP = createElem("p");
        tempP.innerHTML = `${Math.round(
            forecastData[3].time[i].elementValue[0].value
        )}°C`;

        // create button
        const btn = createElem("button");
        btn.dataset.index = i;
        btn.append(timeP, icon, tempP);

        // 預設顯示第一筆
        if (buttonCount === 0) {
            btn.classList.add("clicked");
            updateWeatherForecast(i);
        }

        buttonCount++;
        buttonDiv.appendChild(btn);
    }

    return buttonDiv;
};

// add listener
const handleListener = (buttonDiv) => {
    buttonDiv.addEventListener("mousedown", dragStart);
    buttonDiv.addEventListener("touchstart", dragStart);
    buttonDiv.addEventListener("mousemove", dragMove);
    buttonDiv.addEventListener("touchmove", dragMove);
    buttonDiv.addEventListener("mouseup", dragEnd);
    buttonDiv.addEventListener("touchend", dragEnd);
    buttonDiv.addEventListener("mouseleave", dragEnd);
    buttonDiv.addEventListener("keydown", handleKeyDown);
};

// 處理氣象icon
const getIconDisplay = (code, time) => {
    const isNight = time.getHours() >= 17;
    const icon = createElem("i");

    if ((code >= 2 && code <= 3) || (code >= 24 && code <= 25)) {
        // 多雲時晴
        if (isNight) {
            icon.classList.add("bi", "bi-cloud-moon");
        } else {
            icon.classList.add("bi", "bi-cloud-sun");
        }
    } else if ((code >= 4 && code <= 7) || (code >= 26 && code <= 28)) {
        // 多雲時陰
        icon.classList.add("bi", "bi-clouds");
    } else if (
        (code >= 8 && code <= 14) ||
        (code >= 19 && code <= 20) ||
        (code >= 29 && code <= 32) ||
        (code >= 38 && code <= 40)
    ) {
        // 雨天
        icon.classList.add("bi", "bi-cloud-drizzle");
    } else if (
        (code >= 15 && code <= 18) ||
        (code >= 21 && code <= 22) ||
        (code >= 33 && code <= 36) ||
        code == 41
    ) {
        // 多雲雷陣雨
        icon.classList.add("bi", "bi-cloud-lightning-rain");
    } else if (code == 23 || code == 37) {
        // 陰有雨或雪
        icon.classList.add("bi", "bi-cloud-sleet");
    } else if (code == 42) {
        // 下雪
        icon.classList.add("bi", "bi-cloud-snow");
    } else {
        // 晴天 或任何未在列表的code
        if (isNight) {
            icon.classList.add("bi", "bi-moon");
        } else {
            icon.classList.add("bi", "bi-sun");
        }
    }

    return icon;
};

// 預報資料異常處理
const hourlyForecastError = (error) => {
    // remove dom
    const weatherForecast = document.getElementById("weatherForecast");
    deleteContent(weatherForecast);

    // create error element
    const forecastContent = createElem("div", "weatherForecast__content");
    const errorP = createElem("p");
    errorP.innerHTML = error;

    // append
    forecastContent.appendChild(errorP);
    weatherForecast.appendChild(forecastContent);
};

// 處理預報詳細呈現區塊
const updateWeatherForecast = (index) => {
    // remove dom
    const weatherForecast = document.getElementById("weatherForecast");
    deleteContent(weatherForecast);

    // get weatherForecast__content
    const forecastContent = getWeatherForecastDisplay(index);

    // weatherForecast append
    weatherForecast.appendChild(forecastContent);
};

// remove dom
const deleteContent = (container) => {
    let child = container.lastElementChild;
    while (child) {
        container.removeChild(child);
        child = container.lastElementChild;
    }
};

// 取得預報詳細呈現資料
const getWeatherForecastDisplay = (index) => {
    // title time
    const title = createElem("h3");
    const startTime = new Date(forecastData[1].time[index].startTime);
    title.innerHTML = getTitleTime(
        startTime,
        new Date(forecastData[1].time[index].endTime)
    );

    // weatherForecast__box--temp
    const icon = getIconDisplay(
        Number(forecastData[1].time[index].elementValue[1].value),
        startTime
    );
    const temp = createElem("p");
    temp.innerHTML = `${Math.round(
        forecastData[3].time[index].elementValue[0].value
    )}°C`;
    const tempBox = createElem("div", "weatherForecast__box--temp");
    tempBox.append(icon, temp);

    // weatherForecast__box--other
    const windIcon = createElem("i");
    windIcon.classList.add("bi", "bi-wind");
    const windText = createElem("p");
    windText.innerHTML = `${forecastData[8].time[index].elementValue[0].value} 公尺/秒`;
    const waterIcon = createElem("i");
    waterIcon.classList.add("bi", "bi-water");
    const humidity = createElem("p");
    humidity.innerHTML = `${forecastData[4].time[index].elementValue[0].value}%`;
    const otherBox = createElem("div", "weatherForecast__box--other");
    otherBox.append(windIcon, windText, waterIcon, humidity);

    // weatherForecast__box
    const forecastBox = createElem("div", "weatherForecast__box");
    forecastBox.append(tempBox, otherBox);

    // description
    const description = createElem("p");
    description.innerHTML = forecastData[6].time[index].elementValue[0].value;

    // weatherForecast__content
    const forecastContent = createElem("div", "weatherForecast__content");
    forecastContent.append(title, forecastBox, createElem("hr"), description);

    return forecastContent;
};

// 時間format處理
const getSimpleTime = (time) => {
    return `${time.getHours().toString().padStart(2, "0")}:${time
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
};

// 時間format處理
const getTitleTime = (startTime, endTime) => {
    const month = (startTime.getMonth() + 1).toString().padStart(2, "0");
    const date = startTime.getDate().toString().padStart(2, "0");

    return `${month}/${date} ${getSimpleTime(startTime)} ~ ${getSimpleTime(
        endTime
    )}`;
};
