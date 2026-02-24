export type WrapTextInput = {
  text: string;
  maxWidthPx: number;
  fontSizePx: number;
  maxLines: number;
};

function estimateCharsPerLine(maxWidthPx: number, fontSizePx: number): number {
  const avgCharWidth = Math.max(1, fontSizePx * 0.58);
  return Math.max(1, Math.floor(maxWidthPx / avgCharWidth));
}

function splitLongToken(token: string, chunkSize: number): string[] {
  if (token.length <= chunkSize) {
    return [token];
  }

  const chunks: string[] = [];
  for (let index = 0; index < token.length; index += chunkSize) {
    chunks.push(token.slice(index, index + chunkSize));
  }
  return chunks;
}

function appendEllipsis(value: string): string {
  if (value.endsWith("...")) {
    return value;
  }
  return `${value.replace(/\.*$/, "")}...`;
}

export function wrapTextToLines({ text, maxWidthPx, fontSizePx, maxLines }: WrapTextInput): string[] {
  const normalizedText = text.trim();
  if (!normalizedText) {
    return [""];
  }

  const allowedLines = Math.max(1, Math.floor(maxLines));
  const charsPerLine = estimateCharsPerLine(maxWidthPx, fontSizePx);
  const hasWhitespace = /\s/.test(normalizedText);
  const tokens = hasWhitespace
    ? normalizedText
      .split(/\s+/)
      .flatMap((token) => splitLongToken(token, charsPerLine))
    : splitLongToken(normalizedText, charsPerLine);

  const lines: string[] = [];

  for (const token of tokens) {
    if (lines.length === 0) {
      lines.push(token);
      continue;
    }

    const separator = hasWhitespace ? " " : "";
    const current = lines[lines.length - 1] ?? "";
    const candidate = `${current}${separator}${token}`.trim();

    if (candidate.length <= charsPerLine) {
      lines[lines.length - 1] = candidate;
      continue;
    }

    lines.push(token);
  }

  if (lines.length <= allowedLines) {
    return lines;
  }

  const clipped = lines.slice(0, allowedLines);
  clipped[allowedLines - 1] = appendEllipsis(clipped[allowedLines - 1] ?? "");
  return clipped;
}
