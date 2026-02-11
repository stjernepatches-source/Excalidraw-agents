// Renders a Claude-generated scene spec into Excalidraw elements

import { Scene } from "../src/core/scene.js";
import { PALETTE } from "../src/core/colors.js";
import { titleSlide, sectionHeader } from "../src/templates/titleSlide.js";
import { statRow } from "../src/templates/statCard.js";
import { barChart, comparisonBars } from "../src/templates/barChart.js";
import { timeline } from "../src/templates/timeline.js";
import { comparison, featureGrid } from "../src/templates/comparison.js";
import { scriptBlock } from "../src/templates/scriptLine.js";
import { imagePlaceholder } from "../src/templates/imagePanel.js";

const COLOR_MAP = {
  blue: PALETTE.blue,
  teal: PALETTE.teal,
  coral: PALETTE.coral,
  amber: PALETTE.amber,
  purple: PALETTE.purple,
  navy: PALETTE.navy,
  green: PALETTE.success,
  red: PALETTE.danger,
};

function resolveColor(name) {
  return COLOR_MAP[name] || PALETTE.blue;
}

/**
 * Render a scene spec (from Claude) into an Excalidraw Scene.
 */
export function renderSpec(spec) {
  const scene = new Scene();

  for (const slide of spec.slides || []) {
    const baseY = slide.y_offset || 0;
    let localY = baseY;
    let localX = 60;

    for (const comp of slide.components || []) {
      try {
        const elements = renderComponent(comp, localX, localY);
        if (elements) {
          scene.add(...(Array.isArray(elements) ? elements : [elements]));
          // Advance Y for next component on this slide
          localY += estimateHeight(comp);
        }
      } catch (err) {
        console.warn(`Failed to render component ${comp.type}:`, err.message);
      }
    }
  }

  return scene;
}

function renderComponent(comp, x, y) {
  switch (comp.type) {
    case "title_slide":
      return titleSlide({
        title: comp.title || "Untitled",
        subtitle: comp.subtitle || "",
        y,
      });

    case "section_header":
      return sectionHeader({
        title: comp.title || "Section",
        x,
        y,
        accentColor: resolveColor(comp.accent_color),
      });

    case "stat_row":
      return statRow({
        x,
        y,
        stats: (comp.stats || []).map((s) => ({
          value: String(s.value),
          label: s.label || "",
          sublabel: s.sublabel || "",
          color: resolveColor(s.color),
        })),
        cardWidth: comp.card_width || 280,
      });

    case "bar_chart":
      return barChart({
        title: comp.title || "Chart",
        data: (comp.data || []).map((d) => ({
          label: d.label || "",
          value: d.value || 0,
          color: resolveColor(d.color),
        })),
        x,
        y,
        width: comp.width || 700,
        height: comp.height || 400,
        unit: comp.unit || "",
      });

    case "comparison_bars":
      return comparisonBars({
        title: comp.title || "Comparison",
        beforeLabel: comp.before_label || "Before",
        afterLabel: comp.after_label || "After",
        data: (comp.data || []).map((d) => ({
          label: d.label || "",
          before: d.before || 0,
          after: d.after || 0,
        })),
        x,
        y,
        unit: comp.unit || "",
        beforeColor: resolveColor(comp.before_color || "coral"),
        afterColor: resolveColor(comp.after_color || "teal"),
      });

    case "timeline":
      return timeline({
        title: comp.title || "Process",
        steps: (comp.steps || []).map((s, i) => ({
          label: s.label || `Step ${i + 1}`,
          detail: s.detail || "",
          color: s.color ? resolveColor(s.color) : undefined,
        })),
        x,
        y,
      });

    case "comparison":
      return comparison({
        title: comp.title || "",
        leftTitle: comp.left_title || "Before",
        rightTitle: comp.right_title || "After",
        leftColor: resolveColor(comp.left_color || "coral"),
        rightColor: resolveColor(comp.right_color || "teal"),
        items: (comp.items || []).map((item) => ({
          left: item.left || "",
          leftDetail: item.left_detail || "",
          right: item.right || "",
          rightDetail: item.right_detail || "",
        })),
        x,
        y,
        width: comp.width || 1000,
      });

    case "feature_grid":
      return featureGrid({
        title: comp.title || "",
        columns: comp.columns || ["Traditional", "AI-Powered"],
        features: (comp.features || []).map((f) => ({
          name: f.name || "",
          values: f.values || [false, true],
        })),
        x,
        y,
        width: comp.width || 700,
      });

    case "image_placeholder":
      return imagePlaceholder({
        x: comp.x || 950,
        y: comp.y || y,
        width: comp.width || 380,
        height: comp.height || 260,
        label: comp.label || "📷 Add image here",
        caption: comp.caption || "",
      });

    case "script_lines":
      return scriptBlock({
        lines: (comp.lines || []).map((l) => ({
          text: l.text || "",
          type: l.line_type || "talking-point",
        })),
        x,
        y,
      });

    default:
      console.warn(`Unknown component type: ${comp.type}`);
      return null;
  }
}

function estimateHeight(comp) {
  switch (comp.type) {
    case "title_slide":
      return 950;
    case "section_header":
      return 60;
    case "stat_row":
      return 220;
    case "bar_chart":
      return 470;
    case "comparison_bars":
      return 470;
    case "timeline":
      return 230;
    case "comparison":
      return 70 + (comp.items?.length || 3) * 70 + 60;
    case "feature_grid":
      return 70 + (comp.features?.length || 5) * 45 + 40;
    case "image_placeholder":
      return (comp.height || 260) + 50;
    case "script_lines":
      return (comp.lines?.length || 1) * 35 + 20;
    default:
      return 100;
  }
}
