import { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file); // MUST match upload.single('pdf')

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Upload successful ✅");
      } else {
        setMessage(data.error || "Upload failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Upload PDF</h2>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <br /><br />

      <button onClick={handleUpload}>Upload</button>

      <p>{message}</p>
    </div>
  );
}

export default Upload;