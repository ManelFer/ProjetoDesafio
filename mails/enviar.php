<?php
header('Content-Type: application/json');

$required = [
    'nome',
    'estado',
    'telefone',
    'email',
    'valor_precatorio',
    'numero_processo',
    'aceito_privacidade'
];

foreach ($required as $field) {
    if (empty($_POST[$field])) {
        echo json_encode([
            'sucesso' => false,
            'mensagem' => "O campo '$field' é obrigatório."
        ]);
        exit;
    }
}

$nome = htmlspecialchars($_POST['nome']);
$estado = htmlspecialchars($_POST['estado']);
$telefone = htmlspecialchars($_POST['telefone']);
$email = htmlspecialchars($_POST['email']);
$valor_precatorio = htmlspecialchars($_POST['valor_precatorio']);
$numero_processo = htmlspecialchars($_POST['numero_processo']);

$autoload = dirname(__DIR__) . '/vendor/autoload.php';
$configFile = __DIR__ . '/mail-config.php';

if (!file_exists($autoload)) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Dependências não instaladas. Execute: composer install'
    ]);
    exit;
}

if (!file_exists($configFile)) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Configure o e-mail. Copie mails/mail-config.example.php para mails/mail-config.php e preencha os dados SMTP.'
    ]);
    exit;
}

require $autoload;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$config = require $configFile;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_user'];
    $mail->Password   = $config['smtp_pass'];
    $mail->SMTPSecure = $config['smtp_secure'] ?? 'tls';
    $mail->Port       = $config['smtp_port'];
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($config['from_email'], $config['from_name'] ?? '');
    $destinatarios = is_array($config['to_email'])
        ? $config['to_email']
        : array_map('trim', explode(',', $config['to_email']));
    foreach ($destinatarios as $destino) {
        if ($destino !== '') {
            $mail->addAddress($destino);
        }
    }
    $mail->addReplyTo($email, $nome);

    $mail->isHTML(true);
    $mail->Subject = "Novo contato de $nome";
    $mail->Body    = "
    <html>
    <head><meta charset=\"UTF-8\"><title>Novo contato de $nome</title></head>
    <body>
        <h2>Detalhes do Contato</h2>
        <p><strong>Nome:</strong> $nome</p>
        <p><strong>Estado:</strong> $estado</p>
        <p><strong>Telefone:</strong> $telefone</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Valor do Precatório:</strong> $valor_precatorio</p>
        <p><strong>Número do Processo:</strong> $numero_processo</p>
    </body>
    </html>
    ";

    $mail->send();

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Email enviado com sucesso!'
    ]);
} catch (Exception $e) {
    $mensagem = 'Ocorreu um erro ao enviar o email. Por favor, tente novamente.';
    if (!empty($config['debug'])) {
        $mensagem = $e->getMessage();
    }
    echo json_encode([
        'sucesso' => false,
        'mensagem' => $mensagem
    ]);
}
