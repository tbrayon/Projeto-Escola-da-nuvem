'use client';

import FileInput from '@/components/FileInput';
import TextInput from '@/components/TextInput';
import useVerificationForm from '@/hooks/useVerificationForm';

export default function VerificationForm() {
    const {
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
    } = useVerificationForm();

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-xl space-y-8"
        >
            <div className="grid gap-6 sm:grid-cols-2">
                <TextInput
                    id="name"
                    label="Nome completo"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome"
                />

                <TextInput
                    id="cpf"
                    label="CPF"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                />

                <TextInput
                    id="birthDate"
                    label="Data de nascimento"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                />

                <TextInput
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                />
            </div>

            <div className="space-y-4">
                <FileInput
                    label="Documento de identidade (PDF ou imagem)"
                    accept="application/pdf,image/*"
                    fileName={documentName}
                    onChange={handleDocumentChange}
                />

                <FileInput
                    label="Selfie"
                    accept="image/*"
                    fileName={selfieName}
                    onChange={handleSelfieChange}
                />
            </div>

            <button
                type="submit"
                disabled={uploadStatus === 'uploading' || verificationStatus === 'pending'}
                className="w-full py-3 px-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Enviar para verificação
            </button>

            {message && (
                <div
                    className={`mt-4 text-center text-sm font-medium ${
                        uploadStatus === 'error' || verificationStatus === 'error'
                            ? 'text-red-600'
                            : 'text-green-600'
                    }`}
                >
                    {message}
                </div>
            )}
        </form>
    );
}
