import { useCallback, useRef, useState, type DragEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileArchive } from "lucide-react";
import { cn } from "@/utils/cn";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
}

export function UploadZone({ onFileSelected, selectedFile }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={selectedFile ? `Selected file: ${selectedFile.name}. Click to choose a different file.` : "Upload project zip file. Drag and drop, or activate to browse."}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={cn(
        "relative cursor-pointer rounded-xl2 border-2 border-dashed transition-all duration-300 py-16 px-8 text-center overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan",
        isDragging
          ? "border-accent-cyan bg-accent-cyan/5 scale-[1.01]"
          : "border-border bg-surface/40 hover:border-accent-indigo/40 hover:bg-surface/60"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />

      <motion.div
        animate={{ y: isDragging ? -4 : 0 }}
        className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-signal-gradient-soft border border-accent-indigo/20 flex items-center justify-center"
      >
        {selectedFile ? (
          <FileArchive size={26} className="text-accent-cyan" />
        ) : (
          <UploadCloud size={26} className="text-accent-cyan" />
        )}
      </motion.div>

      {selectedFile ? (
        <>
          <p className="text-ink font-medium mb-1">{selectedFile.name}</p>
          <p className="text-sm text-ink-muted">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB — ready to analyze
          </p>
        </>
      ) : (
        <>
          <p className="text-ink font-medium mb-1">Drag and drop your project .zip here</p>
          <p className="text-sm text-ink-muted">or click to browse — max 100MB</p>
        </>
      )}
    </div>
  );
}
