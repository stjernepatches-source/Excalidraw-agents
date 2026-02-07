// Scene builder: assembles elements into a valid .excalidraw JSON file

import { readFile } from "fs/promises";
import { extname } from "path";

export class Scene {
  constructor() {
    this.elements = [];
    this.files = {};
    this.appState = {
      gridSize: null,
      viewBackgroundColor: "#ffffff",
    };
  }

  /** Add one or more elements (handles arrays from labeled rectangles, etc.) */
  add(...items) {
    for (const item of items) {
      if (Array.isArray(item)) {
        this.elements.push(...item);
      } else {
        this.elements.push(item);
      }
    }
    return this;
  }

  /** Embed an image file and return a fileId for use with image() */
  async addImageFile(filePath) {
    const data = await readFile(filePath);
    const base64 = data.toString("base64");
    const ext = extname(filePath).slice(1).toLowerCase();
    const mimeMap = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      svg: "image/svg+xml",
      webp: "image/webp",
    };
    const mimeType = mimeMap[ext] || "image/png";
    const fileId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    this.files[fileId] = {
      mimeType,
      id: fileId,
      dataURL: `data:${mimeType};base64,${base64}`,
      created: Date.now(),
      lastRetrieved: Date.now(),
    };

    return fileId;
  }

  /** Add an image from a URL (data URL or base64 string) */
  addImageData(dataURL, mimeType = "image/png") {
    const fileId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.files[fileId] = {
      mimeType,
      id: fileId,
      dataURL,
      created: Date.now(),
      lastRetrieved: Date.now(),
    };
    return fileId;
  }

  /** Export the scene as a valid .excalidraw JSON object */
  toJSON() {
    return {
      type: "excalidraw",
      version: 2,
      source: "https://excalidraw.com",
      elements: this.elements,
      appState: this.appState,
      files: this.files,
    };
  }

  /** Serialize to string */
  toString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}
