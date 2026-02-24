export type LabelAlign = "left" | "center" | "right";

export type LabelDraft = {
  key: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  align: LabelAlign;
  maxLines: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeLabelDraft(input: LabelDraft): LabelDraft {
  return {
    ...input,
    x: clamp(input.x, 0, 1),
    y: clamp(input.y, 0, 1),
    width: clamp(input.width, 0.05, 1),
    fontSize: clamp(input.fontSize, 0.01, 0.2),
    fontWeight: clamp(Math.round(input.fontWeight), 300, 900),
    maxLines: clamp(Math.round(input.maxLines), 1, 6),
  };
}

export function applyDragDelta(
  origin: Pick<LabelDraft, "x" | "y">,
  context: { deltaX: number; deltaY: number; canvasWidth: number; canvasHeight: number },
): Pick<LabelDraft, "x" | "y"> {
  const width = Math.max(1, context.canvasWidth);
  const height = Math.max(1, context.canvasHeight);

  const nextX = clamp(origin.x + context.deltaX / width, 0, 1);
  const nextY = clamp(origin.y + context.deltaY / height, 0, 1);

  return { x: Number(nextX.toFixed(4)), y: Number(nextY.toFixed(4)) };
}
