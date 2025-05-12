# Flow Description

1. O usuário preenche o formulário e carrega documentos (rg/id) e selfie através do next.js front-end.

2. O front-end solicita URLs pré-assinados do gateway da API para fazer upload de arquivos diretamente para S3.

3. Os arquivos são enviados para os respectivos baldes S3 (documentos e selfies).

4. O front-end chama a API Gateway para iniciar o processo de verificação.

5. A função lambda inicia o fluxo de trabalho das funções de etapa.

6. Funções de etapa orquestra o processo de verificação:
   - Extrair texto de documentos usando o Textract
   - compara selfie com a foto do documento usando rekognition
   - valida dados extraídos contra dados fornecidos pelo usuário

7. Se a verificação for bem -sucedida, o fluxo de trabalho será concluído com êxito.

8. Se a verificação falhar, o SNS enviará notificação para revisão manual.

9. O front -end exibe o status de verificação para o usuário.

## Segurança

- Iam papéis com acesso menos privilegiado
- S3 buckets com permissões apropriadas
- Gateway da API com validação de solicitação adequada