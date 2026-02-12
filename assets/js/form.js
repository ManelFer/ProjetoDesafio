(function () {
    const form = document.getElementById('form-contact');
    if (!form) return;

    const formAlert = form.querySelector('#form-alert');
    const submitBtn = form.querySelector('button[type="submit"]');

    function showAlert(type, message) {
        if (!formAlert) return;
        formAlert.className = 'alert alert-' + type + ' alert-dismissible fade show';
        formAlert.setAttribute('role', 'alert');
        formAlert.innerHTML = message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>';
        formAlert.classList.remove('d-none');
    }

    function hideAlert() {
        if (formAlert) {
            formAlert.classList.add('d-none');
            formAlert.innerHTML = '';
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideAlert();

        const formData = new FormData(form);
        const requiredFields = [
            'nome', 'estado', 'telefone', 'email',
            'valor_precatorio', 'numero_processo', 'aceito_privacidade'
        ];

        for (let field of requiredFields) {
            if (!formData.get(field)) {
                showAlert('warning', 'Por favor, preencha todos os campos obrigatórios.');
                return;
            }
        }

        const textoOriginal = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        fetch('mails/enviar.php', { method: 'POST', body: formData })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                submitBtn.disabled = false;
                submitBtn.textContent = textoOriginal;
                if (data.sucesso) {
                    showAlert('success', 'Formulário enviado com sucesso!');
                    form.reset();
                } else {
                    showAlert('danger', data.mensagem || 'Ocorreu um erro ao enviar o formulário. Tente novamente mais tarde.');
                }
            })
            .catch(function (error) {
                submitBtn.disabled = false;
                submitBtn.textContent = textoOriginal;
                showAlert('danger', 'Erro ao enviar o formulário. Tente novamente mais tarde.');
                console.error('Error:', error);
            });
    });
})();