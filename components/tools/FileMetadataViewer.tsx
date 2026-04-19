import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image, Film, Music, X } from 'lucide-react';

interface FileData {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  preview?: string;
}

export const FileMetadataViewer: React.FC = () => {
  const [file, setFile] = useState<FileData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setFile({
      name: file.name,
      type: file.type || 'Unknown',
      size: file.size,
      lastModified: file.lastModified,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={48} className="text-purple-500" />;
    if (type.startsWith('video/')) return <Film size={48} className="text-red-500" />;
    if (type.startsWith('audio/')) return <Music size={48} className="text-blue-500" />;
    return <FileText size={48} className="text-gray-400" />;
  };

  return (
    <div className="space-y-6">
       {!file ? (
         <div 
           className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
             isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
           }`}
           onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
           onDragLeave={() => setIsDragging(false)}
           onDrop={handleDrop}
           onClick={() => fileInputRef.current?.click()}
         >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
              <UploadCloud size={32} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Drop a file here</h3>
            <p className="text-gray-500 mt-1">or click to browse</p>
         </div>
       ) : (
         <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
               <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <FileText size={16} /> File Analysis
               </h3>
               <button onClick={() => setFile(null)} className="text-gray-500 hover:text-red-600 transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 min-h-[200px]">
                  {file.preview ? (
                    <img src={file.preview} alt="Preview" className="max-h-48 rounded shadow-sm object-contain" />
                  ) : (
                    getIcon(file.type)
                  )}
                  <p className="mt-4 font-mono text-sm text-gray-500 break-all text-center">{file.name}</p>
               </div>
               
               <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">File Type</span>
                    <p className="font-mono text-gray-900 bg-gray-50 px-3 py-1 rounded border border-gray-100 mt-1 inline-block">
                      {file.type}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Size</span>
                      <p className="text-lg font-medium text-gray-900">{formatBytes(file.size)}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Modified</span>
                      <p className="text-lg font-medium text-gray-900">{new Date(file.lastModified).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Extension</span>
                     <p className="text-lg font-medium text-gray-900">
                       {file.name.split('.').pop()?.toUpperCase() || 'NONE'}
                     </p>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};