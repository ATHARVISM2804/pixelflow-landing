import React, { useState } from 'react';

// Reusable function for background removal
export async function removeBgFromFile(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": "ELDtsDSsaHkDSC6UQLdQqyUx",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to remove background");
  }

  return await response.blob();
}

// Standalone UI for manual testing
function RemoveBg() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please upload an image first!");
      return;
    }
    setLoading(true);
    try {
      const blob = await removeBgFromFile(selectedImage);
      const imageObjectURL = URL.createObjectURL(blob);
      setResultImage(imageObjectURL);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Background Removal Tool</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Remove Background"}
      </button>
      <div style={{ marginTop: "20px" }}>
        {resultImage && (
          <>
            <h2>Result:</h2>
            <img src={resultImage} alt="Result" style={{ maxWidth: "100%" }} />
            <br />
            <a href={resultImage} download="no-background.png">
              <button>Download Image</button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default RemoveBg;
