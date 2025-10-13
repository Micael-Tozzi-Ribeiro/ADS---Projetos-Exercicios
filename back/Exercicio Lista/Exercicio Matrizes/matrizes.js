function multiplyMatrices(a, b) {
    const result = [];

    for (let i = 0; i < a.length; i++) {
      result[i] = [];
      for (let j = 0; j < b[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < b.length; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }

    return result;
  }

  document.getElementById('formReceita').addEventListener('submit', function(e) {
    e.preventDefault();

    // Ler vendas
    const vendas = [
      [
        Number(document.getElementById('vendaM1P1').value),
        Number(document.getElementById('vendaM1P2').value)
      ],
    ];

    // Ler preços
    const precos = [
      [Number(document.getElementById('precoP1').value)],
      [Number(document.getElementById('precoP2').value)]
    ];

    // Calcular receita
    const receita = multiplyMatrices(vendas, precos);

    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
      Receita no mês: R$ ${receita[0][0].toFixed(2)} <br />
    `;
  });