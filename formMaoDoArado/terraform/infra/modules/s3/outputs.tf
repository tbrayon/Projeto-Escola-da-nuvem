output "documents_bucket" {
  value = aws_s3_bucket.documents
}

output "selfies_bucket" {
  value = aws_s3_bucket.selfies
}

output "extractions_bucket" {
  value = aws_s3_bucket.extractions
}
