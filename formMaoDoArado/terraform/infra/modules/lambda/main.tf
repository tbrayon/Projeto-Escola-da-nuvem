resource "aws_lambda_function" "verification" {
  filename         = var.file_name
  function_name    = "${var.project_name}-verification"
  role             = var.lambda_role_arn
  handler          = "main"
  runtime          = "go1.x"
  source_code_hash = filebase64sha256(var.file_name)

  environment {
    variables = {
      PROJECT_NAME      = var.project_name
      STEP_FUNCTION_ARN = var.step_function_arn
    }
  }
}
