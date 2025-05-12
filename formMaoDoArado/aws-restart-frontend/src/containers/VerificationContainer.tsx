import VerificationForm from '@/components/VerificationForm';
export default function VerificationContainer() {
    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Verificação de Identidade</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Preencha o formulário e envie seus documentos para verificação
                    </p>
                </div>
                <VerificationForm />
            </div>
        </div>
    );
}
