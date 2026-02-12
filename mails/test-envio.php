<?php

$_POST = [
    'nome' => 'Teste',
    'estado' => 'SP',
    'telefone' => '11999999999',
    'email' => 'teste@teste.com',
    'valor_precatorio' => '10000',
    'numero_processo' => '123456',
    'aceito_privacidade' => '1',
];
include __DIR__ . '/enviar.php';
