# Guía para Agregar Nuevas Palabras al Silabario PRODAI

## Estructura de Archivos de Audio

Para agregar una nueva palabra al silabario, necesitas crear una carpeta con el nombre de la palabra en `public/audio/` y agregar los archivos de audio correspondientes.

### Ejemplo: Palabra "casa"

```
public/audio/casa/
├── ca.mp3
├── ce.mp3
├── ci.mp3
├── co.mp3
├── cu.mp3
├── sa.mp3
├── se.mp3
├── si.mp3
├── so.mp3
└── su.mp3
```

## Agregar Palabra al Código

Una vez que tengas los archivos de audio, agrega la palabra al array `PALABRAS_DISPONIBLES` en `src/routes/Prodai.tsx`:

```typescript
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
  // Agregar nueva palabra aquí:
  {
    palabra: "casa",
    silabas: [
      [
        { texto: "ca", audio: "/audio/casa/ca.mp3" },
        { texto: "ce", audio: "/audio/casa/ce.mp3" },
        { texto: "ci", audio: "/audio/casa/ci.mp3" },
        { texto: "co", audio: "/audio/casa/co.mp3" },
        { texto: "cu", audio: "/audio/casa/cu.mp3" },
      ],
      [
        { texto: "sa", audio: "/audio/casa/sa.mp3" },
        { texto: "se", audio: "/audio/casa/se.mp3" },
        { texto: "si", audio: "/audio/casa/si.mp3" },
        { texto: "so", audio: "/audio/casa/so.mp3" },
        { texto: "su", audio: "/audio/casa/su.mp3" },
      ],
    ],
  },
];
```

## Convenciones de Nomenclatura

- **Archivos de audio**: Usar formato `.mp3`
- **Nombres de archivos**: Usar solo letras minúsculas (ej: `ma.mp3`, `se.mp3`)
- **Estructura de carpetas**: Una carpeta por palabra en `public/audio/`
- **Rutas en código**: Usar rutas absolutas que empiecen con `/audio/`

## Palabras Recomendadas para Agregar

- **2 sílabas**: casa, mesa, luna, gato, perro, libro, flor, mano, pie, ojo
- **3 sílabas**: mariposa, elefante, cocodrilo, teléfono, computadora
- **4 sílabas**: hipopótamo, televisión, refrigerador

## Archivos Placeholder

Si no tienes los archivos de audio listos, puedes crear archivos placeholder (vacíos) para mantener la estructura:

```bash
# Crear carpeta para la palabra
mkdir -p public/audio/limonada

# Crear archivos placeholder
touch public/audio/limonada/{la,le,li,lo,lu,ma,me,mi,mo,mu,na,ne,ni,no,nu,da,de,di,do,du}.mp3
```

Los archivos placeholder permiten que la aplicación funcione mientras se preparan los archivos de audio reales.

## Notas Importantes

1. **Calidad de audio**: Asegúrate de que los archivos de audio tengan buena calidad y pronunciación clara
2. **Duración**: Los archivos de audio deben ser cortos (1-2 segundos por sílaba)
3. **Formato**: Usar formato MP3 para compatibilidad web
4. **Tamaño**: Mantener los archivos pequeños para carga rápida
5. **Placeholders**: Los archivos vacíos funcionan como placeholders hasta que se agreguen los audios reales

## Pruebas

Después de agregar una nueva palabra:

1. Ejecuta `npm run dev` para probar en desarrollo
2. Verifica que todos los archivos de audio se reproduzcan correctamente
3. Asegúrate de que la palabra aparezca en el selector
4. Prueba la funcionalidad de clic en cada sílaba
