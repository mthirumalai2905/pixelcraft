import React, { useState, useRef, useEffect } from 'react';
import { Download, Eraser, Square, Upload, Undo, Redo, Trash2 } from 'lucide-react';
import './App.css'; // Make sure the CSS is being imported
import { bgPixel1 } from './models/1.gif'; // Adjust path accordingly if needed



function App() {
  const [gridSize, setGridSize] = useState(16);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<string[][]>([]);
  const [tool, setTool] = useState<'draw' | 'erase'>('draw');
  const [history, setHistory] = useState<string[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newSize = gridSize;
      
      if (width < 640) { // Small screens
        newSize = Math.min(gridSize, 32);
      } else if (width < 1024) { // Medium screens
        newSize = Math.min(gridSize, 48);
      }
      
      if (newSize !== gridSize) {
        setGridSize(newSize);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const newPixels = Array(gridSize).fill('').map(() => 
      Array(gridSize).fill('transparent')
    );
    setPixels(newPixels);
    setHistory([newPixels]);
    setHistoryIndex(0);
  }, [gridSize]);

  const addToHistory = (newPixels: string[][]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newPixels)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    const newPixels = [...pixels];
    newPixels[rowIndex][colIndex] = tool === 'draw' ? color : 'transparent';
    setPixels(newPixels);
  };

  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    if (!isDrawing) return;
    const newPixels = [...pixels];
    newPixels[rowIndex][colIndex] = tool === 'draw' ? color : 'transparent';
    setPixels(newPixels);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      addToHistory([...pixels]);
    }
    setIsDrawing(false);
  };

  const handleTouchStart = (rowIndex: number, colIndex: number) => {
    handleMouseDown(rowIndex, colIndex);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;

    const touch = e.touches[0];
    const grid = canvasRef.current;
    const rect = grid.getBoundingClientRect();
    const cellSize = rect.width / gridSize;

    const x = Math.floor((touch.clientX - rect.left) / cellSize);
    const y = Math.floor((touch.clientY - rect.top) / cellSize);

    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      handleMouseOver(y, x);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = gridSize;
        canvas.height = gridSize;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, gridSize, gridSize);
        
        const newPixels = [...pixels];
        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const data = ctx.getImageData(x, y, 1, 1).data;
            newPixels[y][x] = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
          }
        }
        setPixels(newPixels);
        addToHistory(newPixels);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const canvas = document.createElement('canvas');
    const scale = 20;
    canvas.width = gridSize * scale;
    canvas.height = gridSize * scale;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    pixels.forEach((row, rowIndex) => {
      row.forEach((pixel, colIndex) => {
        ctx.fillStyle = pixel;
        ctx.fillRect(colIndex * scale, rowIndex * scale, scale, scale);
      });
    });

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const clearCanvas = () => {
    const newPixels = Array(gridSize).fill('').map(() => 
      Array(gridSize).fill('transparent')
    );
    setPixels(newPixels);
    addToHistory(newPixels);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPixels(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPixels(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 border-2 border-gray-300">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text text-center sm:text-left">
              Pixel Art Generator
            </h1>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                <Undo size={20} />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                <Redo size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 sm:gap-8">
            <div className="space-y-4 sm:space-y-6 bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grid Size: {gridSize}x{gridSize}
                </label>
                <input
                  type="range"
                  min="8"
                  max="100"
                  value={gridSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setGridSize(newSize);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tools
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTool('draw')}
                    className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${tool === 'draw' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Square size={20} />
                    Draw
                  </button>
                  <button
                    onClick={() => setTool('erase')}
                    className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 ${tool === 'erase' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <Eraser size={20} />
                    Erase
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 text-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100"
                >
                  <Upload size={20} />
                  Upload Image
                </button>
                <button
                  onClick={clearCanvas}
                  className="w-full p-3 text-center rounded-lg border border-gray-200 bg-red-100 hover:bg-red-200"
                >
                  <Trash2 size={20} />
                  Clear
                </button>
                <button
                  onClick={downloadImage}
                  className="w-full p-3 text-center rounded-lg border border-gray-200 bg-green-100 hover:bg-green-200"
                >
                  <Download size={20} />
                  Download Image
                </button>
              </div>
            </div>

            <div
              ref={canvasRef}
              onMouseDown={() => handleMouseDown(0, 0)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              }}
            >
              {pixels.map((row, rowIndex) =>
                row.map((pixel, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                    onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
                    onTouchMove={(e) => handleTouchMove(e)}
                    className="w-full h-full border-[1px] border-gray-300"
                    style={{
                      backgroundColor: pixel,
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
