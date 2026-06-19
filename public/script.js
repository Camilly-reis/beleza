const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuarioDigitado = document.getElementById('usuario').value;
        const senhaDigitada = document.getElementById('senha').value;

        // Credenciais obrigatórias exigidas no roteiro
        if (usuarioDigitado === 'admin' && senhaDigitada === '123456') {
            localStorage.setItem('admin_logado', 'true');
            window.location.href = 'admin.html';
        } else {
            const erro = document.getElementById('erroLogin');
            if (erro) {
                erro.classList.remove('d-none');
            }
        }
    });
}
