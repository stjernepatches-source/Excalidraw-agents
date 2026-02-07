// Modern, clean color palette for hotel front desk visualizations

export const PALETTE = {
  // Primary brand colors
  navy:       "#1B2A4A",
  blue:       "#228BE6",
  lightBlue:  "#D0EBFF",
  teal:       "#12B886",
  lightTeal:  "#C3FAE8",

  // Accent
  coral:      "#FF6B6B",
  lightCoral: "#FFE3E3",
  amber:      "#FAB005",
  lightAmber: "#FFF3BF",
  purple:     "#7950F2",
  lightPurple:"#E5DBFF",

  // Neutrals
  white:      "#FFFFFF",
  offWhite:   "#F8F9FA",
  lightGrey:  "#DEE2E6",
  grey:       "#868E96",
  darkGrey:   "#495057",
  dark:       "#212529",

  // Semantic
  success:    "#40C057",
  warning:    "#FAB005",
  danger:     "#FA5252",

  // Script line color (very light grey for teleprompter lines)
  script:     "#CED4DA",
};

// Pre-built themes for different slide types
export const THEMES = {
  hero: {
    bg: PALETTE.navy,
    text: PALETTE.white,
    accent: PALETTE.blue,
  },
  stats: {
    bg: PALETTE.white,
    text: PALETTE.dark,
    accent: PALETTE.blue,
    highlight: PALETTE.teal,
  },
  comparison: {
    bg: PALETTE.white,
    text: PALETTE.dark,
    before: PALETTE.coral,
    after: PALETTE.teal,
  },
  joke: {
    bg: PALETTE.offWhite,
    text: PALETTE.darkGrey,
    accent: PALETTE.amber,
  },
};
