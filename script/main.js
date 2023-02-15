const link = "http://api.weatherstack.com/current?access_key=1b6da534c6efdd1a9cb70e96b0336b94"

let store = {
    city: "London",
    feelslike: 0,
    temperature: 0,
    observationTime: "00:00 AM",
    isDay: 0,
    description: "",
    properties: {
        windSpeed: 0,
        visibility: 0,
        humidity: 0,
        cloudcover: 0,
        pressure: 0,
        uvIndex: 0,
    },
}

const fetchData = async () => {
    const result = await fetch(`${link}&query=London`)
    const data = await result.json()

    const {
        current: {
            feelslike,
            cloudcover,
            temperature,
            observation_time: observationTime,
            pressure,
            humidity,
            uv_index: uvIndex,
            visibility,
            is_day: isDay,
            weather_descriptions: description,
            wind_speed: windSpeed,
        },
        location: {name},
    } = data

    store = {
        ...store,
        city: "London",
        feelslike,
        cloudcover,
        temperature,
        observationTime,
        humidity,
        pressure,
        uvIndex,
        visibility,
        isDay,
        description: description[0],
        windSpeed,
    }

    const getImage = (desc) => {
        const value = desc.toLowerCase()
        switch (value) {
            case "overcast":
                return "partly.png"
            case "cloud":
                return "cloud.png"
            case "fog":
                return "fog.png"
            case "sunny":
                return "sunny.png"
            case "cloud":
                return "cloud.png"
            default:
                return "the.png"
        }
    }

    function markup() {
        const {city, observationTime, windSpeed, description, temperature} = store
        document.querySelector(
            "#city"
        ).innerHTML = `${city} <span class="card__title_light" id='temperature'>${temperature}C&deg</span>`
        document.querySelector("#windspeed").textContent = `${windSpeed}km`
        document.querySelector("#observation").textContent = `as of ${observationTime}`
        document.querySelector("#description").textContent = description
        document.querySelector("#img").setAttribute("src", `/img/wDescription/${getImage(description)}`)
    }
    markup()
}

fetchData()
