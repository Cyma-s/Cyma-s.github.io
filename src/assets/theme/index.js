const GRAY9 = "#191919"
const GRAY8 = "#2D2D2D"
const GRAY7 = "#404040"
const GRAY6 = "#868e96"
const GRAY5 = "#adb5bd"
const GRAY4 = "#ced4da"
const GRAY3 = "#dee2e6"
const GRAY2 = "#e9ecef"
const GRAY1 = "#f1f3f5"
const GRAY0 = "#f8f9fa"

const BLUE_BASE = "#d6e6fd"
const BLUE_BASE_DARK = "#1e2024"
const BLUE_MAIN = "#94bef9"
const BLUE_ACCENT = "#1771F2"
const BLUE_ACCENT_BRIGHT = "#1DAAFF"
const BLUE_ACCENT_DARK = "#062045"
const BLUE_MORE_ACCENT = "#1771f2"
const PINK_ACCENT = "#F21671"
const PINK_ACCENT_BRIGHT = "#FF1777"
const PINK_BASE = "#F993BD"
const PINK_ACCENT_DARK = "#450620"
const GREEN_ACCENT_BRIGHT = "#53F6B3"

export const light = {
  name: "light",
  colors: {
    bodyBackground: "#ffffff",
    text: GRAY9,
    secondaryText: GRAY7,
    tertiaryText: GRAY6,
    mutedText: GRAY5,
    accentText: BLUE_ACCENT,
    secondAccentText: PINK_ACCENT,
    thirdAccentText: GREEN_ACCENT_BRIGHT,
    flipAccentText: PINK_ACCENT,
    flipAccentOppositeText: BLUE_ACCENT_BRIGHT,
    accentBrightText: BLUE_ACCENT_BRIGHT,
    hoveredLinkText: BLUE_ACCENT,
    border: GRAY4,
    activatedBorder: PINK_ACCENT,
    background: GRAY1,
    icon: PINK_ACCENT,
    divider: GRAY2,
    headerBackground: "rgba(255, 255, 255, 0.85)",
    headerShadow: "rgba(0, 0, 0, 0.08)",
    inlineCodeBackground: GRAY2,
    inlineCodeBackgroundDarker: GRAY4,
    tagBackground: GRAY1,
    selectedTagBackground: PINK_ACCENT,
    hoveredTagBackground: GREEN_ACCENT_BRIGHT,
    hoveredSelectedTagBackground: GRAY8,
    nextPostButtonBackground: BLUE_BASE,
    hoveredNextPostButtonBackground: BLUE_MAIN,
    seriesBackground: GRAY1,
    tagText: GRAY9,
    selectedTagText: GRAY0,
    spinner: GRAY7,
    scrollTrack: GRAY1,
    scrollHandle: GRAY4,
    blockQuoteBorder: GRAY4,
    blockQuoteBackground: GRAY1,
    textFieldBorder: GRAY4,
    textFieldActivatedBorder: GRAY5,
    tableBackground: GRAY1,
  },
}

export const dark = {
  name: "dark",
  colors: {
    bodyBackground: GRAY9,
    text: GRAY0,
    secondaryText: GRAY4,
    tertiaryText: GRAY5,
    mutedText: GRAY6,
    accentText: BLUE_ACCENT_BRIGHT,
    accentBrightText: BLUE_ACCENT_BRIGHT,
    secondAccentText: PINK_ACCENT_BRIGHT,
    thirdAccentText: GREEN_ACCENT_BRIGHT,
    flipAccentText: BLUE_ACCENT_BRIGHT,
    flipAccentOppositeText: PINK_ACCENT_BRIGHT,
    hoveredLinkText: PINK_ACCENT_BRIGHT,
    border: GRAY5,
    activatedBorder: GRAY3,
    background: GRAY8,
    icon: BLUE_ACCENT_BRIGHT,
    divider: GRAY8,
    headerBackground: "rgba(25, 25, 25, 0.85)",
    headerShadow: "rgba(150, 150, 150, 0.08)",
    inlineCodeBackground: GRAY8,
    inlineCodeBackgroundDarker: GRAY7,
    tagBackground: GRAY8,
    selectedTagBackground: "#53F6B3",
    hoveredTagBackground: "#F61874",
    hoveredSelectedTagBackground: GRAY1,
    nextPostButtonBackground: GRAY9,
    hoveredNextPostButtonBackground: BLUE_BASE_DARK,
    seriesBackground: GRAY8,
    tagText: GRAY2,
    selectedTagText: GRAY9,
    spinner: GRAY1,
    scrollTrack: GRAY8,
    scrollHandle: GRAY7,
    blockQuoteBorder: GRAY7,
    blockQuoteBackground: GRAY8,
    textFieldBorder: GRAY7,
    textFieldActivatedBorder: GRAY6,
    tableBackground: "#292e33",
  },
}
