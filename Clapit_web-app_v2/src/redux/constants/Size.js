const SCREEN_SIZE_WHEN_LOADED = typeof window !== 'undefined' ? Math.max(document.documentElement.clientWidth, window.innerWidth || 0) : 700;
// const SCREEN_SIZE_WHEN_LOADED = 700;
export const MAX_PAGE_WIDTH = SCREEN_SIZE_WHEN_LOADED > 700 ? 700 : SCREEN_SIZE_WHEN_LOADED;
export const HEADER_HEIGHT = 70;

