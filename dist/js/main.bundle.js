/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/constants.js":
/*!*****************************!*\
  !*** ./src/js/constants.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CITYDATA: () => (/* binding */ CITYDATA)
/* harmony export */ });
const CITYDATA = [
    {
        city: "臺北市",
        station: "C0AC70",
    },
    {
        city: "新北市",
        station: "C0AJ80",
    },
    {
        city: "桃園市",
        station: "C0C480",
    },
    {
        city: "臺中市",
        station: "C0F9T0",
    },
    {
        city: "臺南市",
        station: "C0X190",
    },
    {
        city: "高雄市",
        station: "C0V710",
    },
    {
        city: "基隆市",
        station: "C0B050",
    },
    {
        city: "新竹縣",
        station: "C0D650",
    },
    {
        city: "新竹市",
        station: "C0D660",
    },
    {
        city: "宜蘭縣",
        station: "C0U940",
    },
    {
        city: "苗栗縣",
        station: "C0E910",
    },
    {
        city: "南投縣",
        station: "C0I460",
    },
    {
        city: "彰化縣",
        station: "C0G910",
    },
    {
        city: "雲林縣",
        station: "C0K400",
    },
    {
        city: "嘉義縣",
        station: "C0M680",
    },
    {
        city: "嘉義市",
        station: "C0M730",
    },
    {
        city: "屏東縣",
        station: "C0R170",
    },
    {
        city: "花蓮縣",
        station: "C0T9D0",
    },
    {
        city: "臺東縣",
        station: "C0SA60",
    },
    {
        city: "澎湖縣",
        station: "C0W200",
    },
    {
        city: "金門縣",
        station: "C0W150",
    },
    {
        city: "連江縣",
        station: "C0W220",
    },
];


/***/ }),

/***/ "./src/js/dataFunctions.js":
/*!*********************************!*\
  !*** ./src/js/dataFunctions.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHourlyForecastFromApi: () => (/* binding */ getHourlyForecastFromApi),
/* harmony export */   getWeatherObserveFromApi: () => (/* binding */ getWeatherObserveFromApi)
/* harmony export */ });
const APPKEY = "CWA-B49E3A3B-490C-4BF6-8F0A-8497E4C03255";

// 取得自動氣象站 - 氣象觀測資料
const getWeatherObserveFromApi = async (station) => {
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=${APPKEY}&StationId=${station}`;

    let data = {};
    let error = "";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        data = await response.json();
    } catch (err) {
        error = err.message;
    }

    return { data, error };
};

// 取得臺灣各鄉鎮市區預報資料 - 未來2天(逐3小時)
const getHourlyForecastFromApi = async (city) => {
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=${APPKEY}&locationName=${city}`;
    const encodedUrl = encodeURI(url);

    let data = {};
    let error = "";
    try {
        const response = await fetch(encodedUrl);
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        data = await response.json();
    } catch (err) {
        error = err.message;
    }

    return { data, error };
};


/***/ }),

/***/ "./src/js/domFunctions.js":
/*!********************************!*\
  !*** ./src/js/domFunctions.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadCityOption: () => (/* binding */ loadCityOption),
/* harmony export */   updateHourlyForecast: () => (/* binding */ updateHourlyForecast),
/* harmony export */   updateWeatherObserve: () => (/* binding */ updateWeatherObserve)
/* harmony export */ });
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
const loadCityOption = (cityData) => {
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
const updateWeatherObserve = (result) => {
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
            weatherData.Weather !== -99
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
const updateHourlyForecast = (result) => {
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/style.scss */ "./src/scss/style.scss");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ "./src/js/constants.js");
/* harmony import */ var _domFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./domFunctions */ "./src/js/domFunctions.js");
/* harmony import */ var _dataFunctions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dataFunctions */ "./src/js/dataFunctions.js");





// init function
const initApp = () => {
    // load button list
    const selectOption = (0,_domFunctions__WEBPACK_IMPORTED_MODULE_2__.loadCityOption)(_constants__WEBPACK_IMPORTED_MODULE_1__.CITYDATA);

    // 處理city按鈕點擊
    const cityBtn = document.getElementById("selectBox__btn");
    cityBtn.addEventListener("click", toggleCity);

    // 處理city選擇 listen list click
    selectOption.addEventListener("click", handleCitySelect);

    // 處理焦點轉移 (離開city按鈕)
    document.body.addEventListener("click", handleBlur);

    // 預設點擊
    handleDefaultClick(selectOption);
};

// 處理city按鈕點擊 or 關閉menu
const toggleCity = () => {
    const cityBtn = document.getElementById("selectBox__btn");
    cityBtn.classList.toggle("clicked");
};

// listen list click
const handleCitySelect = async (event) => {
    if (event.target.tagName !== "BUTTON") return;

    const selectOption = event.currentTarget;
    const allButtons = selectOption.querySelectorAll("button");

    // update style & get index
    let selectIndex = 0;
    allButtons.forEach((btn, index) => {
        if (btn.classList.contains("selected")) {
            btn.classList.remove("selected");
        }

        if (btn.contains(event.target)) {
            // btn顯示城市名
            document.getElementById("selectBox__city").innerHTML =
                _constants__WEBPACK_IMPORTED_MODULE_1__.CITYDATA[index].city;
            btn.classList.add("selected");
            selectIndex = index;
        }
    });

    // close menu
    const cityBtn = selectOption.previousElementSibling;
    if (cityBtn.classList.contains("clicked")) {
        toggleCity();
    }

    // call api update weather observe
    const observeData = await (0,_dataFunctions__WEBPACK_IMPORTED_MODULE_3__.getWeatherObserveFromApi)(
        _constants__WEBPACK_IMPORTED_MODULE_1__.CITYDATA[selectIndex].station
    );
    (0,_domFunctions__WEBPACK_IMPORTED_MODULE_2__.updateWeatherObserve)(observeData);

    // call api update hourly forecast
    const forecastData = await (0,_dataFunctions__WEBPACK_IMPORTED_MODULE_3__.getHourlyForecastFromApi)(
        _constants__WEBPACK_IMPORTED_MODULE_1__.CITYDATA[selectIndex].city
    );
    (0,_domFunctions__WEBPACK_IMPORTED_MODULE_2__.updateHourlyForecast)(forecastData);

    // save city
    localStorage.setItem("city", selectIndex.toString());
};

// 處理焦點轉移
const handleBlur = (event) => {
    // city按鈕開啟 & 焦點離開
    const target = event.target;
    const cityBtn = document.getElementById("selectBox__btn");
    const selectOption = cityBtn.nextElementSibling;

    if (
        cityBtn.classList.contains("clicked") &&
        !cityBtn.contains(target) &&
        !selectOption.contains(target)
    ) {
        toggleCity();
    }
};

// 預設點擊
const handleDefaultClick = (selectOption) => {
    const allButtons = selectOption.querySelectorAll("button");

    let defaultIndex = localStorage.getItem("city");
    if (!defaultIndex) {
        defaultIndex = 0;
    }

    allButtons[Number(defaultIndex)].click();
};

// init
document.addEventListener("DOMContentLoaded", initApp);

})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map