import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Youtube, Loader2 } from 'lucide-react';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { useToast } from '@/hooks/use-toast';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const FileUploadModal = ({ isOpen, onClose, onUploadSuccess }: FileUploadModalProps) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'youtube'>('pdf');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { processFile, processYouTubeUrl, isProcessing } = useFileProcessor();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const result = await processFile(files[0]);
      if (result) {
        onUploadSuccess();
        onClose();
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const result = await processFile(files[0]);
      if (result) {
        onUploadSuccess();
        onClose();
      }
    }
  };

  const handleYouTubeSubmit = async () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    const result = await processYouTubeUrl(youtubeUrl);
    if (result) {
      setYoutubeUrl('');
      onUploadSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Upload Study Material</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Tab Selector */}
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('pdf')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'pdf'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              PDF Upload
            </button>
            <button
              onClick={() => setActiveTab('youtube')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'youtube'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Youtube className="w-4 h-4 inline mr-2" />
              YouTube Link
            </button>
          </div>

          {/* PDF Upload Tab */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-gobez-green bg-gobez-green/5'
                    : 'border-muted-foreground/25 hover:border-gobez-green/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your PDF here, or click to select
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isProcessing}
                />
                <Button 
                  variant="outline" 
                  className="cursor-pointer" 
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Select PDF File'
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum file size: 20MB
                </p>
              </div>
            </div>
          )}

          {/* YouTube URL Tab */}
          {activeTab === 'youtube' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">YouTube Video URL</label>
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground">
                  Video duration must be 30 minutes or less
                </p>
              </div>
              
              <Button 
                onClick={handleYouTubeSubmit}
                className="w-full"
                disabled={isProcessing || !youtubeUrl.trim()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Video...
                  </>
                ) : (
                  'Process YouTube Video'
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;