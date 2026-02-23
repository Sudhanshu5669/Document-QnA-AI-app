import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader, CloudUpload, X } from "lucide-react";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleFileChange = e => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleDragOver = e => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = e => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const clearFile = e => {
    e.stopPropagation();
    setFile(null);
    setMessage("");
    setStatus("idle");
  };

  const handleUpload = async () => {
    if (!file) { setMessage("Please select a file first."); setStatus("error"); return; }
    setIsUploading(true);
    setStatus("idle");
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (response.status === 401 || response.status === 403) {
        setMessage("You must be logged in to upload.");
        setStatus("error");
        return;
      }
      const data = await response.json();
      if (data.success) {
        setMessage("Document processed and indexed.");
        setStatus("success");
        setFile(null);
      } else {
        setMessage(data.error || "Upload failed.");
        setStatus("error");
      }
    } catch {
      setMessage("Server error. Check your backend connection.");
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 4rem)',
      padding: '2rem',
      fontFamily: "'Syne', sans-serif",
      color: '#F0EBE1',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '620px' }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: 'rgba(228,168,56,0.1)',
            border: '1px solid rgba(228,168,56,0.2)',
            borderRadius: '6px',
            padding: '0.3rem 0.75rem',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#E4A838',
            marginBottom: '1rem',
          }}>
            Document Upload
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 600,
            fontStyle: 'italic',
            color: '#F0EBE1',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            marginBottom: '0.5rem',
          }}>
            Add your documents.
          </h1>
          <p style={{ color: '#7A756E', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Upload a PDF to index it for AI-powered querying.
          </p>
        </motion.div>

        {/* Drop Zone */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging
              ? 'rgba(228,168,56,0.6)'
              : file
                ? 'rgba(228,168,56,0.3)'
                : 'rgba(255,255,255,0.07)',
            background: isDragging
              ? 'rgba(228,168,56,0.04)'
              : 'rgba(22,22,26,0.6)',
          }}
          transition={{ duration: 0.2 }}
          style={{
            border: '1px dashed',
            borderRadius: '12px',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            overflow: 'hidden',
          }}
        >
          {/* Subtle corner accents */}
          {[
            { top: 0, left: 0, borderTopLeftRadius: '12px' },
            { top: 0, right: 0, borderTopRightRadius: '12px' },
            { bottom: 0, left: 0, borderBottomLeftRadius: '12px' },
            { bottom: 0, right: 0, borderBottomRightRadius: '12px' },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '12px', height: '12px',
              border: '2px solid rgba(228,168,56,0.4)',
              borderTop: i < 2 ? '2px solid rgba(228,168,56,0.4)' : 'none',
              borderBottom: i >= 2 ? '2px solid rgba(228,168,56,0.4)' : 'none',
              borderLeft: i % 2 === 0 ? '2px solid rgba(228,168,56,0.4)' : 'none',
              borderRight: i % 2 === 1 ? '2px solid rgba(228,168,56,0.4)' : 'none',
              ...pos,
            }} />
          ))}

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{
              position: 'absolute', inset: 0,
              opacity: 0, cursor: 'pointer', width: '100%', height: '100%',
            }}
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
              >
                <motion.div
                  animate={{ y: isDragging ? -6 : [0, -6, 0] }}
                  transition={{ duration: isDragging ? 0.2 : 3, repeat: isDragging ? 0 : Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '64px', height: '64px',
                    borderRadius: '14px',
                    background: 'rgba(228,168,56,0.08)',
                    border: '1px solid rgba(228,168,56,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <CloudUpload size={28} color={isDragging ? '#E4A838' : '#7A756E'} style={{ transition: 'color 0.2s' }} />
                </motion.div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: isDragging ? '#E4A838' : '#F0EBE1', marginBottom: '0.35rem', transition: 'color 0.2s' }}>
                    {isDragging ? 'Release to upload' : 'Drop PDF here or click to browse'}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#3E3C38', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>
                    PDF · max 10 MB
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(228,168,56,0.1)', border: '1px solid rgba(228,168,56,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FileText size={22} color="#E4A838" />
                </div>
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.9rem', fontWeight: 600, color: '#F0EBE1',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '260px',
                  }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#7A756E', marginTop: '0.2rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px', padding: '0.35rem', cursor: 'pointer',
                    color: '#7A756E', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 2, flexShrink: 0,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(217,95,75,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Upload Button */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <motion.button
            onClick={handleUpload}
            disabled={!file || isUploading}
            whileHover={file && !isUploading ? { scale: 1.01 } : {}}
            whileTap={file && !isUploading ? { scale: 0.99 } : {}}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '8px',
              background: file && !isUploading ? '#E4A838' : 'rgba(255,255,255,0.04)',
              border: '1px solid',
              borderColor: file && !isUploading ? 'transparent' : 'rgba(255,255,255,0.07)',
              color: file && !isUploading ? '#0B0B0D' : '#3E3C38',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.04em',
              cursor: file && !isUploading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: file && !isUploading ? '0 4px 20px rgba(228,168,56,0.2)' : 'none',
            }}
          >
            {isUploading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Loader size={16} />
                </motion.div>
                Processing document...
              </>
            ) : (
              <><UploadIcon size={16} /> Upload Document</>
            )}
          </motion.button>

          {/* Status */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.75rem 1rem', borderRadius: '8px',
                  background: status === 'error' ? 'rgba(217,95,75,0.08)' : status === 'success' ? 'rgba(77,168,130,0.08)' : 'transparent',
                  border: `1px solid ${status === 'error' ? 'rgba(217,95,75,0.25)' : status === 'success' ? 'rgba(77,168,130,0.25)' : 'transparent'}`,
                  color: status === 'error' ? '#D95F4B' : status === 'success' ? '#4DA882' : '#7A756E',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                {status === 'success' && <CheckCircle size={16} />}
                {status === 'error' && <AlertCircle size={16} />}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default Upload;