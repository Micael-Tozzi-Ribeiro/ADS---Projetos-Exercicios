// EXERCÍCIO 1 - Contagem Regressiva
document.getElementById("start1").onclick = function() {
    let cont = 10;
    let display = document.getElementById("contador1");
    display.innerText = cont;
    let interval = setInterval(() => {
        cont--;
        display.innerText = cont;
        if(cont <= 0) {
            clearInterval(interval);
            document.getElementById("proseguir1").style.display = "inline";
        }
    }, 1000);
}

// EXERCÍCIO 2
function pares1a50() {
    let result = [];
    for(let i=1; i<=50; i++){
        if(i % 2 === 0) result.push(i);
    }
    document.getElementById("pares").innerText = result.join(", ");
}

// EXERCÍCIO 3
function somaImparesMult3() {
    let soma = 0;
    for(let i=1; i<=50; i++){
        if(i % 2 !== 0 && i % 3 === 0) soma += i;
    }
    document.getElementById("somaImpares").innerText = "Soma: " + soma;
}

// EXERCÍCIO 4
function mostrarTabuada() {
    let n = parseInt(document.getElementById("numTabuada").value);
    if(isNaN(n)) return;
    let texto = "";
    for(let i=1; i<=10; i++){
        texto += `${n} x ${i} = ${n*i} <br>`;
    }
    document.getElementById("tabuada").innerHTML = texto;
}

// EXERCÍCIO 5
function somaPares() {
    let nums = [];
    for(let i=1; i<=6; i++){
        let valor = parseInt(document.getElementById("num"+i).value);
        if(!isNaN(valor)) nums.push(valor);
    }
    let soma = nums.filter(n => n % 2 === 0).reduce((a,b)=>a+b,0);
    document.getElementById("somaParesDiv").innerText = "Soma dos pares: " + soma;
}

// EXERCÍCIO 6
function mostrarPA() {
    let inicio = parseInt(document.getElementById("paInicio").value);
    let razao = parseInt(document.getElementById("paRazao").value);
    if(isNaN(inicio) || isNaN(razao)) return;
    let pa = [];
    for(let i=0; i<10; i++){
        pa.push(inicio + i*razao);
    }
    document.getElementById("paDiv").innerText = "PA: " + pa.join(", ");
}

// EXERCÍCIO 7
function verificarPolindromo() {
    let frase = document.getElementById("frasePolindromo").value.toLowerCase().replace(/\s/g,"");
    let reverso = frase.split("").reverse().join("");
    let res = frase === reverso ? "É um polindromo!" : "Não é um polindromo.";
    document.getElementById("resultadoPolindromo").innerText = res;
}

// EXERCÍCIO 8
function maioridade() {
    let anos = [];
    for(let i=1; i<=7; i++){
        let valor = parseInt(document.getElementById("ano"+i).value);
        if(!isNaN(valor)) anos.push(valor);
    }
    let maior = 0, menor = 0;
    let anoAtual = new Date().getFullYear();
    anos.forEach(a => (anoAtual - a) >= 18 ? maior++ : menor++);
    document.getElementById("maioridadeDiv").innerText = `Maiores: ${maior}, Menores: ${menor}`;
}

// EXERCÍCIO 9 - Maior e Menor Peso
function maiorMenorPeso() {
    let pesos = [];
    for(let i=1; i<=5; i++){
        let valor = parseFloat(document.getElementById("peso"+i).value);
        if(!isNaN(valor)) pesos.push(valor);
    }
    if(pesos.length === 0){
        document.getElementById("pesoDiv").innerText = "Insira ao menos um peso válido.";
        return;
    }
    let maior = Math.max(...pesos);
    let menor = Math.min(...pesos);
    document.getElementById("pesoDiv").innerText = `Maior peso: ${maior}, Menor peso: ${menor}`;
}

// EXERCÍCIO 10 - Contagem Progressiva
document.getElementById("start10").onclick = function() {
    let cont = 0;
    let display = document.getElementById("contador10");
    display.innerText = cont;
    let interval = setInterval(() => {
        cont++;
        display.innerText = cont;
        if(cont >= 10){
            clearInterval(interval);
            display.innerText += " - Você concluiu a tarefa em 20 segundos, parabéns!";
        }
    }, 2000);
}