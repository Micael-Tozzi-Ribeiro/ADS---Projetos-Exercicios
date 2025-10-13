function multiplyMatrices(a, b) {
    const rowsA = a.length;
    const colsA = a[0].length;
    const rowsB = b.length;
    const colsB = b[0].length;

    if (colsA !== rowsB) {
      throw new Error('Número de colunas da matriz A deve ser igual ao número de linhas da matriz B');
    }

    const result = new Array(rowsA).fill(0).map(() => new Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }

    return result;
  }

  document.getElementById('formCusto').addEventListener('submit', function(e) {
    e.preventDefault();

    // Montar matriz de quantidades (3x4)
    const quantidades = [
      [
        Number(document.getElementById('q11').value),
        Number(document.getElementById('q12').value),
        Number(document.getElementById('q13').value),
        Number(document.getElementById('q14').value)
      ],
      [
        Number(document.getElementById('q21').value),
        Number(document.getElementById('q22').value),
        Number(document.getElementById('q23').value),
        Number(document.getElementById('q24').value)
      ],
      [
        Number(document.getElementById('q31').value),
        Number(document.getElementById('q32').value),
        Number(document.getElementById('q33').value),
        Number(document.getElementById('q34').value)
      ],
    ];

    // Matriz de custos (4x1)
    const custos = [
      [Number(document.getElementById('c1').value)],
      [Number(document.getElementById('c2').value)],
      [Number(document.getElementById('c3').value)],
      [Number(document.getElementById('c4').value)]
    ];

    // Multiplicar matrizes
    const resultado = multiplyMatrices(quantidades, custos);

    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '<h2>Custo total por receita:</h2>';

    resultado.forEach((linha, i) => {
      resultadoDiv.innerHTML += `Receita ${i + 1}: R$ ${linha[0].toFixed(2)}<br>`;
    });
  });