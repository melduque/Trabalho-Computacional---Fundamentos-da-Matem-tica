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