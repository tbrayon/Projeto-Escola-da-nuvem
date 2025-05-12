'use client'
import { useState, ChangeEvent, FormEvent } from 'react';
import { FormData } from '@/types/form';
import { UploadStatus, VerificationStatus } from '@/types/upload';
import { getUploadUrl, uploadToS3 } from '@/services/uploadService';
import { startVerification } from '@/services/verificationService';

export default function useVerificationForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        cpf: '',
        birthDate: '',
        email: '',
    });

    const [document, setDocument] = useState<File | null>(null);
    const [selfie, setSelfie] = useState<File | null>(null);
    const [documentName, setDocumentName] = useState('');
    const [selfieName, setSelfieName] = useState('');
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDocument(file);
            setDocumentName(file.name);
        }
    };

    const handleSelfieChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelfie(file);
            setSelfieName(file.name);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!document || !selfie) {
            setMessage('Por favor, envie o documento e a selfie.');
            return;
        }

        try {
            setUploadStatus('uploading');
            setMessage('Enviando arquivos...');

            const docRes = await getUploadUrl('document');
            const selfieRes = await getUploadUrl('selfie');

            await uploadToS3(document, docRes.data.URL);
            await uploadToS3(selfie, selfieRes.data.URL);

            setUploadStatus('success');
            setMessage('Arquivos enviados com sucesso. Iniciando verificação...');

            setVerificationStatus('pending');
            const status = await startVerification(
                docRes.data.BucketName,
                docRes.data.Key,
                selfieRes.data.Key
            );

            if (status === 'success') {
                setVerificationStatus('success');
                setMessage('Verificação iniciada com sucesso.');
            } else {
                throw new Error('Erro ao iniciar a verificação');
            }
        } catch (error: any) {
            setUploadStatus('error');
            setVerificationStatus('error');
            setMessage(error.message || 'Ocorreu um erro no processo.');
        }
    };

    return {
        formData,
        handleInputChange,
        handleSubmit,
        handleDocumentChange,
        handleSelfieChange,
        documentName,
        selfieName,
        uploadStatus,
        verificationStatus,
        message,
    };
}
