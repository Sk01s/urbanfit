export function getProductVariant(product, selectedColor) {
  if (!product || !product.colors || !product.colors.length) return null;

  const variant = selectedColor
    ? product.colors.find((c) => c.color === selectedColor) ||
      product.colors[0]
    : product.colors[0];

  if (!variant) return null;

  const totalQuantity = product.colors.reduce(
    (sum, c) =>
      sum + Object.values(c.quantities || {}).reduce((a, b) => a + b, 0),
    0
  );

  const variantGallery = (variant.imageCollection || []).filter(
    (img) => img.url !== variant.image
  );

  return {
    ...product,
    image: variant.image || (product.sharedImages && product.sharedImages[0] ? product.sharedImages[0].url : ""),
    imageCollection: [
      ...(variant.image ? [{ id: `variant-thumb-${variant.color}`, url: variant.image }] : []),
      ...(variantGallery),
      ...(product.sharedImages || []),
    ],
    availableColors: product.colors.map((c) => c.color),
    colorNames: product.colors.map((c) => ({
      color: c.color,
      name: c.name,
    })),
    activeVariant: variant,
    activeColor: variant.color,
    activeColorName: variant.name,
    smQuantity: (variant.quantities && variant.quantities.sm) || 0,
    mdQuantity: (variant.quantities && variant.quantities.md) || 0,
    lgQuantity: (variant.quantities && variant.quantities.lg) || 0,
    xlQuantity: (variant.quantities && variant.quantities.xl) || 0,
    xsQuantity: (variant.quantities && variant.quantities.xs) || 0,
    totalQuantity,
  };
}

export function getVariantStock(activeVariant, selectedSize) {
  if (!activeVariant || !activeVariant.quantities || !selectedSize) return 0;
  return activeVariant.quantities[selectedSize] || 0;
}

export function expandProductForDisplay(product) {
  if (!product || !product.colors || !product.colors.length) return [];

  if (product.splitByColor) {
    return product.colors.map((colorVariant) => {
      const variant = getProductVariant(product, colorVariant.color);
      return {
        ...variant,
        name: `${product.name} \u2014 ${colorVariant.name || colorVariant.color}`,
        displayColor: colorVariant.color,
        _displayKey: `${product.id}_${colorVariant.color}`,
      };
    });
  }

  const variant = getProductVariant(product, product.colors[0].color);
  if (!variant) return [];
  return [{ ...variant, _displayKey: product.id }];
}