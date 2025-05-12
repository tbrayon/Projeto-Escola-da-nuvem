module "s3" {
  source       = "./modules/s3"
  project_name = var.project_name
  bucket_documents = "${var.project_name}-documents"
  bucket_selfies = "${var.project_name}-selfies"
  bucket_extractions = "${var.project_name}-extractions"
}

module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
}

module "sns" {
  source       = "./modules/sns"
  name = "${var.project_name}-alerts"
}

module "step_function" {
  source        = "./modules/step_function"
  project_name  = var.project_name
  lambda_arn    = module.lambda.lambda_arn
  sns_topic_arn = module.sns.alert_topic_arn
}

module "lambda" {
  source           = "./modules/lambda"
  project_name     = var.project_name
  file_name        = "lambda.zip"
  lambda_role_arn  = module.iam.lambda_role_arn
  step_function_arn = module.step_function.state_machine_arn
  depends_on       = [module.step_function]
}

module "api_gateway" {
  source       = "./modules/api_gateway"
  project_name = var.project_name
  lambda_arn   = module.lambda.lambda_arn
}

