# AI Studio — versão inicial Android (PWA)

Este pacote contém uma primeira versão instalável no Android como aplicativo web (PWA). Ela inclui:
- Tela de confirmação 18+.
- Interface para preparar pedidos de geração de imagem e foto-para-vídeo.
- Pré-visualização de fotos.
- Galeria local com IndexedDB.
- Cache básico para abrir a interface offline depois da primeira visita.

## Importante: o que ainda não está conectado
Os botões “Preparar geração” não geram mídia ainda. Para geração real, é necessário conectar um provedor de imagem e outro de foto-para-vídeo (ou um serviço que ofereça ambos). Esses serviços podem cobrar por uso, limitar créditos gratuitos ou exigir conta. Não existe garantia de geração ilimitada gratuita.

Não coloque tokens/API keys no `app.js` nem no aplicativo Android: qualquer pessoa que obtenha o pacote pode extraí-los. O caminho correto é um pequeno backend que guarda as chaves com segurança.

## Instalar no Android — opção simples
1. Publique esta pasta em uma hospedagem HTTPS (por exemplo, GitHub Pages).
2. Abra o endereço HTTPS no Chrome do Android.
3. No menu do Chrome, toque em **Instalar app** ou **Adicionar à tela inicial**.
4. Abra o AI Studio pelo ícone criado.

O PWA não exige Android Studio nem computador potente. A hospedagem estática pode ter plano gratuito, sujeita às regras do provedor.

## Testar localmente
Service workers exigem HTTPS ou `localhost`. Abra a pasta por um servidor local, não diretamente pelo arquivo `index.html`.

## Próxima etapa técnica
Criar um backend seguro com:
- endpoint `/api/image` para geração de imagens;
- endpoint `/api/image-to-video` para animação;
- autenticação privada;
- limites de uso e validação de consentimento;
- armazenamento privado de resultados.

## Uso responsável
Use apenas fotos próprias ou de adultos que tenham autorizado expressamente o uso. Não produza nem compartilhe conteúdo íntimo falso de pessoas reais sem consentimento. Não use imagens de menores em conteúdo sexual.
