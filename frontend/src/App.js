import React, { useState, useEffect } from 'react';
import InputBox from './components/InputBox';
import ImageDisplay from './components/ImageDisplay';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [videoID, setVideoID] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const handleLinkSubmit = async (link) => {
    setIsDownloading(true);
    const response = await fetch('http://localhost:8000/api/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link }),
    });
    const data = await response.json();
    console.log(data);
    setVideoID(data.video_id);
    setImageUrl(data.image);
    setIsDownloading(false);
  };

  const handleROISubmit = async (roi) => {
    setIsPreparing(true);
    roi.video_id = videoID;
    console.log(roi);
    await fetch('http://localhost:8000/api/roi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roi),
    });
    setIsReady(true);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isReady) {
        const response = await fetch('http://localhost:8000/api/checkReady/' + videoID);
        const data = await response.json();
        console.log(data);
        console.log(data.ready)
        if (data.ready) {
          console.log(data.downloadUrl);
          setDownloadUrl("http://localhost:8000"+data.downloadUrl);
          setIsReady(false);
          setIsPreparing(false);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isReady]);

  return (
    <div className="App flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">PPT Extraction</h1>
          <div className="text-lg font-semibold">Alephzero.ai</div>
        </div>
      </nav>
      
      <main className="flex-grow">
        <h1 className="text-3xl text-center my-10">PPT Extraction</h1>
        <InputBox onSubmit={handleLinkSubmit} />
        {isDownloading && <p className="text-center my-10">Downloading...</p>}
        {imageUrl && <ImageDisplay imageUrl={imageUrl} onSubmitROI={handleROISubmit} />}
        {isPreparing && <p className="text-center my-10">Preparing PPT...</p>}
        {downloadUrl && (
          <div className="text-center my-10">
            <a href={downloadUrl} download className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Download PPT
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <div className="container mx-auto">
          <p>&copy; 2024 Alephzero.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
