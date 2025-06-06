import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('🏢 Protocol Backend API')
    .setDescription(
      `
<div style="max-width: 800px; margin: 0 auto">
  <h2 style="color: #333; margin-bottom: 20px">
    Sistema de Gerenciamento de Protocolos e Requisições
  </h2>

  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 30px">
    API completa para gerenciamento de protocolos e requisições em uma organização.
  </p>

  <div style="margin-bottom: 40px">
    <h3 style="color: #2557a7">✨ Principais Funcionalidades</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
      <div>
        <h4>🔐 Autenticação Segura</h4>
        <ul style="list-style-type: none; padding-left: 15px">
          <li>JWT Token</li>
          <li>Controle de Papéis</li>
          <li>Proteção de Rotas</li>
        </ul>
      </div>
      <div>
        <h4>👥 Gestão de Usuários</h4>
        <ul style="list-style-type: none; padding-left: 10px">
          <li>Cadastro e Atualização</li>
          <li>Níveis de Acesso</li>
          <li>Recuperação de Senha</li>
        </ul>
      </div>
      <div>
        <h4>📋 Protocolos</h4>
        <ul style="list-style-type: none; padding-left: 15px">
          <li>Criação e Edição</li>
          <li>Acompanhamento de Status</li>
          <li>Histórico de Alterações</li>
        </ul>
      </div>
      <div>
        <h4>📸 Gestão de Fotos</h4>
        <ul style="list-style-type: none; padding-left: 15px">
          <li>Upload Múltiplo</li>
          <li>Armazenamento Seguro</li>
          <li>Limite de 5 Imagens</li>
        </ul>
      </div>
    </div>
  </div>

  <div style="margin-bottom: 40px">
    <h3 style="color: #2557a7">🎯 Níveis de Acesso</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; table-layout: fixed;">
      <colgroup>
        <col style="width: 25%" />
        <col style="width: 25%" />
        <col style="width: 50%" />
      </colgroup>
      <thead>
        <tr style="background-color: #f8f9fa">
          <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6; font-weight: 600;">Papel</th>
          <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6; font-weight: 600;">Descrição</th>
          <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6; font-weight: 600;">Permissões</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6;">👑 ADMIN</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">Administrador</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">Acesso total ao sistema</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6;">🛡️ MODERATOR</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">Moderador</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">Gerenciamento de requisições</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6;">👤 USER</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">Usuário</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">Criação e acompanhamento</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div>
    <h3 style="color: #2557a7">📌 Informações Importantes</h3>
    <ul style="list-style-type: none; padding-left: 15px; margin-top: 20px">
      <li style="margin-bottom: 10px">⚡ Autenticação via Bearer Token JWT</li>
      <li style="margin-bottom: 10px">⏱️ Tokens expiram em 24 horas</li>
      <li style="margin-bottom: 10px">📤 Máximo de 5 fotos por requisição</li>
      <li style="margin-bottom: 10px">🔒 Todas as rotas são protegidas por autenticação</li>
    </ul>
  </div>
</div>
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .setContact(
      'Equipe de Desenvolvimento',
      'https://github.com/seu-usuario',
      'contato@exemplo.com',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
