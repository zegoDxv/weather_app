const link = "http://api.weatherstack.com/current?access_key=463929a67918385252921eae22c9dc69"

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

        if (data.success == false) {
            let hash = window.location.hash.substring(1)
            Swal.fire({
                icon: "error",
                // title: "Oops...",
                // text: "You entered the wrong name",
                title: `${langModal["title"][hash]}`,
                text: `${langModal["text"][hash]}`,
                confirmButtonColor: "#1a272c",
                background: "#203139",
                color: "#fff",
            })
            const query = localStorage.setItem("query", `Pavlodar`)

            fetchData()
            return
        }

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

            let spanObservation = document.createElement("span")
            spanObservation.textContent = ` ${observationTime}`

            let spanWindSpeed = document.createElement("span")
            spanWindSpeed.textContent = `${windSpeed}`

            let spanCloudCover = document.createElement("span")
            spanCloudCover.textContent = `${cloudcover}%`

            let spanUvIndex = document.createElement("span")
            spanUvIndex.textContent = uvIndex

            let spanHumidity = document.createElement("span")
            spanHumidity.textContent = `${humidity}%`

            let spanPressure = document.createElement("span")
            spanPressure.textContent = `${pressure}%`

            let spanVisibility = document.createElement("span")
            spanVisibility.textContent = `${visibility}%`

            if (isDay === "yes") {
                document.querySelector(
                    "#isDay"
                ).innerHTML = `<img class='card-header__img' src="/img/isDay/yes.png" alt="">`
                document.querySelector("#webIcon").setAttribute("href", `/img/webicon/yes.png`)
            } else {
                document.querySelector(
                    "#isDay"
                ).innerHTML = `<img class='card-header__img' src="/img/isDay/no.png" alt="">`
                document.querySelector("#webIcon").setAttribute("href", `/img/webicon/no.png`)
            }

            document.querySelector("#description").textContent = description
            document.querySelector(
                "#city"
            ).innerHTML = `${city} <span class="card__title_light" id='temperature'>${temperature}C&deg</span>`
            document.querySelector("#observation").append(spanObservation)
            document.querySelector("#windspeed").prepend(spanWindSpeed)
            document.querySelector("#cloudcover").prepend(spanCloudCover)
            document.querySelector("#uvIndex").prepend(spanUvIndex)
            document.querySelector("#humidity").prepend(spanHumidity)
            document.querySelector("#pressure").prepend(spanPressure)
            document.querySelector("#visibility").prepend(spanVisibility)
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
    location.reload()
}

form.addEventListener("submit", handleSubmit)
textInput.addEventListener("input", handleInput)

// Переводчик пошел ежже
const allLang = ["ru", "en", "kz", "tr"]

const select = document.querySelector("#select")
select.value = localStorage.getItem("language") || "en"
select.addEventListener("change", changeURLLang)

// Перенаправить на URL с указанием языка
function changeURLLang() {
    let lang = select.value
    location.href = `${window.location.pathname}#${lang}`
    localStorage.setItem("language", lang)
    select.value = localStorage.getItem("language")
    location.reload()
}

fetchData()

function changeLanguage() {
    let hash = window.location.hash.substring(1)
    if (!allLang.includes(hash)) {
        location.href = `${window.location.pathname}#${localStorage.getItem("language") || "en"}`
        location.reload()
    }
    select.value = hash
    for (let key in langArr) {
        console.log(key)
        if (document.querySelector(".lng-" + key) != document.querySelector(".lng-placholder")) {
            document.querySelector(".lng-" + key).textContent = `${langArr[key][hash]}`
        }
    }

    document.querySelector("#textInput").setAttribute("placeholder", `${langArr["placeholder"][hash]}`)

    // console.log(document.querySelector("#description").textContent)
    // console.log(langDesc["description"][document.querySelector("#description").textContent][hash])
    // console.log(langDesc["description"][`${store.description}`][hash])
    console.log(store.description)

    setTimeout(() => {
        document.querySelector("#description").textContent = langDesc["description"][`${store.description}`][hash]
    }, 800)

    // document.querySelector("#description").textContent =
    //     langArr[`${document.querySelector("#description").textContent}`[hash]]
}

setTimeout(() => {
    changeLanguage()
}, 80)
