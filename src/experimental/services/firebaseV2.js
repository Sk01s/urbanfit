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

  getOrderV2 = (id) =>
    this.db.collection("orders_v2").doc(id).get();

  getUserOrdersV2 = () =>
    this.db
      .collection("orders_v2")
      .where("uid", "==", this.auth.currentUser.uid)
      .get();

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
    const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";
    const user = this.auth.currentUser;
    if (!user) throw new Error("You must be signed in to place an order");

    const idToken = await user.getIdToken();

    const response = await fetch(`${BACKEND_API_URL}/api/orders/v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ ...order, id }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        const error = new Error(data.error || "Product is out of stock");
        error.item = data.item;
        throw error;
      }
      throw new Error(data.error || data.message || "Failed to create order");
    }

    return data.order;
  };

  removeOrderV2 = async (id, order) => {
    const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3001";
    const user = this.auth.currentUser;
    if (!user) throw new Error("You must be signed in to delete an order");

    const idToken = await user.getIdToken();

    const response = await fetch(`${BACKEND_API_URL}/api/orders/v2/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ items: order.items }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to delete order");
    }

    return data;
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