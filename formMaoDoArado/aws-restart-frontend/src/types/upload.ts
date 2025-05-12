export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
export type VerificationStatus = 'idle' | 'pending' | 'success' | 'error';

export interface UploadUrlResponse {
    data: {
        URL: string;
        Key: string;
        BucketName: string;
    };
}
