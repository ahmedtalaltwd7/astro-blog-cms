import { useEffect, useRef, useState } from "preact/hooks";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 360;

const normalizeRotation = (degrees) => {
  const number = Number(degrees);
  if (!Number.isFinite(number)) return 0;
  return ((Math.round(number) % 360) + 360) % 360;
};

const parseWidth = (width, fallbackWidth) => {
  if (!width) return fallbackWidth;
  if (String(width).endsWith("%")) {
    return Math.round((CANVAS_WIDTH * Number.parseInt(width, 10)) / 100);
  }
  return Number.parseInt(width, 10) || fallbackWidth;
};

const loadImageElement = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    if (!url.startsWith("/")) {
      image.crossOrigin = "anonymous";
    }

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });

export default function MarkdownImageCanvas({ selection, onChange }) {
  const canvasElementRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const fabricImageRef = useRef(null);
  const fabricRef = useRef(null);
  const selectionRef = useRef(selection);
  const onChangeRef = useRef(onChange);
  const [canvasReady, setCanvasReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const image = selection?.image;

  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let disposed = false;

    import("fabric").then(({ Canvas, FabricImage }) => {
      if (disposed || !canvasElementRef.current) return;

      const canvas = new Canvas(canvasElementRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: "#f9fafb",
        preserveObjectStacking: true,
      });

      fabricRef.current = { FabricImage };
      fabricCanvasRef.current = canvas;

      canvas.on("object:scaling", ({ target }) => {
        if (!target) return;
        target.set("scaleY", target.scaleX);
        canvas.requestRenderAll();
      });

      canvas.on("object:modified", ({ target }) => {
        const selected = selectionRef.current;
        if (!target || !selected?.image?.url) return;

        onChangeRef.current?.({
          ...selected.image,
          width: String(Math.max(1, Math.round(target.getScaledWidth()))),
          rotation: normalizeRotation(target.angle),
          offsetX: Math.max(0, Math.round(target.left || 0)),
          offsetY: Math.max(0, Math.round(target.top || 0)),
        });
      });

      setCanvasReady(true);
    });

    return () => {
      disposed = true;
      fabricCanvasRef.current?.dispose();
      fabricCanvasRef.current = null;
      fabricImageRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const FabricImage = fabricRef.current?.FabricImage;
    const image = selection?.image;

    if (!canvas || !FabricImage) return;

    canvas.clear();
    canvas.backgroundColor = "#f9fafb";
    fabricImageRef.current = null;
    setImageLoaded(false);
    setLoadError("");

    if (!image?.url) {
      canvas.requestRenderAll();
      return;
    }

    let cancelled = false;

    loadImageElement(image.url)
      .then((imageElement) => {
        if (cancelled) return;

        const fabricImage = new FabricImage(imageElement);
        const naturalWidth = fabricImage.width || 320;
        const naturalHeight = fabricImage.height || 180;
        const fallbackWidth = Math.min(naturalWidth, Math.round(CANVAS_WIDTH * 0.72));
        const displayWidth = Math.min(
          parseWidth(image.width, fallbackWidth),
          CANVAS_WIDTH,
        );
        const scale = displayWidth / naturalWidth;
        const displayHeight = naturalHeight * scale;
        const left =
          Number(image.offsetX) > 0
            ? Number(image.offsetX)
            : Math.max(16, Math.round((CANVAS_WIDTH - displayWidth) / 2));
        const top =
          Number(image.offsetY) > 0
            ? Number(image.offsetY)
            : Math.max(16, Math.round((CANVAS_HEIGHT - displayHeight) / 2));

        fabricImage.set({
          left,
          top,
          angle: normalizeRotation(image.rotation),
          scaleX: scale,
          scaleY: scale,
          borderColor: "#2563eb",
          cornerColor: "#2563eb",
          cornerSize: 10,
          cornerStyle: "circle",
          lockScalingFlip: true,
          lockUniScaling: true,
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          transparentCorners: false,
        });

        fabricImage.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
        });

        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);
        canvas.requestRenderAll();
        fabricImageRef.current = fabricImage;
        setImageLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError("Image could not be loaded into the canvas.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selection?.image?.url, selection?.image?.width, selection?.image?.rotation, selection?.image?.offsetX, selection?.image?.offsetY, canvasReady]);

  return (
    <div class="my-6">
      <div
        class={
          loadError
            ? "hidden"
            : "overflow-auto rounded-lg border border-gray-200 bg-gray-50"
        }
      >
        <canvas ref={canvasElementRef} />
      </div>
      {image?.url && loadError && (
        <img
          src={image.url}
          alt={image.alt || ""}
          class="h-auto max-w-full rounded-lg border border-gray-200"
        />
      )}
      {loadError && (
        <p class="mt-2 text-sm text-red-600">
          {loadError}
        </p>
      )}
    </div>
  );
}
