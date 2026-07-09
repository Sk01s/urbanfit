import { useBasket } from '@/hooks';
import PropType from 'prop-types';
import React from 'react';
import ProductItem from './ProductItem';
import { expandSplitProducts } from '@/experimental/helpers/expandSplitProducts';

const ProductGrid = ({ products, isLoading }) => {
  const { addToBasket, isItemOnBasket } = useBasket();
  const displayProducts = expandSplitProducts(products);

  return (
    <div className="product-grid">
      {!isLoading && displayProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
          <p style={{ fontSize: '1.2rem' }}>No products found.</p>
        </div>
      ) : isLoading && displayProducts.length === 0 ? (
        new Array(12).fill({}).map((product, index) => (
          <ProductItem
            key={`product-skeleton ${index}`}
            product={product}
            skeleton
          />
        ))
      ) : (
        displayProducts.map((product) => (
          <ProductItem
            key={product.id + (product.selectedColor || '')}
            isItemOnBasket={isItemOnBasket}
            addToBasket={addToBasket}
            product={product}
          />
        ))
      )}
    </div>
  );
};

ProductGrid.propTypes = {
  products: PropType.array.isRequired,
  isLoading: PropType.bool,
};

ProductGrid.defaultProps = {
  isLoading: false,
};

export default ProductGrid;