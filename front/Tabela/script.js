let dados = [];

function renderTabela(lista = dados) {
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  lista.forEach((item, index) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td contenteditable="false">${item.nome}</td>
      <td contenteditable="false">${item.idade}</td>
      <td class="actions">
        <button class="edit" onclick="editar(this, ${index})">✏️</button>
        <button class="delete" onclick="remover(${index})">🗑️</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function adicionar() {
  const nome = document.getElementById('nome').value.trim();
  const idade = document.getElementById('idade').value.trim();

  if (!nome || !idade) {
    alert('Preencha todos os campos!');
    return;
  }

  dados.push({ nome, idade });
  limparCampos();
  renderTabela();
}

function remover(index) {
  dados.splice(index, 1);
  renderTabela();
}

function editar(btn, index) {
  const tr = btn.closest('tr');
  const tds = tr.querySelectorAll('td');
  const editando = btn.classList.contains('save');

  if (!editando) {
    tds[0].contentEditable = true;
    tds[1].contentEditable = true;
    tds[0].focus();
    btn.textContent = '💾';
    btn.classList.add('save');
  } else {
    dados[index] = {
      nome: tds[0].innerText.trim(),
      idade: tds[1].innerText.trim()
    };

    tds[0].contentEditable = false;
    tds[1].contentEditable = false;
    btn.textContent = '✏️';
    btn.classList.remove('save');
  }
}

function filtrar() {
  const termo = document.getElementById('filtro').value.toLowerCase();

  const filtrados = dados.filter(item =>
    item.nome.toLowerCase().includes(termo) ||
    item.idade.toString().includes(termo)
  );

  renderTabela(filtrados);
}

function limparCampos() {
  document.getElementById('nome').value = '';
  document.getElementById('idade').value = '';
  document.getElementById('nome').focus();
}