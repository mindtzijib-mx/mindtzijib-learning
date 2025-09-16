import { useState } from "react";

// Interfaz para una sílaba con audio
interface SilabaConAudio {
  texto: string;
  audio: string;
}

// Interfaz para una palabra con sus sílabas
interface PalabraConSilabas {
  palabra: string;
  silabas: SilabaConAudio[][];
}

// Base de datos de palabras con sílabas y audio
const PALABRAS_DISPONIBLES: PalabraConSilabas[] = [
  {
    palabra: "masa",
    silabas: [
      [
        { texto: "ma", audio: "/audio/masa/ma.mp3" },
        { texto: "me", audio: "/audio/masa/me.mp3" },
        { texto: "mi", audio: "/audio/masa/mi.mp3" },
        { texto: "mo", audio: "/audio/masa/mo.mp3" },
        { texto: "mu", audio: "/audio/masa/mu.mp3" },
      ],
      [
        { texto: "sa", audio: "/audio/masa/sa.mp3" },
        { texto: "se", audio: "/audio/masa/se.mp3" },
        { texto: "si", audio: "/audio/masa/si.mp3" },
        { texto: "so", audio: "/audio/masa/so.mp3" },
        { texto: "su", audio: "/audio/masa/su.mp3" },
      ],
    ],
  },
  {
    palabra: "limonada",
    silabas: [
      [
        { texto: "li", audio: "/audio/limonada/li.mp3" },
        { texto: "la", audio: "/audio/limonada/la.mp3" },
        { texto: "le", audio: "/audio/limonada/le.mp3" },
        { texto: "lo", audio: "/audio/limonada/lo.mp3" },
        { texto: "lu", audio: "/audio/limonada/lu.mp3" },
      ],
      [
        { texto: "mo", audio: "/audio/limonada/mo.mp3" },
        { texto: "ma", audio: "/audio/limonada/ma.mp3" },
        { texto: "me", audio: "/audio/limonada/me.mp3" },
        { texto: "mi", audio: "/audio/limonada/mi.mp3" },
        { texto: "mu", audio: "/audio/limonada/mu.mp3" },
      ],
      [
        { texto: "na", audio: "/audio/limonada/na.mp3" },
        { texto: "ne", audio: "/audio/limonada/ne.mp3" },
        { texto: "ni", audio: "/audio/limonada/ni.mp3" },
        { texto: "no", audio: "/audio/limonada/no.mp3" },
        { texto: "nu", audio: "/audio/limonada/nu.mp3" },
      ],
      [
        { texto: "da", audio: "/audio/limonada/da.mp3" },
        { texto: "de", audio: "/audio/limonada/de.mp3" },
        { texto: "di", audio: "/audio/limonada/di.mp3" },
        { texto: "do", audio: "/audio/limonada/do.mp3" },
        { texto: "du", audio: "/audio/limonada/du.mp3" },
      ],
    ],
  },
  // Aquí se pueden agregar más palabras cuando tengas sus archivos de audio
];

// Función para reproducir audio
function reproducirAudio(audioPath: string) {
  const audio = new Audio(audioPath);
  audio.play().catch((error) => {
    console.error("Error al reproducir audio:", error);
    // Mostrar mensaje informativo si el audio no se puede reproducir
    if (
      error.name === "NotSupportedError" ||
      error.name === "NotAllowedError"
    ) {
      console.log("Audio no disponible - archivo placeholder");
    }
  });
}

interface SilabarioProps {
  palabraSeleccionada: PalabraConSilabas | null;
}

function Silabario({ palabraSeleccionada }: SilabarioProps) {
  if (!palabraSeleccionada) {
    return (
      <div className="text-center text-gray-500">
        Selecciona una palabra para ver su silabario
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-700 mb-2">
          Palabra:{" "}
          <span className="text-indigo-600">{palabraSeleccionada.palabra}</span>
        </h3>
        <p className="text-sm text-slate-500">
          {palabraSeleccionada.silabas.length} sílaba
          {palabraSeleccionada.silabas.length !== 1 ? "s" : ""}:{" "}
          {palabraSeleccionada.silabas
            .map((silaba) => silaba[0].texto)
            .join(" - ")}
        </p>
      </div>

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${palabraSeleccionada.silabas.length}, 1fr)`,
        }}
      >
        {palabraSeleccionada.silabas.map((silaba, index) => {
          const silabaOriginal = silaba[0].texto;

          return (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-slate-200 p-4 shadow-sm"
            >
              <h4 className="text-center font-bold text-slate-700 mb-3 text-lg">
                Sílaba {index + 1}
              </h4>
              <div className="space-y-2">
                {silaba.map((variacion, varIndex) => (
                  <button
                    key={varIndex}
                    onClick={() => reproducirAudio(variacion.audio)}
                    className={`
                      w-full p-3 text-center font-bold text-lg rounded-lg border-2 transition-all duration-200 cursor-pointer
                      ${
                        variacion.texto === silabaOriginal
                          ? "bg-indigo-100 border-indigo-400 text-indigo-700 shadow-md hover:bg-indigo-200"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                      }
                    `}
                    title={`Haz clic para escuchar: ${variacion.texto}`}
                  >
                    {variacion.texto}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Prodai() {
  const [palabraSeleccionada, setPalabraSeleccionada] =
    useState<PalabraConSilabas | null>(
      PALABRAS_DISPONIBLES[0] // Por defecto, seleccionar "masa"
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-700 font-display">
          PRODAI - Silabario Interactivo
        </h2>
        <p className="text-slate-500 text-sm">
          Aprende a leer y escribir con el método silábico
        </p>
      </div>

      {/* Selector de palabras */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="palabra-selector"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Selecciona una palabra:
            </label>
            <select
              id="palabra-selector"
              value={palabraSeleccionada?.palabra || ""}
              onChange={(e) => {
                const palabra = PALABRAS_DISPONIBLES.find(
                  (p) => p.palabra === e.target.value
                );
                setPalabraSeleccionada(palabra || null);
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            >
              {PALABRAS_DISPONIBLES.map((palabra) => (
                <option key={palabra.palabra} value={palabra.palabra}>
                  {palabra.palabra}
                </option>
              ))}
            </select>
          </div>

          {/* Botones de palabras disponibles */}
          <div>
            <p className="text-sm text-slate-600 mb-2">Palabras disponibles:</p>
            <div className="flex flex-wrap gap-2">
              {PALABRAS_DISPONIBLES.map((palabra) => (
                <button
                  key={palabra.palabra}
                  onClick={() => setPalabraSeleccionada(palabra)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    palabraSeleccionada?.palabra === palabra.palabra
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                  }`}
                >
                  {palabra.palabra}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Silabario */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <Silabario palabraSeleccionada={palabraSeleccionada} />
      </div>

      {/* Información educativa */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-3">
          ¿Cómo usar el silabario?
        </h3>
        <ul className="text-blue-700 text-sm space-y-2">
          <li>• La sílaba original de la palabra aparece resaltada en azul</li>
          <li>• Haz clic en cualquier sílaba para escuchar su pronunciación</li>
          <li>
            • Las variaciones te ayudan a practicar con diferentes vocales
          </li>
          <li>
            • Combina sílabas de diferentes columnas para formar nuevas palabras
          </li>
        </ul>
      </div>

      {/* Información sobre audio */}
      <div className="bg-green-50 rounded-lg p-6 border border-green-200">
        <h3 className="font-bold text-green-800 mb-3">🔊 Audio Disponible</h3>
        <p className="text-green-700 text-sm">
          Cada sílaba tiene su propio archivo de audio. Haz clic en cualquier
          sílaba para escuchar su pronunciación correcta.
        </p>
        {palabraSeleccionada?.palabra === "limonada" && (
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-yellow-800 text-sm">
              <strong>Nota:</strong> La palabra "limonada" tiene archivos de
              audio placeholder. Los archivos de audio reales se pueden agregar
              más tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
