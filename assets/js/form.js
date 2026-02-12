document.getElementById('form-contact').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    const requiredFields = [
        'nome',
        'estado',
        'telefone',
        'email',
        'valor_precatorio',
        'numero_processo',
        'aceito_privacidade'
    ];

    for (let field of requiredFields){
        if (!formData.get(field)){
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    }

    const textoOriginal = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    fetch('mails/enviar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
        if (data.sucesso) {
            alert('Formulário enviado com sucesso!');
            form.reset();
        } else {
            alert(data.mensagem || 'Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.');
        }
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
        alert('Erro ao enviar o formulário. Tente novamente mais tarde.');
        console.error('Error:', error);
    });
});