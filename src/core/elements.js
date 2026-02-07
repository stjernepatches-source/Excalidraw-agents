// Core Excalidraw element factory functions
// Generates valid Excalidraw JSON elements with sensible defaults

let _idCounter = 0;

export function uid() {
  return `el_${Date.now()}_${++_idCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

export function seed() {
  return Math.floor(Math.random() * 2147483647);
}

// ── Base element with all required Excalidraw properties ──────────────────

function baseElement(overrides = {}) {
  return {
    id: uid(),
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 0,         // 0 = clean/architect, 1 = artist, 2 = cartoonist
    opacity: 100,
    angle: 0,
    x: 0,
    y: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    width: 100,
    height: 50,
    seed: seed(),
    groupIds: [],
    frameId: null,
    roundness: null,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    version: 1,
    versionNonce: seed(),
    isDeleted: false,
    ...overrides,
  };
}

// ── Rectangle ─────────────────────────────────────────────────────────────

export function rectangle({
  x = 0, y = 0, width = 200, height = 80,
  fill = "transparent", stroke = "#1e1e1e", strokeWidth = 2,
  roundness = { type: 3 }, opacity = 100, label = null,
  ...rest
} = {}) {
  const id = uid();
  const elements = [];

  const rect = baseElement({
    id,
    type: "rectangle",
    x, y, width, height,
    backgroundColor: fill,
    strokeColor: stroke,
    strokeWidth,
    roundness,
    opacity,
    boundElements: [],
    ...rest,
  });

  if (label) {
    const textEl = text({
      x: x + width / 2,
      y: y + height / 2,
      text: label.text || label,
      fontSize: label.fontSize || 20,
      color: label.color || stroke,
      textAlign: "center",
      verticalAlign: "middle",
      containerId: id,
    });
    rect.boundElements.push({ id: textEl.id, type: "text" });
    elements.push(rect, textEl);
  } else {
    elements.push(rect);
  }

  return elements.length === 1 ? elements[0] : elements;
}

// ── Ellipse ───────────────────────────────────────────────────────────────

export function ellipse({
  x = 0, y = 0, width = 120, height = 120,
  fill = "transparent", stroke = "#1e1e1e", strokeWidth = 2,
  ...rest
} = {}) {
  return baseElement({
    type: "ellipse",
    x, y, width, height,
    backgroundColor: fill,
    strokeColor: stroke,
    strokeWidth,
    roundness: { type: 2 },
    ...rest,
  });
}

// ── Diamond ───────────────────────────────────────────────────────────────

export function diamond({
  x = 0, y = 0, width = 120, height = 120,
  fill = "transparent", stroke = "#1e1e1e",
  ...rest
} = {}) {
  return baseElement({
    type: "diamond",
    x, y, width, height,
    backgroundColor: fill,
    strokeColor: stroke,
    roundness: { type: 2 },
    ...rest,
  });
}

// ── Text ──────────────────────────────────────────────────────────────────

export function text({
  x = 0, y = 0,
  text: content = "Text",
  fontSize = 20,
  fontFamily = 1, // 1=Virgil(hand), 2=Helvetica, 3=Cascadia(code)
  color = "#1e1e1e",
  textAlign = "left",       // "left" | "center" | "right"
  verticalAlign = "top",    // "top" | "middle"
  containerId = null,
  width = null,
  height = null,
  opacity = 100,
  ...rest
} = {}) {
  // Rough width/height estimation when not provided
  const charWidth = fontSize * 0.6;
  const lines = content.split("\n");
  const estimatedWidth = width || Math.max(...lines.map(l => l.length)) * charWidth;
  const estimatedHeight = height || lines.length * fontSize * 1.35;

  return baseElement({
    type: "text",
    x: containerId ? x : x,
    y: containerId ? y : y,
    width: estimatedWidth,
    height: estimatedHeight,
    text: content,
    fontSize,
    fontFamily,
    textAlign,
    verticalAlign,
    baseline: 0,
    containerId,
    originalText: content,
    autoResize: true,
    lineHeight: 1.25,
    strokeColor: color,
    backgroundColor: "transparent",
    fillStyle: "solid",
    opacity,
    ...rest,
  });
}

// ── Arrow ─────────────────────────────────────────────────────────────────

export function arrow({
  x = 0, y = 0,
  points = [[0, 0], [200, 0]],
  stroke = "#1e1e1e", strokeWidth = 2,
  startBinding = null, endBinding = null,
  ...rest
} = {}) {
  // Calculate width/height from points
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);

  return baseElement({
    type: "arrow",
    x, y, width, height,
    points,
    strokeColor: stroke,
    strokeWidth,
    startBinding,
    endBinding,
    startArrowhead: null,
    endArrowhead: "arrow",
    lastCommittedPoint: null,
    ...rest,
  });
}

// ── Line ──────────────────────────────────────────────────────────────────

export function line({
  x = 0, y = 0,
  points = [[0, 0], [200, 0]],
  stroke = "#1e1e1e", strokeWidth = 2,
  ...rest
} = {}) {
  const xs = points.map(p => p[0]);
  const ys = points.map(p => p[1]);

  return baseElement({
    type: "line",
    x, y,
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
    points,
    strokeColor: stroke,
    strokeWidth,
    startBinding: null,
    endBinding: null,
    startArrowhead: null,
    endArrowhead: null,
    lastCommittedPoint: null,
    ...rest,
  });
}

// ── Image element ─────────────────────────────────────────────────────────

export function image({
  x = 0, y = 0, width = 300, height = 200,
  fileId,
  ...rest
} = {}) {
  if (!fileId) throw new Error("image() requires a fileId");
  return baseElement({
    type: "image",
    x, y, width, height,
    fileId,
    status: "saved",
    scale: [1, 1],
    ...rest,
  });
}
