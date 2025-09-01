function adicionarProduto() {
    const input = document.getElementById('input-item');
    const itemTexto = input.value.trim();
    
    if (itemTexto === '') {
        alert('Por favor, digite um item!');
        return;
    }

    const li = document.createElement('li');
    li.classList.add('item-produto');

    const span = document.createElement('span');
    span.textContent = itemTexto;
    li.appendChild(span);

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = function() {
        li.remove();
    };
    li.appendChild(btnRemover);

    document.getElementById('lista-produtos').appendChild(li);

    input.value = '';
}