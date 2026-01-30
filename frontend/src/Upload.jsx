import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Loader } from "lucide-react";

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
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Upload successful! Document processed.");
        setStatus("success");
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
      height: '100%',
      color: 'var(--text-primary)'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '600px' }}
      >
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Upload Documents
        </h2>

        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? 'var(--accent-primary)' : 'var(--border-color)',
            backgroundColor: isDragging ? 'rgba(0, 240, 255, 0.05)' : 'var(--bg-card)'
          }}
          style={{
            border: '2px dashed',
            borderRadius: '24px',
            padding: '4rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '1.5rem',
                  borderRadius: '50%'
                }}>
                  <UploadIcon size={48} color="var(--text-secondary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Drag & Drop PDF</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>or click to browse</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
              >
                <FileText size={56} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>{file.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              opacity: (!file || isUploading) ? 0.5 : 1,
              cursor: (!file || isUploading) ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {isUploading ? (
              <>Processing <Loader className="animate-spin" size={20} /></>
            ) : (
              "Upload Document"
            )}
          </button>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: status === 'error' ? '#ff4d4d' : status === 'success' ? '#00ff88' : 'var(--text-secondary)'
                }}
              >
                {status === 'success' && <CheckCircle size={20} />}
                {status === 'error' && <AlertCircle size={20} />}
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