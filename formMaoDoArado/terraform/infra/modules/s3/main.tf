resource "aws_s3_bucket" "documents" {
  bucket = var.bucket_documents
  force_destroy = true
}

resource "aws_s3_bucket" "selfies" {
  bucket = var.bucket_selfies
  force_destroy = true
}

resource "aws_s3_bucket" "extractions" {
  bucket = var.bucket_extractions
  force_destroy = true
}
