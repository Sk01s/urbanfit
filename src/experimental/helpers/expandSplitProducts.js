import { getProductVariant } from "./getProductVariant";

export function expandSplitProducts(products) {
  if (!products || !products.length) return [];

  const sizes = ["xs", "sm", "md", "lg", "xl"];

  return products.flatMap((product) => {
    if (!product) return [];
    if (product.selectedColor) return [product];

    if (!product.splitByColor || !product.colors?.length) {
      const variant = getProductVariant(product, product.colors?.[0]?.color);
      return variant ? [variant] : [product];
    }

    return product.colors
      .map((color) => {
        const variant = getProductVariant(product, color.color);
        if (!variant) return null;
        const smallestSize = sizes.find(
          (s) => variant[`${s}Quantity`] > 0
        );
        return {
          ...variant,
          name: `${product.name} -- ${color.name}`,
          selectedColor: color.color,
          selectedColorName: color.name,
          selectedSize: smallestSize || "sm",
          totalQuantity: Object.values(color.quantities || {}).reduce(
            (a, b) => a + b,
            0
          ),
        };
      })
      .filter(Boolean);
  });
}
