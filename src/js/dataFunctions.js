const APPKEY = "CWA-B49E3A3B-490C-4BF6-8F0A-8497E4C03255";

// 取得自動氣象站 - 氣象觀測資料
export const getWeatherObserveFromApi = async (station) => {
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
export const getHourlyForecastFromApi = async (city) => {
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
