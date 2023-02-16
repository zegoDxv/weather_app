const link = "http://api.weatherstack.com/current?access_key=3cc9a446d03b59b568d98901ae2e619c"

const btn = document.getElementById("btn")
const form = document.getElementById("form")
const textInput = document.getElementById("textInput")

let store = {
    city: "Pavlodar",
    temperature: 0,
    observationTime: "00:00 AM",
    isDay: "yes",
    description: "",
    properties: {
        windSpeed: {},
        visibility: {},
        humidity: {},
        cloudcover: {},
        pressure: {},
        uvIndex: {},
    },
}

const fetchData = async () => {
    try {
        const query = localStorage.getItem("query") || store.city
        const result = await fetch(`${link}&query=${query}`)
        const data = await result.json()

        const {
            current: {
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
            city: name,
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

        // console.log(store.isDay)

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
            const {city, observationTime, windSpeed, description, temperature, isDay} = store

            if (isDay === "yes") {
                document.querySelector(
                    "#isDay"
                ).innerHTML = `<img class='card-header__img' src="/img/isDay/yes.png" alt="">`
            } else {
                document.querySelector(
                    "#isDay"
                ).innerHTML = `<img class='card-header__img' src="/img/isDay/no.png" alt="">`
            }

            document.querySelector
            document.querySelector("#description").textContent = description
            document.querySelector(
                "#city"
            ).innerHTML = `${city} <span class="card__title_light" id='temperature'>${temperature}C&deg</span>`
            document.querySelector("#observation").textContent = `as of ${observationTime}`
            document.querySelector(
                "#windspeed"
            ).innerHTML = `${windSpeed}km/h <div class="card__info_hint">wind speed</div>`
            document.querySelector(
                "#cloudcover"
            ).innerHTML = `${cloudcover}% <div class="card__info_hint">cloudcover</div>`
            document.querySelector("#uvIndex").innerHTML = `${uvIndex} <div class="card__info_hint">uv Index</div>`
            document.querySelector("#humidity").innerHTML = `${humidity}% <div class="card__info_hint">humidity</div>`
            document.querySelector("#pressure").innerHTML = `${pressure}% <div class="card__info_hint">pressure</div>`
            document.querySelector(
                "#visibility"
            ).innerHTML = `${visibility}%  <div class="card__info_hint">visibility</div>`
            document.querySelector("#img").setAttribute("src", `/img/wDescription/${getImage(description)}`)
        }
        markup()
    } catch (err) {
        console.log(err)
    }
}

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value,
    }
}

const handleSubmit = (e) => {
    e.preventDefault()

    console.log(store.city)
    const value = store.city

    if (!value) return null

    localStorage.setItem("query", value)
    fetchData()
}

form.addEventListener("submit", handleSubmit)
textInput.addEventListener("input", handleInput)

fetchData()
