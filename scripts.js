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
    const tempoTabela = volumes.map((v, i) => `
        <tr>
            <td>${v.toFixed(2)} MB</td>
            <td>${tempoMetodo1[i].toFixed(2)} s</td>
            <td>${tempoMetodo2[i].toFixed(2)} s</td>
            <td>${tempoMetodo3[i].toFixed(2)} s</td>
        </tr>
    `).join('');

    resultadosDiv.innerHTML = `
    <p><strong>Método Bubble Sort:</strong> O tempo aumenta de forma quadrática com o volume de dados.</p>
    <p><strong>Método Merge Sort:</strong> O tempo cresce de forma log-linear, eficiente para grandes volumes.</p>
    <p><strong>Método Quick Sort:</strong> O tempo cresce log-linear de forma semelhante ao Merge Sort e tende até a ser ligeiramente melhor na maioria dos casos, mas seu pior caso possui complexidade quadrática.</p>
    <table>
        <thead>
            <tr>
                <th>Volume de Dados</th>
                <th>Bubble Sort</th>
                <th>Merge Sort</th>
                <th>Quick Sort</th>
            </tr>
        </thead>
        <tbody>${tempoTabela}</tbody>
    </table> <br>
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

//Função 4) Cálculo da raiz de uma função pelo método da bisseção

let funcaoEscolhida = document.getElementById('tipoFuncao');

funcaoEscolhida.oninput = function(){
    if(funcaoEscolhida.value == 'Exponencial'){
        document.getElementById('exponencial').style.display = 'block';
        document.getElementById('polinomial').style.display = 'none';
    }
    else{
        document.getElementById('polinomial').style.display = 'block';
        document.getElementById('exponencial').style.display = 'none';

        let inicioIntervalo = document.getElementById('inicio').value;
        let fimIntervalo = document.getElementById('fim').value;
        let iteracoes = document.getElementById('max-iteracoes').value;
        let grau = document.getElementById('grau').value;
        let coeficientes = document.getElementById('coeficientes').value.split(',');
    }
    document.getElementById('f4-calcular').style.display = 'block';

    // Função principal que calcula a raiz de um polinômio usando o método da bisseção.
function calcularRaizPolinomial(event) {
    // Previne o comportamento padrão do formulário (recarregar a página).
    event.preventDefault();

    // Obtém o valor inicial do intervalo de busca da raiz.
    const inicio = parseFloat(document.getElementById('inicio').value);
    // Obtém o valor final do intervalo de busca da raiz.
    const fim = parseFloat(document.getElementById('fim').value);
    // Obtém o número máximo de iterações permitido para o cálculo.
    const iteracoes = parseInt(document.getElementById('max-iteracoes').value);
    // Obtém os coeficientes do polinômio como uma lista de números.
    const coeficientes = document.getElementById('coeficientes').value
        .split(',') // Separa os coeficientes por vírgulas.
        .map(parseFloat); // Converte cada elemento da lista para um número.

    // Verifica se algum dos valores inseridos é inválido.
    if (isNaN(inicio) || isNaN(fim) || isNaN(iteracoes) || coeficientes.some(isNaN)) {
        alert('Insira valores válidos.'); // Exibe um alerta em caso de erro.
        return; // Interrompe a execução da função.
    }

    // Função que calcula o valor do polinômio para um dado valor de x.
    function polinomio(x) {
        // Calcula o polinômio usando a fórmula geral e os coeficientes.
        return coeficientes.reduce(
            (acc, coef, i) => acc + coef * Math.pow(x, coeficientes.length - 1 - i),
            0
        );
    }

    // Define os limites iniciais do intervalo de busca.
    let a = inicio, b = fim, raiz = null;

    // Loop para realizar o cálculo iterativo do método da bisseção.
    for (let i = 0; i < iteracoes; i++) {
        // Calcula o ponto médio do intervalo atual.
        const meio = (a + b) / 2;
        // Calcula o valor do polinômio no ponto médio.
        const fMeio = polinomio(meio);

        // Verifica se o valor no ponto médio é suficientemente próximo de zero (precisão).
        if (Math.abs(fMeio) < 1e-7) {
            raiz = meio; // Define o ponto médio como a raiz aproximada.
            break; // Interrompe o loop.
        }

        // Determina em qual subintervalo está a raiz, com base no sinal do produto.
        if (polinomio(a) * fMeio < 0) {
            b = meio; // A raiz está no intervalo [a, meio].
        } else {
            a = meio; // A raiz está no intervalo [meio, b].
        }
    }

    // Exibe os resultados na página.
    document.getElementById('f4-resultado').style.display = 'block';
    // Preenche a tabela com os valores finais do intervalo e a raiz aproximada.
    document.getElementById('f4-tabela').innerHTML = `
        <tr>
            <td>${a}</td> <!-- Limite inferior final. -->
            <td>${b}</td> <!-- Limite superior final. -->
            <td>${raiz}</td> <!-- Raiz aproximada encontrada. -->
        </tr>
    `;
}

// Associa a função calcularRaizPolinomial ao evento de clique no botão de cálculo.
document.getElementById('f4-calcular').addEventListener('click', calcularRaizPolinomial);

};


