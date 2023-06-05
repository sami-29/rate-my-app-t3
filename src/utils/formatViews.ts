export const formatViews = (views: number): string => {
  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B views`;
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M views`;
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K views`;
  } else {
    return `${views} views`;
  }
};
