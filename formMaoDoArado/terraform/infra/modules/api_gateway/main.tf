resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
}

resource "aws_api_gateway_rest_api" "verificacao_api" {
  name        = "${var.project_name}-api"
  description = "API para iniciar processo de verificação de documentos"
}

resource "aws_api_gateway_resource" "verificar" {
  rest_api_id = aws_api_gateway_rest_api.verificacao_api.id
  parent_id   = aws_api_gateway_rest_api.verificacao_api.root_resource_id
  path_part   = "verificar"
}

resource "aws_api_gateway_method" "post_verificar" {
  rest_api_id   = aws_api_gateway_rest_api.verificacao_api.id
  resource_id   = aws_api_gateway_resource.verificar.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_proxy" {
  rest_api_id             = aws_api_gateway_rest_api.verificacao_api.id
  resource_id             = aws_api_gateway_resource.verificar.id
  http_method             = aws_api_gateway_method.post_verificar.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arn
}

resource "aws_api_gateway_resource" "upload_url" {
  rest_api_id = aws_api_gateway_rest_api.verificacao_api.id
  parent_id   = aws_api_gateway_rest_api.verificacao_api.root_resource_id
  path_part   = "upload-url"
}

resource "aws_api_gateway_method" "post_upload_url" {
  rest_api_id   = aws_api_gateway_rest_api.verificacao_api.id
  resource_id   = aws_api_gateway_resource.upload_url.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "upload_url_lambda_proxy" {
  rest_api_id             = aws_api_gateway_rest_api.verificacao_api.id
  resource_id             = aws_api_gateway_resource.upload_url.id
  http_method             = aws_api_gateway_method.post_upload_url.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_arn
}

locals {
  lambda_function_name = element(split(":", var.lambda_arn), length(split(":", var.lambda_arn)) - 1)
}

resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = local.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.verificacao_api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [aws_api_gateway_integration.lambda_proxy]
  rest_api_id = aws_api_gateway_rest_api.verificacao_api.id
  stage_name  = "prod"
}
