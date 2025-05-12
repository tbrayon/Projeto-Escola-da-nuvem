output "state_machine_arn" {
  value = aws_sfn_state_machine.verification_flow.arn
  description = "ARN of the Step Function state machine"
}