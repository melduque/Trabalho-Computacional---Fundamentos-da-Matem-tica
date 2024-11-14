window.onload = function() {
    let botoes = document.getElementsByClassName('botao');

    for (let i = 0; i < botoes.length; i++) {
        let divFuncao;
        botoes[i].onclick = function(){
            divFuncao = document.getElementById(botoes[i].value);
            divFuncao.style.display = 'block';
        };
        
    }
}