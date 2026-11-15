export const PHOTO = {
  dha: "/images/house-dha.jpg",
  marla: "/images/house-marla.jpg",
  farm: "/images/farmhouse.jpg",
  aptE: "/images/apartment-ext.jpg",
  aptI: "/images/apartment-int.jpg",
  plot: "/images/plot.jpg",
  isb: "/images/house-isb.jpg",
  plaza: "/images/plaza.jpg",
  pent: "/images/penthouse.jpg",
  proj: "/images/project.jpg",
  dusk: "/images/villa-dusk.jpg",
  shop: "/images/shop.jpg",
  bed: "/images/bedroom.jpg",
  kit: "/images/kitchen.jpg",
} as const;

export const HOUSE_LUX = [PHOTO.dha, PHOTO.dusk, PHOTO.aptI, PHOTO.bed, PHOTO.kit];
export const HOUSE_SM = [PHOTO.marla, PHOTO.aptI, PHOTO.kit, PHOTO.bed];
export const HOUSE_ISB = [PHOTO.isb, PHOTO.aptI, PHOTO.bed, PHOTO.kit];
export const FARM = [PHOTO.farm, PHOTO.dha, PHOTO.kit, PHOTO.bed];
export const FLAT = [PHOTO.aptE, PHOTO.aptI, PHOTO.pent, PHOTO.bed];
export const PENT = [PHOTO.pent, PHOTO.aptI, PHOTO.aptE, PHOTO.bed];
export const PLOT = [PHOTO.plot, PHOTO.proj];
export const COMM = [PHOTO.plaza, PHOTO.shop];
export const SHOP = [PHOTO.shop, PHOTO.plaza];
export const PROJ = [PHOTO.proj, PHOTO.marla, PHOTO.plot, PHOTO.dha];

/** Pick default photos for a listing that has none uploaded.
 *  Commercial → plaza/shop. Residential: small area → small house, large → large house.
 */
export function defaultImagesFor(category: string, areaSqft: number): string[] {
  if (category === "commercial" || category === "shop" || category === "office" || category === "plaza") {
    return COMM;
  }
  if (category === "plot") return PLOT;
  if (category === "flat" || category === "apartment") {
    return areaSqft >= 2500 ? PENT : FLAT;
  }
  if (category === "farmhouse" || category === "farm") return FARM;
  // Houses and other residential: small ≤ 5 marla (~1,361 sq ft), large above that
  const SMALL_THRESHOLD = 5 * 272.25; // 5 marla
  return areaSqft <= SMALL_THRESHOLD ? HOUSE_SM : HOUSE_LUX;
}
