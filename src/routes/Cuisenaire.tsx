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
  orientation: "h" | "v"; // horizontal or vertical
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
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
      orientation: "h",
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

  const snap = useCallback(
    (v: number) =>
      showGrid
        ? Math.round(v / (GRID_BASE * GRID_VISUAL_MULT)) *
          (GRID_BASE * GRID_VISUAL_MULT)
        : v,
    [showGrid]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    // Logical (CSS) size (context already scaled in resize effect)
    const logicalW = canvas.clientWidth;
    const logicalH = canvas.clientHeight;
    ctx.clearRect(0, 0, logicalW, logicalH);

    // Draw grid if enabled
    if (showGrid) {
      const step = GRID_BASE * GRID_VISUAL_MULT; // coincide con snapping (en unidades lógicas)
      ctx.save();
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= logicalW; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, logicalH);
        ctx.stroke();
      }
      for (let y = 0; y <= logicalH; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(logicalW, y + 0.5);
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

  // Track fullscreen changes
  useEffect(() => {
    const handler = () => {
      const el = document.fullscreenElement;
      const fs = el === containerRef.current;
      setIsFullscreen(fs);
      // force a resize of canvas (our resize effect listens to window resize, but some browsers don't emit it)
      // manually trigger by calling draw after setting dimensions
      if (canvasRef.current) {
        // Dispatch a resize by toggling a style recalculation and relying on ResizeObserver
        requestAnimationFrame(() => draw());
      }
      // If exiting fullscreen, clear rods & selection so total resets
      if (!fs) {
        setRods([]);
        setNewRod(null);
        setSelectedId(null);
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [draw]);

  // Resize / scale canvas (retina) and restore original h-96 outside fullscreen
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      if (isFullscreen) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (
          canvas.style.width !== `${w}px` ||
          canvas.style.height !== `${h}px`
        ) {
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
        }
      } else {
        // allow Tailwind classes (w-full h-96) to control layout
        if (canvas.style.width || canvas.style.height) {
          canvas.style.width = "";
          canvas.style.height = "";
        }
      }
      const wLogical = canvas.clientWidth; // after potential style changes
      const hLogical = canvas.clientHeight;
      const targetW = Math.floor(wLogical * ratio);
      const targetH = Math.floor(hLogical * ratio);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
      }
      draw();
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();
    window.addEventListener("orientationchange", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", resize);
    };
  }, [draw, isFullscreen]);

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
    let found = false;
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
        found = true;
        break;
      }
    }
    if (!found) {
      setSelectedId(null);
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
      if ((e.key === "r" || e.key === "R") && selectedId !== null) {
        setRods((prev) =>
          prev.map((r) => {
            if (r.id !== selectedId) return r;
            const canvas = canvasRef.current;
            // swap width & height and orientation
            const newWidth = r.height;
            const newHeight = r.width;
            let newX = r.x;
            let newY = r.y;
            if (canvas) {
              // keep within bounds after rotation
              if (newX + newWidth > canvas.width)
                newX = canvas.width - newWidth;
              if (newY + newHeight > canvas.height)
                newY = canvas.height - newHeight;
              if (newX < 0) newX = 0;
              if (newY < 0) newY = 0;
            }
            if (showGrid) {
              newX = snap(newX);
              newY = snap(newY);
            }
            return {
              ...r,
              width: newWidth,
              height: newHeight,
              x: newX,
              y: newY,
              orientation: r.orientation === "h" ? "v" : "h",
            };
          })
        );
      }
      if (e.key === "f" || e.key === "F") {
        // toggle fullscreen
        if (!document.fullscreenElement) {
          containerRef.current?.requestFullscreen().catch(() => {});
        } else if (document.fullscreenElement === containerRef.current) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId, showGrid, snap]);

  // Función de explicación eliminada

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-700 font-display">
          Regletas de Cuisenaire
        </h2>
        <p className="text-slate-500 text-sm">
          Arrastra, alinea y suma. Doble clic para eliminar.
        </p>
      </div>
      {/* Separador superior */}
      <div className="p-2" />
      {!isFullscreen && (
        <div className="flex flex-wrap gap-3 items-center justify-center bg-slate-200/60 rounded-lg p-3">
          {ROD_SPECS.map((spec) => (
            <button
              key={spec.value}
              type="button"
              onPointerDown={(e) =>
                startFromPalette(spec, e.clientX, e.clientY)
              }
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
      )}
      <div
        ref={containerRef}
        className={
          `relative border-2 border-slate-300 rounded-lg shadow-inner bg-white ` +
          (isFullscreen ? "w-full h-[100dvh] flex" : "")
        }
        style={isFullscreen ? { zIndex: 50 } : undefined}
      >
        {isFullscreen && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md flex flex-wrap gap-3 max-w-[80%]">
            {ROD_SPECS.map((spec) => (
              <button
                key={spec.value}
                type="button"
                onPointerDown={(e) =>
                  startFromPalette(spec, e.clientX, e.clientY)
                }
                className="transition-transform hover:scale-110 border-2 border-slate-600 rounded flex items-center justify-center font-bold cursor-grab active:cursor-grabbing shadow-sm"
                style={{
                  width: spec.value * BASE_WIDTH * 0.9,
                  height: ROD_HEIGHT * 0.9,
                  background: spec.color,
                  color: spec.textColor,
                }}
                title={`${spec.name} (${spec.value})`}
              >
                {spec.value}
              </button>
            ))}
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={
            "w-full " +
            (isFullscreen
              ? "flex-1 h-full cursor-crosshair"
              : "h-96 cursor-crosshair") +
            " touch-none select-none rounded-md"
          }
          onPointerDown={onCanvasPointerDown}
          onDoubleClick={onCanvasDoubleClick}
        />
        {isFullscreen && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow text-sm flex flex-col gap-3 max-w-[75%]">
            <div className="flex items-center gap-3 text-slate-700 font-semibold">
              <span>Total:</span>
              <span className="text-xl font-bold text-indigo-600">{total}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={clear}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md shadow-sm text-xs transition-colors"
              >
                Limpiar
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-indigo-600 w-4 h-4"
                  checked={showValues}
                  onChange={() => setShowValues((v) => !v)}
                />
                Valores
              </label>
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-indigo-600 w-4 h-4"
                  checked={showGrid}
                  onChange={() => setShowGrid((v) => !v)}
                />
                Cuadrícula
              </label>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px] leading-snug">
              <div>
                <kbd className="px-1 py-0.5 bg-slate-200 rounded border">R</kbd>{" "}
                Rotar
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-slate-200 rounded border">F</kbd>{" "}
                Pantalla
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-slate-200 rounded border">
                  Delete
                </kbd>{" "}
                Borrar
              </div>
              <div>
                <kbd className="px-1 py-0.5 bg-slate-200 rounded border">
                  Esc
                </kbd>{" "}
                Salir FS*
              </div>
            </div>
            <div className="text-[11px] text-slate-500">
              *También botón o tecla F para salir.
            </div>
          </div>
        )}
        {!isFullscreen && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow text-[11px] flex flex-col gap-2 max-w-[70%]">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span>Total:</span>
              <span className="text-lg font-bold text-indigo-600">{total}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-indigo-600 w-4 h-4"
                  checked={showValues}
                  onChange={() => setShowValues((v) => !v)}
                />
                Valores
              </label>
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-indigo-600 w-4 h-4"
                  checked={showGrid}
                  onChange={() => setShowGrid((v) => !v)}
                />
                Cuadrícula
              </label>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={async () => {
            try {
              if (!isFullscreen) {
                await containerRef.current?.requestFullscreen();
              } else if (document.fullscreenElement) {
                await document.exitFullscreen();
              }
            } catch (err) {
              console.error("Fullscreen error", err);
            }
          }}
          className="absolute top-2 right-2 bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {isFullscreen ? "Salir Pantalla Completa" : "Pantalla Completa"}
        </button>
      </div>
      {!isFullscreen && (
        <div className="rounded-lg border border-slate-300 bg-white/70 p-4 text-xs leading-relaxed shadow-sm">
          <h3 className="font-bold text-slate-700 mb-2 text-sm">
            Atajos de Teclado
          </h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            <li className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded border text-[10px]">
                R
              </kbd>
              <span>Rotar</span>
            </li>
            <li className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded border text-[10px]">
                Delete
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded border text-[10px]">
                Backspace
              </kbd>
              <span>Borrar</span>
            </li>
            <li className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded border text-[10px]">
                F
              </kbd>
              <span>Pantalla completa</span>
            </li>
          </ul>
        </div>
      )}
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
