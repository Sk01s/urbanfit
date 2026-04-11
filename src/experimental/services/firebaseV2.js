import app from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import firebaseConfig from "@/services/config";

class FirebaseV2 {
  constructor() {
    if (!app.apps.length) {
      this.app = app.initializeApp(firebaseConfig);
    } else {
      this.app = app.apps[0];
    }
    this.db = this.app.firestore();
    this.storage = this.app.storage();
    this.auth = this.app.auth();
  }

  getCurrentUser = () => {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  };

  generateKeyFallback = () => {
    return this.db.collection("products_v2").doc().id;
  };

  getProductsV2All = () => this.db.collection("products_v2").get();

  getSingleProductV2 = (id) =>
    this.db.collection("products_v2").doc(id).get();

  addProductV2 = (id, data) =>
    this.db.collection("products_v2").doc(id).set(data);

  updateProductV2 = (id, data) =>
    this.db.collection("products_v2").doc(id).update(data);

  deleteProductV2 = (id) =>
    this.db.collection("products_v2").doc(id).delete();

  saveBasketItemsV2 = (items, userId) =>
    this.db
      .collection("users")
      .doc(userId)
      .set({ basketV2: items }, { merge: true });

  addOrderV2 = async (id, order) => {
    const snapshot = await this.getProductsV2All();
    const products = snapshot.docs.map((doc) => ({
      id: doc.ref.id,
      ...doc.data(),
    }));

    const items = order.items.map((item) => {
      const product = products.find(({ id }) => id === item.id);
      return { ...item, ...product };
    });

    if (order.promo && order.promo.code) {
      order.promo.uses = (order.promo.uses || 0) + 1;
      await this.db
        .collection("promo")
        .doc(order.promo.code)
        .update({ uses: order.promo.uses });
    }

    await this.db
      .collection("orders_v2")
      .doc(id)
      .set({ ...order, otp: false, items });

    for (const item of order.items) {
      const product = products.find(({ id }) => id === item.id);
      if (!product || !product.colors) continue;

      const colorIndex = product.colors.findIndex(
        (c) => c.color === item.selectedColor
      );
      if (colorIndex === -1) {
        throw new Error(
          `Color ${item.selectedColor} not found in product ${item.id}`
        );
      }

      const variant = product.colors[colorIndex];
      const sizeKey = item.selectedSize;

      if (!variant.quantities) continue;

      const currentStock = variant.quantities[sizeKey] || 0;
      if (currentStock < item.quantity) {
        throw new Error("Product is out of stock");
      }

      variant.quantities[sizeKey] = currentStock - item.quantity;

      product.totalQuantity = product.colors.reduce(
        (sum, c) =>
          sum +
          Object.values(c.quantities || {}).reduce((a, b) => a + b, 0),
        0
      );

      await this.db.collection("products_v2").doc(item.id).set(product);
    }
  };

  removeOrderV2 = (id, order) => {
    order.items.map(async (item) => {
      const doc = await this.getSingleProductV2(item.id);
      if (!doc.exists) return;

      const product = { id: doc.ref.id, ...doc.data() };
      if (!product.colors) return;

      const colorIndex = product.colors.findIndex(
        (c) => c.color === item.selectedColor
      );
      if (colorIndex === -1) return;

      const variant = product.colors[colorIndex];
      const sizeKey = item.selectedSize;

      if (variant.quantities && variant.quantities[sizeKey] !== undefined) {
        variant.quantities[sizeKey] += item.quantity;
      }

      product.totalQuantity = product.colors.reduce(
        (sum, c) =>
          sum +
          Object.values(c.quantities || {}).reduce((a, b) => a + b, 0),
        0
      );

      await this.db.collection("products_v2").doc(item.id).set(product);
    });
    return this.db.collection("orders_v2").doc(id).delete();
  };

  uploadProductImageV2 = (file) => {
    const ref = this.storage.ref("products_v2").child(file.name);
    return ref.put(file).then(() => ref.getDownloadURL());
  };

  deleteImageV2 = (id) =>
    this.storage.ref("products_v2").child(id).delete();
}

const firebaseV2 = new FirebaseV2();
export default firebaseV2;