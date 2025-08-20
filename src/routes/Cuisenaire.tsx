import React, { useEffect, useRef, useState, useCallback } from "react";

interface RodSpec {
  value: number;
  color: string;
  textColor: string;
  name: string;
}
interface Rod extends RodSpec {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const ROD_SPECS: RodSpec[] = [
  { value: 1, color: "#FFFFFF", textColor: "#333333", name: "Blanca" },
  { value: 2, color: "#FF0000", textColor: "#FFFFFF", name: "Roja" },
  { value: 3, color: "#90EE90", textColor: "#333333", name: "Verde Claro" },
  { value: 4, color: "#FFC0CB", textColor: "#333333", name: "Rosa" },
  { value: 5, color: "#FFFF00", textColor: "#333333", name: "Amarilla" },
  { value: 6, color: "#008000", textColor: "#FFFFFF", name: "Verde Oscuro" },
  { value: 7, color: "#000000", textColor: "#FFFFFF", name: "Negra" },
  { value: 8, color: "#A52A2A", textColor: "#FFFFFF", name: "Marrón" },
  { value: 9, color: "#0000FF", textColor: "#FFFFFF", name: "Azul" },
  { value: 10, color: "#FFA500", textColor: "#FFFFFF", name: "Naranja" },
];

const ROD_HEIGHT = 40;
const BASE_WIDTH = 40;
const GRID_BASE = 5; // unidad mínima
const GRID_VISUAL_MULT = 4; // tamaño de un cuadrado visible (5 * 4 = 20px por lado)

export default function Cuisenaire() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rods, setRods] = useState<Rod[]>([]);
  const [dragging, setDragging] = useState<null | {
    id: number;
    offsetX: number;
    offsetY: number;
  }>(null);
  const [newRod, setNewRod] = useState<Rod | null>(null);
  const [total, setTotal] = useState(0);
  const [showValues, setShowValues] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const nextIdRef = useRef(1);
  // IA eliminada: ya no se usa explicación automatizada

  // draw function defined earlier now (moved below variable declarations)

  // Recalculate total
  useEffect(() => {
    setTotal(rods.reduce((s: number, r: Rod) => s + r.value, 0));
  }, [rods]);

  const startFromPalette = (
    spec: RodSpec,
    clientX: number,
    clientY: number
  ) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - (spec.value * BASE_WIDTH) / 2;
    const y = clientY - rect.top - ROD_HEIGHT / 2;
    setNewRod({
      id: nextIdRef.current++,
      ...spec,
      width: spec.value * BASE_WIDTH,
      height: ROD_HEIGHT,
      x,
      y,
    });
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (dragging) {
      setRods((prev: Rod[]) =>
        prev.map((r) =>
          r.id === dragging.id
            ? {
                ...r,
                x: snap(e.clientX - rect.left - dragging.offsetX),
                y: snap(e.clientY - rect.top - dragging.offsetY),
              }
            : r
        )
      );
      return;
    }
    if (newRod) {
      setNewRod((r: Rod | null) =>
        r
          ? {
              ...r,
              x: snap(e.clientX - rect.left - r.width / 2),
              y: snap(e.clientY - rect.top - r.height / 2),
            }
          : r
      );
    }
  };

  const handlePointerUp = () => {
    if (newRod) {
      // Only commit the new rod if it's actually inside (or intersecting) the canvas area.
      const canvas = canvasRef.current;
      if (canvas) {
        const { width: cw, height: ch } = canvas;
        const intersects =
          newRod.x + newRod.width > 0 &&
          newRod.x < cw &&
          newRod.y + newRod.height > 0 &&
          newRod.y < ch;
        if (intersects) {
          setRods((prev: Rod[]) => [...prev, newRod]);
          // Optionally select the rod when placed
          setSelectedId(newRod.id);
        }
      }
      setNewRod(null);
    }
    setDragging(null);
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => handlePointerMove(e);
    const onUp = () => handlePointerUp();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  });

  const snap = (v: number) =>
    showGrid
      ? Math.round(v / (GRID_BASE * GRID_VISUAL_MULT)) *
        (GRID_BASE * GRID_VISUAL_MULT)
      : v;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid if enabled
    if (showGrid) {
      const step = GRID_BASE * GRID_VISUAL_MULT; // coincide con snapping
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(canvas.width, y + 0.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    const drawRod = (rod: Rod) => {
      ctx.fillStyle = rod.color;
      ctx.strokeStyle = "#4A5568";
      ctx.lineWidth = 2;
      const path = new Path2D();
      // rounded rect
      const radius = 4;
      const { x, y, width, height } = rod;
      path.roundRect(x, y, width, height, radius);
      ctx.fill(path);
      ctx.stroke(path);
      // selection overlay
      if (selectedId === rod.id) {
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#6366f1";
        ctx.strokeRect(x - 3, y - 3, width + 6, height + 6);
        ctx.restore();
      }
      if (showValues) {
        ctx.fillStyle = rod.textColor;
        ctx.font = "bold 16px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(rod.value), x + width / 2, y + height / 2);
      }
    };

    rods.forEach(drawRod);
    if (newRod) drawRod(newRod);
  }, [rods, newRod, showGrid, showValues, selectedId]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Resize canvas (placed after draw definition)
  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // When enabling grid, snap existing rods
  useEffect(() => {
    if (showGrid) {
      setRods((prev) =>
        prev.map((r) => ({ ...r, x: snap(r.x), y: snap(r.y) }))
      );
      if (newRod)
        setNewRod((r) => (r ? { ...r, x: snap(r.x), y: snap(r.y) } : r));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGrid]);

  const onCanvasPointerDown = (e: React.PointerEvent) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let i = rods.length - 1; i >= 0; i--) {
      const r = rods[i];
      if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) {
        setSelectedId(r.id);
        // move to end for z-order and prepare dragging after reorder
        setRods((prev: Rod[]) => {
          const copy = [...prev];
          const idx = copy.findIndex((rr) => rr.id === r.id);
          if (idx !== -1) {
            const [rodExtract] = copy.splice(idx, 1);
            copy.push(rodExtract);
            // update dragging with new last position
            setDragging({
              id: rodExtract.id,
              offsetX: x - r.x,
              offsetY: y - r.y,
            });
          }
          return copy;
        });
        break;
      }
    }
  };

  const onCanvasDoubleClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let removedId: number | null = null;
    setRods((prev: Rod[]) =>
      prev.filter((r: Rod) => {
        const hit =
          x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;
        if (hit) removedId = r.id;
        return !hit;
      })
    );
    if (removedId && selectedId === removedId) setSelectedId(null);
  };

  const clear = () => {
    setRods([]);
    setNewRod(null);
    setSelectedId(null);
  };

  // Delete key handling
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedId !== null
      ) {
        setRods((prev) => prev.filter((r) => r.id !== selectedId));
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId]);

  // Función de explicación eliminada

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-700 font-display">
          Regletas de Cuisenaire
        </h2>
        <p className="text-slate-500 text-sm">
          Arrastra, alinea y suma. Doble clic para eliminar. Click para
          seleccionar (Delete para borrar).
        </p>
      </div>
      <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="text-center sm:text-left">
          <span className="text-lg font-medium text-slate-600 font-display">
            Suma Total:
          </span>{" "}
          <span className="text-2xl font-bold text-blue-600 font-display">
            {total}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-indigo-600 w-4 h-4"
              checked={showValues}
              onChange={() => setShowValues((v) => !v)}
            />
            Mostrar valores
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-indigo-600 w-4 h-4"
              checked={showGrid}
              onChange={() => setShowGrid((v) => !v)}
            />
            Cuadrícula / Alinear
          </label>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 items-center justify-center bg-slate-200/60 rounded-lg p-3">
        {ROD_SPECS.map((spec) => (
          <button
            key={spec.value}
            type="button"
            onPointerDown={(e) => startFromPalette(spec, e.clientX, e.clientY)}
            className="transition-transform hover:scale-110 border-2 border-slate-600 rounded flex items-center justify-center font-bold cursor-grab active:cursor-grabbing"
            style={{
              width: spec.value * BASE_WIDTH * 0.75,
              height: ROD_HEIGHT * 0.75,
              background: spec.color,
              color: spec.textColor,
            }}
          >
            {spec.value}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-96 bg-white border-2 border-slate-300 rounded-lg shadow-inner cursor-grab active:cursor-grabbing"
        onPointerDown={onCanvasPointerDown}
        onDoubleClick={onCanvasDoubleClick}
      />
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={clear}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Limpiar Lienzo
        </button>
      </div>
    </div>
  );
}
