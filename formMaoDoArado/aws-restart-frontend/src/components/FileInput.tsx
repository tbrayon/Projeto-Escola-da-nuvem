import { ChangeEvent, useRef } from 'react';
import { UploadIcon } from 'lucide-react';

interface FileInputProps {
    label: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    fileName?: string;
    accept: string;
}

export default function FileInput({ label, onChange, fileName, accept }: FileInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-3">
                <input
                    type="file"
                    ref={inputRef}
                    onChange={onChange}
                    accept={accept}
                    className="sr-only"
                />
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                    <UploadIcon className="w-4 h-4" />
                    Selecionar arquivo
                </button>
                <span className="text-sm text-gray-600 truncate max-w-xs">
          {fileName ? (
              <span className="text-green-600 font-medium">{fileName}</span>
          ) : (
              'Nenhum arquivo selecionado'
          )}
        </span>
            </div>
        </div>
    );
}
