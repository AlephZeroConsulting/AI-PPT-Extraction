import React, { useRef, useState, useEffect } from 'react';

function ImageDisplay({ imageUrl, onSubmitROI }) {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rect, setRect] = useState(null);
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setStartX(e.clientX - rect.left);
    setStartY(e.clientY - rect.top);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const newRect = {
      x: Math.round(Math.min(startX, currentX)),
      y: Math.round(Math.min(startY, currentY)),
      width: Math.round(Math.abs(currentX - startX)),
      height: Math.round(Math.abs(currentY - startY)),
    };
    setRect(newRect);
    drawImage(newRect);
  };

  const handleMouseUp = () => {
    console.log(rect);
    setIsDrawing(false);
    
    // if (rect) {
    //   onSubmitROI(rect);
    // }
  };

  const handleUndo = () => {
    setRect(null);
    drawImage();
  };

  const handleSubmit = () => {
    if (rect) {
      rect.res_width = 800;
      rect.res_height = 450;
      onSubmitROI(rect);
    }
  };

  const drawImage = (tempRect = null) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = `data:image/jpeg;base64,${imageUrl}`;
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const drawRect = tempRect || rect;
      if (drawRect) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(drawRect.x, drawRect.y, drawRect.width, drawRect.height);
      }
    };
  };

  useEffect(() => {
    drawImage();
  }, [imageUrl, rect]);

  return (
    <div className="flex flex-col items-center my-10">
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border"
      />
      <div className="mt-4">
        <button onClick={handleUndo} className="mr-2 p-2 bg-gray-300 rounded">Undo</button>
        <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded">Submit</button>
      </div>
    </div>
  );
}

export default ImageDisplay;
