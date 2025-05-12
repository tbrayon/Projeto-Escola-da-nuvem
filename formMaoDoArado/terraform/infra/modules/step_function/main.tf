resource "aws_sfn_state_machine" "verification_flow" {
  name     = "${var.project_name}-state-machine"
  role_arn = aws_iam_role.step_function_role.arn

  definition = jsonencode({
    Comment = "Fluxo de verificação de identidade"
    StartAt = "Extrair Texto com Textract"
    States = {
      "Extrair Texto com Textract" = {
        Type     = "Task"
        Resource = "arn:aws:states:::aws-sdk:textract:analyzeDocument"
        Parameters = {
          "Document": {
            "S3Object": {
              "Bucket.$": "$.Bucket",
              "Name.$": "$.DocumentKey"
            }
          },
          "FeatureTypes": ["FORMS"]
        }
        ResultPath = "$.textractResult"
        Next      = "Comparar Faces com Rekognition"
        Catch = [{
          ErrorEquals = ["States.ALL"],
          ResultPath  = "$.error",
          Next        = "Falha"
        }]
      }

      "Comparar Faces com Rekognition" = {
        Type     = "Task"
        Resource = "arn:aws:states:::aws-sdk:rekognition:compareFaces"
        Parameters = {
          "SourceImage": {
            "S3Object": {
              "Bucket.$": "$.Bucket",
              "Name.$": "$.SelfieKey"
            }
          },
          "TargetImage": {
            "S3Object": {
              "Bucket.$": "$.Bucket",
              "Name.$": "$.DocumentKey"
            }
          },
          "SimilarityThreshold": 80
        }
        ResultPath = "$.rekognitionResult"
        Next      = "Processar Verificação"
        Catch = [{
          ErrorEquals = ["States.ALL"],
          ResultPath  = "$.error",
          Next        = "Falha"
        }]
      }

      "Processar Verificação" = {
        Type     = "Task"
        Resource = var.lambda_arn
        End      = false
        Next     = "Verificar Resultado"
      }

      "Verificar Resultado" = {
        Type = "Choice"
        Choices = [
          {
            Variable = "$.status"
            StringEquals = "success"
            Next = "Sucesso"
          }
        ]
        Default = "Falha"
      }

      "Sucesso" = {
        Type = "Succeed"
      }

      "Falha" = {
        Type     = "Task"
        Resource = "arn:aws:states:::sns:publish"
        Parameters = {
          TopicArn = var.sns_topic_arn
          Message  = "Falha na verificação de identidade. Revisão manual necessária."
          Subject  = "Alerta de verificação"
        }
        End = true
      }
    }
  })
}

resource "aws_iam_role" "step_function_role" {
  name = "${var.project_name}-step-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "states.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "step_function_policy" {
  name = "${var.project_name}-step-policy"
  role = aws_iam_role.step_function_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "lambda:InvokeFunction"
        ],
        Resource = var.lambda_arn
      },
      {
        Effect = "Allow",
        Action = "sns:Publish",
        Resource = var.sns_topic_arn
      },
      {
        Effect = "Allow",
        Action = [
          "textract:AnalyzeDocument"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "rekognition:CompareFaces"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject"
        ],
        Resource = [
          "arn:aws:s3:::${var.project_name}-documents/*",
          "arn:aws:s3:::${var.project_name}-selfies/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject"
        ],
        Resource = "arn:aws:s3:::${var.project_name}-extractions/*"
      }
    ]
  })
}
