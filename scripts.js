window.onload = function() {
    let botoes = document.getElementsByClassName('botao');

    for (let i = 0; i < botoes.length; i++) {
        let divFuncao;
        botoes[i].onclick = function(){
            divFuncao = document.getElementById(botoes[i].value);
            divFuncao.style.display = 'block';
            NaoClicados(botoes, i);
        };
    }
}
function NaoClicados(botoes, i){
    for(let j = 0; j < botoes.length; j ++){
        if(j != i){
            let funcao = document.getElementById(botoes[j].value);
            funcao.style.display = 'none';
        }
    }
}

document.getElementById('f1-calcular').addEventListener('click', calcularInvestimento);
let exibirResultados = document.getElementById('container-grafico1');
exibirResultados.style.display='block';

function calcularInvestimento(event) {
    event.preventDefault(); 

    const capital = parseFloat(document.getElementById('capital1').value);
    const tempo = parseFloat(document.getElementById('tempo1').value);
    const taxa = parseFloat(document.getElementById('taxa1').value) / 100;
    const taxaIPCA = parseFloat(document.getElementById('taxaipca1').value) / 100;

    if (isNaN(capital) || isNaN(tempo) || isNaN(taxa) || isNaN(taxaIPCA)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    const montantesTaxa = [];
    const montantesIPCA = [];
    const tempos = [];
    for (let t = 0; t <= tempo; t += tempo / 10) {
        tempos.push(t);
        montantesTaxa.push(capital * Math.pow(1 + taxa, t));
        montantesIPCA.push(capital * Math.pow(1 + taxaIPCA, t));
    }

    const diferenca = montantesTaxa[montantesTaxa.length - 1] - montantesIPCA[montantesIPCA.length - 1];
    document.getElementById('f1-resultado').innerHTML = `
        <p>Montante final com taxa: R$ ${montantesTaxa[montantesTaxa.length - 1].toFixed(2)}</p>
        <p>Montante final com IPCA: R$ ${montantesIPCA[montantesIPCA.length - 1].toFixed(2)}</p>
        <p>Diferença: R$ ${diferenca.toFixed(2)}</p>
    `;

    desenharGrafico(tempos, montantesTaxa, montantesIPCA);
}
 let chartInstance;
function desenharGrafico(tempo, montantesTaxa, montantesIPCA) {
    const containerChart = document.querySelector('#grafico'); 
    const context = containerChart.getContext('2d');

    if(chartInstance){
        chartInstance.destroy();
    }

    let dif = [];
    let coresDif = [];
    for (let i = 0; i < montantesTaxa.length; i++) {
        const diferenca = montantesTaxa[i] - montantesIPCA[i];
        dif.push(diferenca);
        coresDif.push(diferenca < 0 ? 'red' : 'green');
    }

    chartInstance = new Chart(context, {
        type: 'line',
        data: {
            labels: tempo.map(t => t.toFixed(1) + ' anos'),
            datasets: [
                {
                    label: 'Montante da aplicação',
                    data: montantesTaxa,
                    backgroundColor: '#555',
                    borderColor: 'gray',
                    fill: false,
                },
                {
                    label: 'Montante IPCA',
                    data: montantesIPCA,
                    backgroundColor: '#000',
                    borderColor: 'orange',
                    fill: false,
                },
                {
                    label: 'Diferença (Aplicação - IPCA)',
                    data: dif,
                    backgroundColor: coresDif,
                    borderColor: coresDif,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tempo (anos)',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Montante (R$)',
                    },
                },
            },
        },
    });
}