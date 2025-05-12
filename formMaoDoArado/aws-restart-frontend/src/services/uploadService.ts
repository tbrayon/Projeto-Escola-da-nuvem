import { UploadUrlResponse } from '@/types/upload';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const getUploadUrl = async (fileType: 'document' | 'selfie'): Promise<UploadUrlResponse> => {
    const res = await fetch(`${API_URL}/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_type: fileType }),
    });

    if (!res.ok) throw new Error('Erro ao obter URL de upload');
    return res.json();
};

export const uploadToS3 = async (file: File, url: string): Promise<void> => {
    const res = await fetch(url, {
        method: 'PUT',
        body: file,
    });

    if (!res.ok) throw new Error('Erro ao enviar arquivo para o S3');
};
