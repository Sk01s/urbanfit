# Split by Color — Feature Documentation

## Overview

The "Split by Color" feature allows admin users to toggle a product flag (`splitByColor`) that causes each color variant to appear as a **separate product card** on all listing pages, instead of showing only the first color. Clicking any color card navigates to the original product detail page with that color pre-selected via a `?color=<hex>` URL parameter.

## Data Flow

### Product Form (Admin)
- `ProductFormV2.jsx` now includes a `splitByColor` checkbox toggle
- When saved, `splitByColor` (boolean) is stored in the product document in Firestore `products_v2` collection

### Product Display
- `expandProductForDisplay(product)` in `getProductVariant.js` is the core helper:
  - If `product.splitByColor === true`: returns **one item per color** in `product.colors`, each with:
    - `name` appended with ` — <ColorName>`
    - `displayColor` (hex value) for URL routing
    - `_displayKey` = `${product.id}_${color}` for unique React keys
  - Otherwise: returns a single item (first color variant, original name)

- All listing pages call `products.flatMap(p => expandProductForDisplay(p))` before passing to display components

### Product Card Navigation
- `ProductFeatured.jsx` and `ProductItem.jsx`: if `product.displayColor` exists, navigate to `/product/${id}?color=<encoded hex>` instead of `/product/${id}`

### Product Detail Page
- `useProductV2.js` reads the `?color=` query parameter from the URL
- If a valid color is found in the product's colors, it's used as the initial `selectedColor`
- This ensures clicking a color card from any listing page lands on the product page with that color already selected

## Files Modified

### Core Feature
| File | Change |
|------|--------|
| `src/experimental/helpers/getProductVariant.js` | Added `expandProductForDisplay()` function |
| `src/experimental/views/admin/components/ProductFormV2.jsx` | Added `splitByColor` checkbox, FormSchema field, initFormikValues, PropTypes |
| `src/experimental/views/admin/add_product/index.jsx` | Added `splitByColor: false` to default product object |
| `src/experimental/hooks/useProductV2.js` | Reads `?color=` from URL query param for initial color selection |
| `src/experimental/views/view_product/index.jsx` | Uses `expandProductForDisplay` for related products |
| `src/experimental/views/shop/index.jsx` | Uses `expandProductForDisplay` instead of `getProductVariant` |
| `src/components/product/ProductFeatured.jsx` | Navigates with `?color=` param when `displayColor` exists |
| `src/components/product/ProductItem.jsx` | Navigates with `?color=` param when `displayColor` exists |
| `src/components/product/ProductShowcaseGrid.jsx` | Uses `_displayKey` for React keys |
| `src/components/product/ProductGrid.jsx` | Uses `_displayKey` for React keys |

### All Listing Pages Updated to v2 Data
| File | Change |
|------|--------|
| `src/views/home/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/shop/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/featured/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/recommended/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/new/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/luxury/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/cool/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/best-seller/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/sex/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/men/Category.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/men/type.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/tops/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/bottoms/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/hoodies_sweats/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/jackects/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |
| `src/views/sets/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` |

### Search, Wish, Admin
| File | Change |
|------|--------|
| `src/experimental/views/search/index.jsx` | New v2 search page using `useProductsV2` + client-side filtering + `expandProductForDisplay` |
| `src/views/wish/index.jsx` | Uses `useProductsV2` + `expandProductForDisplay` for wish list |
| `src/views/admin/components/ProductItem.jsx` | v2-aware delete (uses `firebaseV2.deleteProductV2` when v2Enabled) |
| `src/views/admin/components/ProductsTable.jsx` | Uses `_displayKey` for React keys |
| `src/routers/AppRouter.jsx` | Search route: `v2Enabled ? SearchV2 : view.Search` |

## Key Concepts

- **`splitByColor`**: Boolean field on product stored in Firestore. When `true`, each color variant appears as a separate card.
- **`displayColor`**: Hex color string added to expanded items by `expandProductForDisplay`. Used for URL param routing.
- **`_displayKey`**: Unique key (`productId_colorHex`) for React list rendering. Falls back to `productId` for non-expanded items.
- **Admin listing does NOT split by color** — shows one row per product for clear admin control.

## Not Updated (Known Limitations)

- **Navigation/MobileNavigation sidebar**: Still uses `useEssentialProducts` (v1 data). These are nav drawer items only.
- **v1 Search**: Original `Search` component preserved for when `v2Enabled=false`. Uses Redux v1 search action.