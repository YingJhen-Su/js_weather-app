import "../scss/style.scss";
import { CITYDATA } from "./constants";
import {
    loadCityOption,
    updateWeatherObserve,
    updateHourlyForecast,
} from "./domFunctions";
import {
    getWeatherObserveFromApi,
    getHourlyForecastFromApi,
} from "./dataFunctions";

// init function
const initApp = () => {
    // load button list
    const selectOption = loadCityOption(CITYDATA);

    // 處理city按鈕點擊
    const cityBtn = document.getElementById("selectBox__btn");
    cityBtn.addEventListener("click", toggleCity);

    // 處理information按鈕點擊
    const informationBtn = document.getElementById("information__btn");
    informationBtn.addEventListener("click", toggleInformation);

    // 處理city選擇 listen list click
    selectOption.addEventListener("click", handleCitySelect);

    // 處理焦點轉移 (離開cityc或information按鈕)
    document.addEventListener("click", handleBlur);

    // 預設點擊
    handleDefaultClick(selectOption);
};

// 處理city按鈕點擊 or 關閉menu
const toggleCity = () => {
    const cityBtn = document.getElementById("selectBox__btn");
    cityBtn.classList.toggle("clicked");
};

// 處理information按鈕點擊
const toggleInformation = () => {
    const informationBtn = document.getElementById("information__btn");
    informationBtn.classList.toggle("clicked");
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
                CITYDATA[index].city;
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
    const observeData = await getWeatherObserveFromApi(
        CITYDATA[selectIndex].station
    );
    updateWeatherObserve(observeData);

    // call api update hourly forecast
    const forecastData = await getHourlyForecastFromApi(
        CITYDATA[selectIndex].city
    );
    updateHourlyForecast(forecastData);

    // save city
    localStorage.setItem("city", selectIndex.toString());
};

// 處理焦點轉移
const handleBlur = (event) => {
    const target = event.target;

    // city按鈕開啟 & 焦點離開
    const cityBtn = document.getElementById("selectBox__btn");
    const selectOption = cityBtn.nextElementSibling;

    if (
        cityBtn.classList.contains("clicked") &&
        !cityBtn.contains(target) &&
        !selectOption.contains(target)
    ) {
        toggleCity();
    }

    // information按鈕開啟 & 焦點離開
    const informationBtn = document.getElementById("information__btn");
    const informationText = informationBtn.nextElementSibling;

    if (
        informationBtn.classList.contains("clicked") &&
        !informationBtn.contains(target) &&
        !informationText.contains(target)
    ) {
        toggleInformation();
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
