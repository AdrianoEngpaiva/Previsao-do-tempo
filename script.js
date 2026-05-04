async function buscarCidade(cidade) {
    const key = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}`;

    const dados = await fetch(key);
    const resposta = await dados.json();

    const nomeCidade = resposta.results[0].name;
    const lat = resposta.results[0].latitude;
    const lon = resposta.results[0].longitude;

    const clima = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`);
    const respostaClima = await clima.json();

    console.log(respostaClima);


    colocarDadosNaTela(resposta, respostaClima);
}


function cliqueNoBotao() {
    const input = document.querySelector(".input-cidade").value;

    buscarCidade(input);


}

function colocarDadosNaTela(resposta, clima) {

    const nomeCidade = resposta.results[0].name;
    const codigo = clima.current_weather.weathercode;

    const descricao = pegarDescricao(codigo);

    document.querySelector(".cidade").innerText = `Tempo em ${nomeCidade}`;
    document.querySelector(".temp").innerText = `Temperatura: ${clima.current_weather.temperature}°C`;
    document.querySelector(".descricao-clima").innerText = descricao;

    const horaAtual = clima.current_weather.time;

    let index = 0;

    for (let i = 0; i < clima.hourly.time.length; i++) {
        if (clima.hourly.time[i] >= horaAtual) {
            index = i;
            break;
        }
    }

    const umidade = clima.hourly.relative_humidity_2m[index];

    document.querySelector(".umidade").innerText = `Umidade: ${umidade}%`;
    document.querySelector(".img-previsao").src = pegarIcone(codigo);


}
function pegarDescricao(codigo) {
    const mapa = {
        0: "Céu limpo",
        1: "Poucas nuvens",
        2: "Parcialmente nublado",
        3: "Nublado",
        61: "Chuva leve",
        63: "Chuva",
        65: "Chuva forte",
        80: "Pancadas de chuva"
    };
    return mapa[codigo] || "Clima desconhecido";
}

function pegarIcone(codigo) {
    const mapa = {
        0: "https://cdn-icons-png.flaticon.com/512/869/869869.png", // sol
        1: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
        2: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
        3: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
        61: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
        63: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
        65: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
        80: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png"
    };

    return mapa[codigo] || "";
}
