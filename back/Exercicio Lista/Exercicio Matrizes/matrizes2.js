function multiplyMatrixAndPoint(matrix, point) {
    // matrix 2x2, point 2x1
    return [
        matrix[0][0] * point[0] + matrix[0][1] * point[1],
        matrix[1][0] * point[0] + matrix[1][1] * point[1],
    ];
}

document.getElementById('formTransform').addEventListener('submit', function (e) {
    e.preventDefault();

    // Ler pontos
    const points = [
        [Number(document.getElementById('x1').value), Number(document.getElementById('y1').value)],
        [Number(document.getElementById('x2').value), Number(document.getElementById('y2').value)],
        [Number(document.getElementById('x3').value), Number(document.getElementById('y3').value)],
    ];

    // Ler escala
    const s = Number(document.getElementById('scale').value);

    // Matriz de escala 2x2
    const scaleMatrix = [
        [s, 0],
        [0, s],
    ];

    // Aplicar escala a cada ponto
    const transformedPoints = points.map(pt => multiplyMatrixAndPoint(scaleMatrix, pt));

    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '<h2>Pontos após transformação:</h2>';

    transformedPoints.forEach((pt, i) => {
        resultadoDiv.innerHTML += `Ponto ${i + 1}: ( ${pt[0].toFixed(2)} , ${pt[1].toFixed(2)} )<br/>`;
    });
});