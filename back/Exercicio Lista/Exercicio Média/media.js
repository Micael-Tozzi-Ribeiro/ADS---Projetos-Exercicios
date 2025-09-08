function calcularMedia() {
    const n1 = parseFloat(document.getElementById('nota1').value);
    const n2 = parseFloat(document.getElementById('nota2').value);
    const n3 = parseFloat(document.getElementById('nota3').value);
    const n4 = parseFloat(document.getElementById('nota4').value);

    if (isNaN(n1) || isNaN(n2) || isNaN(n3) || isNaN(n4)) {
      document.getElementById('resultado').textContent = 'Por favor, preencha todas as notas corretamente.';
      return;
    }

    const media = (n1 + n2 + n3 + n4) / 4;

    document.getElementById('resultado').textContent = `A média é: ${media.toFixed(2)}`;
  }