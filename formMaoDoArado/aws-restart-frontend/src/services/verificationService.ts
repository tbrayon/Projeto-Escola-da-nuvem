const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const startVerification = async (
    bucket: string,
    documentKey: string,
    selfieKey: string
): Promise<'success' | 'error'> => {
    const res = await fetch(`${API_URL}/verificar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket, document_key: documentKey, selfie_key: selfieKey }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== 'started') throw new Error(data.message || 'Erro na verificação');
    return 'success';
};
