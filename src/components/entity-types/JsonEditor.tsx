'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

export function JsonEditor({
  value,
  onChange,
  height = '300px',
  readOnly = false,
}: JsonEditorProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <MonacoEditor
        height={height}
        language="json"
        theme="light"
        value={value}
        onChange={(val) => onChange(val || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          readOnly,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
