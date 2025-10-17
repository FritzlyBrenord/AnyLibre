import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

// Charger FFmpeg une seule fois
export const loadFFmpeg = async (): Promise<FFmpeg> => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

export interface CompressionOptions {
  quality?: number; // 0-51 (plus bas = meilleure qualité, 23 par défaut)
  maxDuration?: number; // en secondes
  maxSize?: number; // en MB
  onProgress?: (progress: number) => void;
}

export const compressVideo = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    quality = 28, // Balance entre qualité et taille (28 = bonne compression)
    maxDuration = 75,
    maxSize = 50,
    onProgress,
  } = options;

  try {
    const ffmpeg = await loadFFmpeg();

    // Nettoyer les fichiers précédents
    try {
      await ffmpeg.deleteFile('input.mp4');
      await ffmpeg.deleteFile('output.mp4');
    } catch (e) {
      // Ignorer si les fichiers n'existent pas
    }

    // Écrire le fichier d'entrée
    await ffmpeg.writeFile('input.mp4', await fetchFile(file));

    // Configurer le callback de progression
    ffmpeg.on('progress', ({ progress }) => {
      if (onProgress) {
        onProgress(Math.round(progress * 100));
      }
    });

    // Commande FFmpeg pour compression optimale
    // -c:v libx264 : codec H.264 (meilleure compatibilité)
    // -crf : qualité (0-51, plus bas = meilleure qualité)
    // -preset : vitesse d'encodage (faster = plus rapide)
    // -vf scale : redimensionner si nécessaire
    // -movflags +faststart : optimisation pour streaming web
    // -t : limiter la durée
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-c:v', 'libx264',
      '-crf', quality.toString(),
      '-preset', 'faster',
      '-vf', 'scale=1280:-2', // Max width 1280px, hauteur auto
      '-c:a', 'aac',
      '-b:a', '128k', // Bitrate audio 128kbps
      '-movflags', '+faststart',
      '-t', maxDuration.toString(),
      'output.mp4'
    ]);

    // Lire le fichier compressé
    const data = await ffmpeg.readFile('output.mp4');
    const compressedBlob = new Blob([data], { type: 'video/mp4' });

    // Vérifier la taille finale
    const compressedSizeMB = compressedBlob.size / (1024 * 1024);
    if (compressedSizeMB > maxSize) {
      throw new Error(
        `La vidéo compressée (${compressedSizeMB.toFixed(2)}MB) dépasse la limite de ${maxSize}MB`
      );
    }

    // Créer un nouveau File object
    const compressedFile = new File(
      [compressedBlob],
      file.name.replace(/\.[^/.]+$/, '') + '_compressed.mp4',
      { type: 'video/mp4' }
    );

    // Calculer le taux de compression
    const originalSizeMB = file.size / (1024 * 1024);
    const compressionRate = ((1 - compressedSizeMB / originalSizeMB) * 100).toFixed(0);

    console.log(`✅ Compression réussie: ${originalSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB (${compressionRate}% de réduction)`);

    return compressedFile;
  } catch (error) {
    console.error('Erreur lors de la compression:', error);
    throw error;
  }
};

// Fonction pour obtenir les métadonnées de la vidéo
export const getVideoMetadata = async (file: File): Promise<{
  duration: number;
  width: number;
  height: number;
  size: number;
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        size: file.size,
      });
    };

    video.onerror = () => {
      reject(new Error('Impossible de lire les métadonnées de la vidéo'));
    };

    video.src = URL.createObjectURL(file);
  });
};