import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { rgbaToHex } from "@/lib/utils";
import {
  Download,
  Redo,
  Square,
  Trash,
  Undo,
  Upload,
} from "@mynaui/icons-react";
import { Eraser } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SketchPicker, TwitterPicker } from "react-color";

export function Edit() {
  const [gridSize, setGridSize] = useState(16);
  const [color, setColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixels, setPixels] = useState<string[][]>([]);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [history, setHistory] = useState<string[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [usedColors, setUsedColors] = useState<string[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initializeGrid = useCallback((size: number) => {
    const newPixels = Array(size)
      .fill("")
      .map(() => Array(size).fill("transparent"));
    setPixels(newPixels);
    setHistory([newPixels]);
    setHistoryIndex(0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newSize = gridSize;

      if (width < 640) {
        newSize = Math.min(gridSize, 32);
      } else if (width < 1024) {
        newSize = Math.min(gridSize, 48);
      }

      if (newSize !== gridSize) {
        setGridSize(newSize);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    initializeGrid(gridSize);
  }, [gridSize, initializeGrid]);

  const updateUsedColors = useCallback((newPixels: string[][]) => {
    const colors = new Set<string>();
    newPixels.forEach((row) => {
      row.forEach((pixel) => {
        if (pixel !== "transparent") {
          colors.add(rgbaToHex(pixel));
        }
      });
    });
    setUsedColors(Array.from(colors));
  }, []);

  const addToHistory = useCallback(
    (newPixels: string[][]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(newPixels)));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      updateUsedColors(newPixels);
    },
    [history, historyIndex, updateUsedColors],
  );

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsDrawing(true);
    const newPixels = [...pixels];
    const newColor = tool === "draw" ? color : "transparent";
    newPixels[rowIndex][colIndex] = newColor;
    setPixels(newPixels);
  };

  const handleMouseOver = (rowIndex: number, colIndex: number) => {
    if (!isDrawing) return;
    const newPixels = [...pixels];
    const newColor = tool === "draw" ? color : "transparent";
    newPixels[rowIndex][colIndex] = newColor;
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

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const currentSize = gridSize;
          canvas.width = currentSize;
          canvas.height = currentSize;
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const scale = Math.min(
            currentSize / img.width,
            currentSize / img.height,
          );
          const centerShiftX = (currentSize - img.width * scale) / 2;
          const centerShiftY = (currentSize - img.height * scale) / 2;

          ctx.drawImage(
            img,
            centerShiftX,
            centerShiftY,
            img.width * scale,
            img.height * scale,
          );

          const newPixels = Array(currentSize)
            .fill("")
            .map(() => Array(currentSize).fill("transparent"));

          for (let y = 0; y < currentSize; y++) {
            for (let x = 0; x < currentSize; x++) {
              const data = ctx.getImageData(x, y, 1, 1).data;
              if (data[3] > 0) {
                newPixels[y][x] = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${
                  data[3] / 255
                })`;
              }
            }
          }

          setPixels(newPixels);
          addToHistory(newPixels);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [gridSize, addToHistory],
  );

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const canvas = document.createElement("canvas");
    const scale = 20;
    canvas.width = gridSize * scale;
    canvas.height = gridSize * scale;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    pixels.forEach((row, rowIndex) => {
      row.forEach((pixel, colIndex) => {
        ctx.fillStyle = pixel;
        ctx.fillRect(colIndex * scale, rowIndex * scale, scale, scale);
      });
    });

    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const clearCanvas = () => {
    initializeGrid(gridSize);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const newPixels = JSON.parse(JSON.stringify(history[historyIndex - 1]));
      setPixels(newPixels);
      updateUsedColors(newPixels);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const newPixels = JSON.parse(JSON.stringify(history[historyIndex + 1]));
      setPixels(newPixels);
      updateUsedColors(newPixels);
    }
  };

  return (
    <div className="flex h-screen flex-col gap-4 bg-background">
      <div className="relative rounded-xl bg-card p-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label className="font-medium">
                Size: {gridSize}x{gridSize}
              </Label>
              <div className="w-40">
                <Slider
                  min={8}
                  max={100}
                  value={[gridSize]}
                  onValueChange={(e) => setGridSize(Number(e[0]))}
                />
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <div
                    className="mr-2 h-4 w-4 rounded-full border"
                    style={{ backgroundColor: color }}
                  />
                  Color
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <SketchPicker
                  color={color}
                  onChangeComplete={(color) => setColor(color.hex)}
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={tool === "draw" ? "default" : "outline"}
                onClick={() => setTool("draw")}
              >
                <Square className="mr-2 h-4 w-4" />
                Draw
              </Button>
              <Button
                size="sm"
                variant={tool === "erase" ? "default" : "outline"}
                onClick={() => setTool("erase")}
              >
                <Eraser className="mr-2 h-4 w-4" />
                Erase
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button variant="outline" size="sm" onClick={downloadImage}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <div className="flex gap-1">
              <Button
                onClick={undo}
                variant="outline"
                size="icon"
                disabled={historyIndex <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                onClick={redo}
                variant="outline"
                size="icon"
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-inset absolute rounded-xl border-2 border-primary/10" />
      </div>

      <div className="flex-1 rounded-xl border-2 border-zinc-300 bg-card p-4">
        <div className="mx-auto h-full max-w-7xl">
          <div
            ref={canvasRef}
            className="grid h-full w-full"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              aspectRatio: "1 / 1",
              height: "auto",
              width: "100%",
              maxHeight: `calc(100vh - ${gridSize}px)`,
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
                  className="h-full w-full border-[0.5px] border-zinc-200"
                  style={{
                    backgroundColor: pixel,
                  }}
                />
              )),
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-card p-4">
        <Label className="mb-2 block font-medium">Used Colors</Label>
        <div className="flex flex-wrap gap-2">
          <TwitterPicker width="100%" colors={usedColors} className="w-full" />
        </div>
      </div>
    </div>
  );
}
