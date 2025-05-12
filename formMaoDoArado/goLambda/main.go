package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/sfn"
)

type VerificationInput struct {
	Bucket      string `json:"bucket"`
	DocumentKey string `json:"document_key"`
	SelfieKey   string `json:"selfie_key"`
}

type StartExecutionInput struct {
	Bucket      string `json:"bucket"`
	DocumentKey string `json:"document_key"`
	SelfieKey   string `json:"selfie_key"`
}

type UploadURLInput struct {
	FileType string `json:"file_type"` // "document" or "selfie"
}

type UploadURLResponse struct {
	URL       string `json:"url"`
	Key       string `json:"key"`
	BucketName string `json:"bucket_name"`
}

type OutputResponse struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Determine which endpoint was called based on the path
	switch request.Path {
	case "/verificar":
		return handleVerification(ctx, request)
	case "/upload-url":
		return handleUploadURL(ctx, request)
	default:
		return createResponse(404, OutputResponse{
			Status:  "error",
			Message: "Unknown endpoint",
		})
	}
}

func handleVerification(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var input VerificationInput
	err := json.Unmarshal([]byte(request.Body), &input)
	if err != nil {
		return createResponse(400, OutputResponse{
			Status:  "error",
			Message: "Invalid input: " + err.Error(),
		})
	}

	stepArn := os.Getenv("STEP_FUNCTION_ARN")
	if stepArn == "" {
		return createResponse(500, OutputResponse{
			Status:  "error",
			Message: "STEP_FUNCTION_ARN not set",
		})
	}

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return createResponse(500, OutputResponse{
			Status:  "error",
			Message: "Failed to load AWS config: " + err.Error(),
		})
	}

	sfnClient := sfn.NewFromConfig(cfg)

	payload := StartExecutionInput{
		Bucket:      input.Bucket,
		DocumentKey: input.DocumentKey,
		SelfieKey:   input.SelfieKey,
	}

	inputBytes, err := json.Marshal(payload)
	if err != nil {
		return createResponse(500, OutputResponse{
			Status:  "error",
			Message: "Failed to marshal input: " + err.Error(),
		})
	}

	_, err = sfnClient.StartExecution(ctx, &sfn.StartExecutionInput{
		StateMachineArn: aws.String(stepArn),
		Input:           aws.String(string(inputBytes)),
	})

	if err != nil {
		return createResponse(500, OutputResponse{
			Status:  "error",
			Message: "Failed to start Step Function: " + err.Error(),
		})
	}

	return createResponse(200, OutputResponse{
		Status:  "started",
		Message: "Step Function execution started",
	})
}

func handleUploadURL(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var input UploadURLInput
	err := json.Unmarshal([]byte(request.Body), &input)
	if err != nil {
		return createResponse(400, OutputResponse{
			Status:  "error",
			Message: "Invalid input: " + err.Error(),
		})
	}

	// Determine which bucket to use based on the file type
	var bucketName string
	projectName := os.Getenv("PROJECT_NAME")
	if projectName == "" {
		projectName = "aws-restart" // Default project name
	}

	switch input.FileType {
	case "document":
		bucketName = fmt.Sprintf("%s-documents", projectName)
	case "selfie":
		bucketName = fmt.Sprintf("%s-selfies", projectName)
	default:
		return createResponse(400, OutputResponse{
			Status:  "error",
			Message: "Invalid file type. Must be 'document' or 'selfie'",
		})
	}

	// Generate a unique key for the file
	key := fmt.Sprintf("%s/%s", input.FileType, fmt.Sprintf("%d-%s", time.Now().Unix(), input.FileType))

	// Create a pre-signed URL for uploading the file
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		return createResponse(500, OutputResponse{
			Status:  "error",
			Message: "Failed to load AWS config: " + err.Error(),
		})
	}

	s3Client := s3.NewFromConfig(cfg)
	presignClient := s3.NewPresignClient(s3Client)

	presignedReq, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(key),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Minute * 5 // URL expires in 5 minutes
	})

	if err != nil {
		return createResponse(500, OutputResponse{
			Status:  "error",
			Message: "Failed to generate pre-signed URL: " + err.Error(),
		})
	}

	return createResponse(200, OutputResponse{
		Status:  "success",
		Message: "Pre-signed URL generated",
		Data: UploadURLResponse{
			URL:       presignedReq.URL,
			Key:       key,
			BucketName: bucketName,
		},
	})
}

func createResponse(statusCode int, body interface{}) (events.APIGatewayProxyResponse, error) {
	bodyBytes, err := json.Marshal(body)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       fmt.Sprintf(`{"status":"error","message":"Failed to marshal response: %s"}`, err.Error()),
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: statusCode,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body: string(bodyBytes),
	}, nil
}

func main() {
	lambda.Start(handler)
}


//GOOS=linux GOARCH=amd64 go build -o main main.go
//zip lambda.zip main
