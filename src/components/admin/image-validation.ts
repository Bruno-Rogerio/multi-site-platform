import type { MediaSlot } from "@/lib/media/presets";
import { mediaPresets } from "@/lib/media/presets";

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Nao foi possivel ler imagem."));
      img.src = objectUrl;
    });

    return { width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function validateImageForSlot(file: File, slot: MediaSlot): Promise<string | null> {
  const preset = mediaPresets[slot];
  const { width, height } = await getImageDimensions(file);

  if (width < preset.minWidth || height < preset.minHeight) {
    return `${preset.recommendedText}. Tamanho enviado: ${width}x${height}.`;
  }

  return null;
}
