/* eslint-disable react/forbid-prop-types */
import PropType from 'prop-types';
import React from 'react';
import { ProductItem } from '.';

const ProductsTable = ({ filteredProducts, isLoading }) => (
  <div>
    {filteredProducts.length > 0 && (
      <div className="grid grid-product grid-count-6">
        <div className="grid-col" />
        <div className="grid-col">
          <h5>Name</h5>
        </div>
        <div className="grid-col">
          <h5>Type</h5>
        </div>
        <div className="grid-col">
          <h5>Price</h5>
        </div>
        <div className="grid-col">
          <h5>Date Added</h5>
        </div>
        <div className="grid-col">
          <h5>Qty</h5>
        </div>
      </div>
    )}
    {!isLoading && filteredProducts.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
        <p style={{ fontSize: '1.2rem' }}>No products found.</p>
      </div>
    ) : isLoading && filteredProducts.length === 0 ? (
      new Array(10).fill({}).map((product, index) => (
        <ProductItem
          key={`product-skeleton ${index}`}
          product={product}
        />
      ))
    ) : (
      filteredProducts.map((product) => (
        <ProductItem
          key={product._displayKey || product.id}
          product={product}
        />
      ))
    )}
  </div>
);

ProductsTable.propTypes = {
  filteredProducts: PropType.array.isRequired,
  isLoading: PropType.bool,
};

ProductsTable.defaultProps = {
  isLoading: false,
};

export default ProductsTable;