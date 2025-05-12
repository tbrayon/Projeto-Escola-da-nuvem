variable "project_name" {
  type = string
}

variable "lambda_role_arn" {
  type = string
}

variable "step_function_arn" {
  type = string
  default = ""
  description = "ARN of the Step Function state machine"
}

variable "file_name" {
  type = string
}
