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

    let capital = parseFloat(document.getElementById('capital1').value);
    let tempo = parseFloat(document.getElementById('tempo1').value);
    let taxa = parseFloat(document.getElementById('taxa1').value) / 100;
    let taxaIPCA = parseFloat(document.getElementById('taxaipca1').value) / 100;


    if (isNaN(capital) || isNaN(tempo) || isNaN(taxa) || isNaN(taxaIPCA)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    let montantesTaxa = [];
    let montantesIPCA = [];
    let tempos = [];

    for (let t = 0; t <= tempo; t += tempo/10) {
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
            labels: tempo.map(t => t.toFixed(1) + ' meses'),
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
    window.addEventListener('resize', function() {
        if (chartInstance) {
            chartInstance.resize();
        }
    });

}



// função 2) aporte de investimentos
document.getElementById('f2-calcular').addEventListener('click', calcularInvestimentoComAportes);
let exibirResultados2 = document.getElementById('f2-resultado');

function calcularInvestimentoComAportes(event) {
    event.preventDefault();

    const capital = parseFloat(document.getElementById('capital2').value);
    const aporte = parseFloat(document.getElementById('aporte').value);
    const tempo = parseFloat(document.getElementById('tempo2').value);
    const taxa = parseFloat(document.getElementById('taxa2').value) / 100;
    const taxaIPCA = parseFloat(document.getElementById('taxaipca2').value) / 100;

    

    if (isNaN(capital) || isNaN(aporte) || isNaN(tempo) || isNaN(taxa) || isNaN(taxaIPCA)) {
        alert('Por favor, insira valores válidos.');
        return;
    }

    const montantesTaxa = [];
    const montantesIPCA = [];
    const tempos = [];

    let montanteTaxaAtual = capital;
    let montanteIPCAAtual = capital;

    for (let t = 0; t <= tempo;  t++) {
        tempos.push(t);
        if (t > 0) {
        

        montanteTaxaAtual = montanteTaxaAtual * (1 + taxa) + aporte;
        montanteIPCAAtual = montanteIPCAAtual * (1 + taxaIPCA) + aporte;
        }
        else{
            montanteTaxaAtual = montanteTaxaAtual * (1 + taxa);
            montanteIPCAAtual = montanteIPCAAtual * (1 + taxaIPCA);
        }
        montantesTaxa.push(montanteTaxaAtual);
        montantesIPCA.push(montanteIPCAAtual);
    }

    const diferenca = montantesTaxa[montantesTaxa.length - 1] - montantesIPCA[montantesIPCA.length - 1];

    exibirResultados2.innerHTML = `
        <p>Montante final com taxa: R$ ${montantesTaxa[montantesTaxa.length - 1].toFixed(2)}</p>
        <p>Montante final com IPCA: R$ ${montantesIPCA[montantesIPCA.length - 1].toFixed(2)}</p>
        <p>Diferença: R$ ${diferenca.toFixed(2)}</p>
    `;

    document.getElementById('container-grafico2').style.display = 'block';

    desenharGraficoAportes(tempos, montantesTaxa, montantesIPCA);
}

let chartInstance2;
function desenharGraficoAportes(tempo, montantesTaxa, montantesIPCA) {
    const containerChart = document.querySelector('#grafico2'); 
    const context = containerChart.getContext('2d');

    if (chartInstance2) {
        chartInstance2.destroy();
    }

    chartInstance2 = new Chart(context, {
        type: 'line',
        data: {
            labels: tempo.map(t => `${t} meses`),
            datasets: [
                {
                    label: 'Montante com aplicação',
                    data: montantesTaxa,
                    backgroundColor: '#555',
                    borderColor: 'gray',
                    fill: false,
                },
                {
                    label: 'Montante com IPCA',
                    data: montantesIPCA,
                    backgroundColor: '#000',
                    borderColor: 'orange',
                    fill: false,
                }
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tempo (meses)',
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
    window.addEventListener('resize', function() {
        if (chartInstance) {
            chartInstance.resize();
        }
    });

}


// Função 3) Calculadora de Tempo de Ordenação
document.getElementById('f3-calcular').addEventListener('click', calcularTempoOrdenacao);

function calcularTempoOrdenacao(event) {
    event.preventDefault();

    
    const velocidade = parseFloat(document.getElementById('velocidade').value);
    const volume = parseFloat(document.getElementById('volume').value);

    if (isNaN(velocidade) || isNaN(volume) || velocidade <= 0 || volume <= 0) {
        alert('Por favor, insira valores válidos e maiores que zero.');
        return;
    }

    if(volume<0){
        alert('o volume de dados não pode ser negativo.');
        return;
    }

    const tempoMetodo1=[];
    const tempoMetodo2=[];
    const tempoMetodo3=[];
    const volumes=[];

    for(let i=1;i<=20;i++){
        const volumeatual=volume*(i/20);
        volumes.push(volumeatual);

        
        tempoMetodo1.push(Math.pow(volumeatual, 2) / velocidade);
        tempoMetodo2.push(((Math.log(volumeatual)/Math.log(2)) * volumeatual) / velocidade);
        tempoMetodo3.push(((Math.log(volumeatual)/Math.log(2)) * volumeatual) / velocidade);

    }
    
    const resultadosDiv = document.getElementById('f3-resultado');
    resultadosDiv.innerHTML = `
        <p><strong>Método Bubble Sort:</strong> O tempo aumenta de forma quadrática com o volume de dados.</p>
        <p><strong>Método Merge Sort:</strong> O tempo cresce de forma log-linear, eficiente para grandes volumes.</p>
        <p><strong>Método Quick Sort:</strong> O tempo cresce log-linear de forma semelhante ao Merge Sort e tende até a ser ligeiramente melhor na maioria dos casos, mas seu pior caso possui complexidade quadrática.</p>
    `;

    // Exibe o gráfico
    document.getElementById('container-grafico3').style.display = 'block';
    desenharGraficoOrdenacao(volumes, tempoMetodo1, tempoMetodo2, tempoMetodo3);
}

let chartInstance3;
function desenharGraficoOrdenacao(tamanhos, temposBubble, temposMerge, temposQuick) {
    const containerChart = document.querySelector('#grafico3');
    const context = containerChart.getContext('2d');

    if (chartInstance3) {
        chartInstance3.destroy();
    }

    chartInstance3 = new Chart(context, {
        type: 'line',
        data: {
            labels: tamanhos.map(t => `${t.toFixed(2)} MB`),
            datasets: [
                {
                    label: 'Bubble Sort',
                    data: temposBubble,
                    borderColor: 'red',
                    fill: false,
                },
                {
                    label: 'Merge Sort',
                    data: temposMerge,
                    borderColor: 'blue',
                    fill: false,
                },
                {
                    label: 'Quick Sort',
                    data: temposQuick,
                    borderColor: 'green',
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
                        text: 'Volume de Dados (MB)',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tempo de Processamento (s)',
                    },
                },
            },
        },
    });
    window.addEventListener('resize', function() {
        if (chartInstance) {
            chartInstance.resize();
        }
    });

}
