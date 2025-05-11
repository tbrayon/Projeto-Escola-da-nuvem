# 2 - Levantamento de Requisitos: 

##  Requisistos Funcionais:


- Receber uploads de documentos e imagens de usuários (RG, CNH, selfies, etc.):
  Serviço AWS: Amazon S3

- Extrair dados textuais dos documentos enviados:
  Serviço AWS: Amazon Textract

- Executar reconhecimento facial entre o documento e a selfie:
  Serviço AWS: Amazon Rekognition

- Validar automaticamente os dados extraídos, garantindo consistência e formato esperado:
  Serviço AWS: Amazon Lambda 

- Notificar falhas de verificação para o usuário via email ou sistema:
  Serviço AWS:  Amazon SNS

- Registrar todas as etapas do processo para auditoria e rastreabilidade:
  Serviço AWS: Amazon CloudWatch Logs, AWS CloudTrail

- Controlar o fluxo do processo automaticamente.
  Serviço AWS: AWS Step Functions 

- Garantir autenticação e controle de acesso aos dados sensíveis:
  Serviço AWS: AWS IAM, Cognito

## Requisitos Não Funcionais: 
- Ser altamente disponível e escalável para atender picos de acesso:
  Serviço AWS: Elastic Load Balancer + Auto Scaling

- Manter a confidencialidade e integridade dos dados.
  Serviço AWS: AWS KMS (Key Management Service), S3 com criptografia

- Oferecer tempo de resposta rápido (baixo tempo de latência) nos processos de verificação:
  Serviço AWS: AWS Lambda + Amazon Rekognition
  
- Ser tolerante a falhas, com monitoramento e alertas em caso de erros:
  Serviço AWS: CloudWatch + SNS

- Garantir a conformidade com LGPD/GDPR, mantendo logs e gestão de consentimento:
  Serviço AWS: AWS CloudTrail
  
- Permitir fácil integração com APIs externas ou internas:
  Serviço AWS: API Gateway + Lambda

## MVP (Produto Mínimo Viavel) :

Objetivo: Validar a identidade de um usuário ao enviar um documento e uma selfie.

- Componentes do MVP:
  Upload de documentos e imagem do rosto.
  Frontend simples com upload.
  Armazenamento em Amazon S3 com políticas de segurança.

- Extração de dados:
  Processamento automático usando Amazon Textract para extrair nome, CPF, data de nascimento, etc.
  Reconhecimento facial
  Comparação da selfie com a imagem do documento via Amazon Rekognition.

- Validação de dados:
  Lógica em AWS Lambda ou API Gateway + Lambda que valida o CPF e consistência dos dados.

- Orquestração:
  AWS Step Functions para gerenciar o fluxo de etapas (upload → extração → comparação → validação).

- Notificações:
  Envio de email de sucesso ou erro com Amazon SNS.

- Segurança:
  IAM Roles e criptografia com KMS.
  Autenticação via Amazon Cognito se necessário.

- Monitoramento:
  Uso de CloudWatch Logs e alarmes para falhas em qualquer etapa.

## Resumo Final

![image](https://github.com/user-attachments/assets/a1d27f87-2e5e-4f30-a9d1-0cc43d0793b1)
