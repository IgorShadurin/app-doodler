export type CropAnchor = "top" | "center" | "bottom" | "left" | "right";

export type CropRect = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
};

const DEFAULT_ASPECT_TOLERANCE = 0.004;

export function hasMatchingAspectRatio(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  tolerance = DEFAULT_ASPECT_TOLERANCE,
): boolean {
  if (sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0 || targetHeight <= 0) {
    return false;
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;
  const relativeDelta = Math.abs(sourceRatio - targetRatio) / targetRatio;
  return relativeDelta <= tolerance;
}

export function getCropAnchorsForAspectMismatch(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): CropAnchor[] {
  if (hasMatchingAspectRatio(sourceWidth, sourceHeight, targetWidth, targetHeight)) {
    return ["center"];
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;
  if (sourceRatio > targetRatio) {
    return ["left", "center", "right"];
  }
  return ["top", "center", "bottom"];
}

export function computeCropRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  anchor: CropAnchor,
): CropRect {
  if (sourceWidth <= 0 || sourceHeight <= 0 || targetWidth <= 0 || targetHeight <= 0) {
    return { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight };
  }

  if (hasMatchingAspectRatio(sourceWidth, sourceHeight, targetWidth, targetHeight)) {
    return { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight };
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const sw = sourceHeight * targetRatio;
    const maxOffsetX = sourceWidth - sw;
    const sx = anchor === "left"
      ? 0
      : anchor === "right"
        ? maxOffsetX
        : maxOffsetX / 2;

    return {
      sx,
      sy: 0,
      sw,
      sh: sourceHeight,
    };
  }

  const sh = sourceWidth / targetRatio;
  const maxOffsetY = sourceHeight - sh;
  const sy = anchor === "top"
    ? 0
    : anchor === "bottom"
      ? maxOffsetY
      : maxOffsetY / 2;

  return {
    sx: 0,
    sy,
    sw: sourceWidth,
    sh,
  };
}
