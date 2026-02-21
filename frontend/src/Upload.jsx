import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader, CloudUpload } from "lucide-react";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      setStatus("error");
      return;
    }

    setIsUploading(true);
    setStatus("idle");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // sends the auth cookie to the backend
      });

      if (response.status === 401 || response.status === 403) {
        setMessage("You must be logged in to upload documents.");
        setStatus("error");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMessage("Upload successful! Document processed.");
        setStatus("success");
        setFile(null);
      } else {
        setMessage(data.error || "Upload failed");
        setStatus("error");
      }
    } catch (err) {
      setMessage("Server error. Check backend connection.");
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
      color: 'var(--text-primary)',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', maxWidth: '700px' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              background: 'var(--gradient-primary)',
              padding: '1.25rem',
              borderRadius: '20px',
              marginBottom: '1.5rem',
              boxShadow: 'var(--glow-strong)'
            }}
          >
            <CloudUpload size={48} color="#000" />
          </motion.div>
          <h2 style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            Upload Documents
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            Drop your PDF files here to get started
          </p>
        </div>

        {/* Dropzone */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? 'var(--accent-primary)' : 'var(--border-color)',
            background: isDragging
              ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)'
              : 'var(--bg-glass)',
            scale: isDragging ? 1.02 : 1
          }}
          transition={{ duration: 0.3 }}
          style={{
            border: '2px dashed',
            borderRadius: '24px',
            padding: '4rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: isDragging ? 'var(--glow-strong)' : 'var(--shadow-lg)'
          }}
        >
          {/* Gradient Border Animation */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'var(--gradient-primary)',
                opacity: 0.1,
                pointerEvents: 'none'
              }}
            />
          )}

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
              >
                <motion.div
                  animate={{
                    y: isDragging ? -5 : [0, -10, 0],
                    rotate: isDragging ? [0, -5, 5, 0] : 0
                  }}
                  transition={{
                    y: { duration: isDragging ? 0.3 : 2, repeat: isDragging ? 0 : Infinity },
                    rotate: { duration: 0.5 }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '2rem',
                    borderRadius: '50%',
                    border: '2px solid var(--border-color)'
                  }}
                >
                  <UploadIcon size={56} color={isDragging ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                </motion.div>
                <div>
                  <h3 style={{
                    fontSize: '1.35rem',
                    marginBottom: '0.5rem',
                    fontWeight: 700
                  }}>
                    {isDragging ? 'Drop your PDF here' : 'Drag & Drop PDF'}
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem'
                  }}>
                    or click to browse your files
                  </p>
                  <p style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>
                    Supported format: PDF
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    background: 'var(--gradient-primary)',
                    padding: '1.5rem',
                    borderRadius: '20px',
                    boxShadow: 'var(--glow-primary)'
                  }}
                >
                  <FileText size={64} color="#000" />
                </motion.div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem'
                  }}>
                    {file.name}
                  </h3>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      background: 'var(--gradient-primary)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      color: '#000'
                    }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Upload Button & Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <motion.button
            onClick={handleUpload}
            disabled={!file || isUploading}
            whileHover={{ scale: file && !isUploading ? 1.02 : 1 }}
            whileTap={{ scale: file && !isUploading ? 0.98 : 1 }}
            style={{
              width: '100%',
              padding: '1.25rem',
              borderRadius: '16px',
              background: file && !isUploading
                ? 'var(--gradient-primary)'
                : 'var(--bg-card)',
              color: file && !isUploading ? '#000' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '1.1rem',
              border: '2px solid var(--border-color)',
              cursor: (file && !isUploading) ? 'pointer' : 'not-allowed',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: file && !isUploading ? 'var(--glow-primary)' : 'none'
            }}
          >
            {isUploading ? (
              <>
                Processing
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader size={24} />
                </motion.div>
              </>
            ) : (
              <>
                <UploadIcon size={24} />
                Upload Document
              </>
            )}
          </motion.button>

          {/* Status Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  background: status === 'error'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : status === 'success'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(255, 255, 255, 0.03)',
                  border: `2px solid ${status === 'error' ? 'var(--accent-error)' : status === 'success' ? 'var(--accent-success)' : 'var(--border-color)'}`,
                  color: status === 'error'
                    ? 'var(--accent-error)'
                    : status === 'success'
                      ? 'var(--accent-success)'
                      : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {status === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircle size={24} />
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <AlertCircle size={24} />
                  </motion.div>
                )}
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Upload;