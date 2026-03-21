import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const renderCinematicVideo = async (imageUri: string, scene: any, ratio?: string) => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }

  const inputName = 'input.png';
  const outputName = `ALTO_RENDER_${Date.now()}.mp4`;

  await ffmpeg.writeFile(inputName, await fetchFile(imageUri));

  // Logika Filter: Zoom halus agar wajah/busana tetap konsisten
  let filter = "scale=1080:-1,zoompan=z='min(zoom+0.001,1.2)':d=125:s=1080x1920";
  
  if (scene.visual_move === 'pan_right') {
    filter = "scale=2000:-1,zoompan=z=1.1:x='on*2':y='ih/2':d=125:s=1080x1920";
  }

  // Tambahkan Subtitle jika ada narasi
  if (scene.narasi) {
    // Note: drawtext in ffmpeg.wasm might require font files. 
    // We'll attempt it, but it may be ignored if no default font is found in the wasm build.
    filter += `,drawtext=text='${scene.narasi}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=h-200:box=1:boxcolor=black@0.5`;
  }

  await ffmpeg.exec(['-loop', '1', '-i', inputName, '-t', '5', '-vf', filter, '-pix_fmt', 'yuv420p', '-y', outputName]);

  const data = await ffmpeg.readFile(outputName);
  const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' }));
  
  return url;
};

export const videoEngine = {
  processVideo: renderCinematicVideo
};
