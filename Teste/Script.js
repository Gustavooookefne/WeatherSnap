
lucide.createIcons();

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

searchBtn.addEventListener('click', () => {
    const cityName = cityInput.value;
    if (cityName) buscarCoordenadas(cityName);
});


async function buscarCoordenadas(cidade) {
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`;
        const response = await fetch(geoUrl);
        const data = await response.json();

        if (!data.results) {
            alert("Cidade não encontrada!");
            return;
        }

        const { latitude, longitude, name } = data.results[0];
        getWeatherData(latitude, longitude, name);
    } catch (error) {
        console.error("Erro na geolocalização:", error);
    }
}


async function getWeatherData(lat, lon, cityName) {
    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`;
        const response = await fetch(weatherUrl);
        const data = await response.json();

        atualizarInterface(data, cityName);
    } catch (error) {
        console.error("Erro ao buscar clima:", error);
    }
}


function atualizarInterface(data, cityName) {
    const current = data.current_weather;
    

    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('weather-display').classList.remove('hidden');


    document.getElementById('city-name').innerText = cityName;
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('pt-BR');
    document.getElementById('temp-main').innerText = Math.round(current.temperature);
    document.getElementById('wind-speed').innerText = `${current.windspeed} km/h`;
    
   
    document.getElementById('weather-desc').innerText = traduzirCodigoClima(current.weathercode);

   
    const sugestao = current.temperature > 25 ? "Ideal para uma caminhada!" : "Que tal um café quente?";
    document.getElementById('suggestion-card').innerText = sugestao;

    
    lucide.createIcons();
}

function traduzirCodigoClima(code) {
    const codigos = {
        0: 'Céu limpo',
        1: 'Principalmente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Nevoeiro',
        95: 'Trovoada'
    };
    return codigos[code] || 'Condições variáveis';
}