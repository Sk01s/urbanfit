import app from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import firebaseConfig from "./config";
import { displayActionMessage } from "@/helpers/utils";
import dayjs from "dayjs";
import { isTodayBetweenDates } from "@/helpers/utils";

// Backend API URL - configured via environment variable
const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://0.0.0.0:3001";

class Firebase {
  constructor() {
    this.app = app.initializeApp(firebaseConfig);

    this.storage = app.storage();
    this.db = app.firestore();
    this.auth = app.auth();
  }

  // AUTH ACTIONS ------------

  createAccount = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  generateRandomNumbers = () => {
    if (10 < 6) {
      throw new Error(
        "Cannot generate unique random numbers. Range is too small."
      );
    }

    let result = "";
    while (result.length < 6) {
      const randomNumber = Math.floor(Math.random() * 9).toString();
      if (!result.includes(randomNumber)) {
        result += randomNumber;
      }
    }

    return result;
  };

  // Example usage: Generate 6 random numbers between 1 and 49

  generateRecaptcha = (number, setModel, setError, setRec) => {
    const recaptchaVerifier = new app.auth.RecaptchaVerifier("container", {
      size: "normal",

      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      "expired-callback": () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...

        displayActionMessage("solve it reCAPTCHA  again");
      },
    });
    window.recaptchaVerifier = recaptchaVerifier;
    // [START auth_phone_recaptcha_render]
    recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;

      recaptchaVerifier.verify().then((e) => {
        const recaptchaResponse = grecaptcha.getResponse(recaptchaWidgetId);
        this.requestPhoneOtp(number)
          .then(() => {
            setModel(true);
            setRec(false);
          })
          .catch((error) => {
            console.log(error);
            setModel(false);
            setError(error);
            displayActionMessage(error);
          });
      });
    });
    return recaptchaVerifier;
  };

  confiremOtp = (otp) => {
    return window.confirmationResult
      .confirm(otp)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        // ...
        return result;
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        throw error.message;
      });
  };
  unlinkMobile = () => {
    this.auth.currentUser.unlink(app.auth.PhoneAuthProvider.PROVIDER_ID);
  };
  requestPhoneOtp = async (
    number,
    recaptchaVerifier = window.recaptchaVerifier
  ) => {
    return this.auth.currentUser
      .linkWithPhoneNumber(number, recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
        return confirmationResult;
      })
      .catch((e) => {
        console.log(e);
        throw e;
      });
  };

  signInWithGoogle = () =>
    this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  signOut = () => this.auth.signOut();

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => this.db.collection("users").doc(id).set(user);
  addPromo = (id, user) => this.db.collection("promo").doc(id).set(user);
  addError = (id, error) => this.db.collection("error").doc(id).set(error);

  getUser = (id) => this.db.collection("users").doc(id).get();

  getCurrentUser = () => this.db.auth?.currentUser;

  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    return user.reauthenticateWithCredential(cred);
  };

  updateEmail = (currentPassword, newEmail) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              resolve("Email Successfully updated");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  updateProfile = (id, updates) =>
    this.db.collection("users").doc(id).update(updates);

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });

  saveBasketItems = (items, userId) =>
    this.db.collection("users").doc(userId).update({ basket: items });

  setAuthPersistence = () =>
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);

  //  PRODUCT ACTIONS --------------

  getSingleProduct = (id) => this.db.collection("products").doc(id).get();

  getProducts = (lastRefKey) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        if (lastRefKey) {
          try {
            const query = this.db
              .collection("products")
              .orderBy(app.firestore.FieldPath.documentId())
              .startAfter(lastRefKey)
              .limit(12);

            const snapshot = await query.get();
            const products = [];
            snapshot.forEach((doc) =>
              products.push({ id: doc.id, ...doc.data() })
            );
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ products, lastKey });
          } catch (e) {
            reject(e?.message || ":( Failed to fetch products.");
          }
        } else {
          const timeout = setTimeout(() => {
            didTimeout = true;
            reject(new Error("Request timeout, please try again"));
          }, 15000);

          try {
            const totalQuery = await this.db.collection("products").get();
            const total = totalQuery.docs.length;
            const query = this.db
              .collection("products")
              .orderBy(app.firestore.FieldPath.documentId())
              .limit(12);
            const snapshot = await query.get();

            clearTimeout(timeout);
            if (!didTimeout) {
              const products = [];
              snapshot.forEach((doc) =>
                products.push({ id: doc.id, ...doc.data() })
              );
              const lastKey = snapshot.docs[snapshot.docs.length - 1];

              resolve({ products, lastKey, total });
            }
          } catch (e) {
            if (didTimeout) return;
            reject(e?.message || ":( Failed to fetch products.");
          }
        }
      })();
    });
  };

  searchProducts = (searchKey) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        const productsRef = this.db.collection("products");

        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          const searchedNameRef = productsRef
            .orderBy("name_lower")
            .where("name_lower", ">=", searchKey)
            .where("name_lower", "<=", `${searchKey}\uf8ff`)
            .limit(12);
          const searchedKeywordsRef = productsRef
            .orderBy("dateAdded", "desc")
            .where("keywords", "array-contains-any", searchKey.split(" "))
            .limit(12);

          // const totalResult = await totalQueryRef.get();
          const nameSnaps = await searchedNameRef.get();
          const keywordsSnaps = await searchedKeywordsRef.get();
          // const total = totalResult.docs.length;

          clearTimeout(timeout);
          if (!didTimeout) {
            const searchedNameProducts = [];
            const searchedKeywordsProducts = [];
            let lastKey = null;

            if (!nameSnaps.empty) {
              nameSnaps.forEach((doc) => {
                searchedNameProducts.push({ id: doc.id, ...doc.data() });
              });
              lastKey = nameSnaps.docs[nameSnaps.docs.length - 1];
            }

            if (!keywordsSnaps.empty) {
              keywordsSnaps.forEach((doc) => {
                searchedKeywordsProducts.push({ id: doc.id, ...doc.data() });
              });
            }

            // MERGE PRODUCTS
            const mergedProducts = [
              ...searchedNameProducts,
              ...searchedKeywordsProducts,
            ];
            const hash = {};

            mergedProducts.forEach((product) => {
              hash[product.id] = product;
            });

            resolve({ products: Object.values(hash), lastKey });
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  getSeasonalProducts = () =>
    this.db.collection("products").where("isSeasonal", "==", true).get();

  getEsssentialProducts = () =>
    this.db.collection("products").where("isEssential", "==", true).get();
  getProductsAll = () => this.db.collection("products").get();

  addProduct = (id, product) =>
    this.db.collection("products").doc(id).set(product);

  generateKey = () => this.db.collection("products").doc().id;

  storeImage = async (id, folder, imageFile, useBackblazeB2 = true) => {
    // Check if Backblaze B2 should be used (based on feature flag or parameter)
    if (useBackblazeB2) {
      try {
        // Use backend API endpoint for file uploads
        const formData = new FormData();

        if (imageFile instanceof File) {
          formData.append(
            "file",
            imageFile,
            `${folder}/${id}-${Date.now()}.${folder}/${id}`
          );
        } else {
          throw new Error("Unsupported file format for upload");
        }

        const response = await fetch(`${BACKEND_API_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`Image uploaded via backend: ${result.url}`);
        return result.url;
      } catch (error) {
        console.error(
          "Failed to upload via backend, falling back to Firebase Storage:",
          error
        );
        // Fall back to Firebase Storage if backend upload fails
      }
    }

    // Original Firebase Storage implementation
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  storeSiteImage = async (key, imageFile, useBackblazeB2 = false) => {
    // Check if Backblaze B2 should be used
    if (useBackblazeB2) {
      try {
        // Use backend API endpoint for file uploads
        const formData = new FormData();

        if (imageFile instanceof File) {
          formData.append(
            "file",
            imageFile,
            `site-images-${key}-${imageFile.name}`
          );
        } else {
          throw new Error("Unsupported file format for upload");
        }

        const response = await fetch(`${BACKEND_API_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`Site image uploaded via backend: ${result.url}`);
        return result.url;
      } catch (error) {
        console.error(
          "Failed to upload site image via backend, falling back to Firebase Storage:",
          error
        );
      }
    }

    // Original Firebase Storage implementation
    const snapshot = await this.storage
      .ref("site-images")
      .child(key)
      .put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  getSiteImages = () => this.db.collection("siteImages").get();

  setSiteImage = (key, image) =>
    this.db.collection("siteImages").doc(key).set(image, { merge: true });

  deleteSiteImage = async (key) => {
    // Delete from Firebase Storage
    try {
      await this.storage.ref("site-images").child(key).delete();
    } catch (e) {
      console.error("Failed to delete from storage (may not exist):", e);
    }
    // Delete from Firestore
    await this.db.collection("siteImages").doc(key).delete();
  };

  generateSpecialPageKey = () => this.db.collection("specialPages").doc().id;

  storeSpecialPageImage = async (id, imageFile, useBackblazeB2 = true) => {
    // Check if Backblaze B2 should be used
    if (useBackblazeB2) {
      try {
        // Use backend API endpoint for file uploads
        const formData = new FormData();

        if (imageFile instanceof File) {
          formData.append(
            "file",
            imageFile,
            `special-pages-${id}-${imageFile.name}`
          );
        } else {
          throw new Error("Unsupported file format for upload");
        }

        const response = await fetch(`${BACKEND_API_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`Special page image uploaded via backend: ${result.url}`);
        return result.url;
      } catch (error) {
        console.error(
          "Failed to upload special page image via backend, falling back to Firebase Storage:",
          error
        );
      }
    }

    // Original Firebase Storage implementation
    const snapshot = await this.storage
      .ref("special-pages")
      .child(id)
      .put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  getSpecialPages = () => this.db.collection("specialPages").get();

  getSpecialPage = (id) => this.db.collection("specialPages").doc(id).get();

  addSpecialPage = (id, page) =>
    this.db.collection("specialPages").doc(id).set(page);

  editSpecialPage = (id, updates) =>
    this.db.collection("specialPages").doc(id).update(updates);

  removeSpecialPage = (id) =>
    this.db.collection("specialPages").doc(id).delete();

  // Check if URL is from Firebase Storage
  isFirebaseStorageUrl(url) {
    return (
      url &&
      (url.includes("firebasestorage.googleapis.com") ||
        url.includes("firebaseapp.com") ||
        url.includes("appspot.com"))
    );
  }

  // Check if URL is from Backblaze B2
  isBackblazeB2Url(url) {
    return url && url.includes("backblazeb2.com");
  }

  // Get migration status for a document
  async getDocumentMigrationStatus(collectionName, docId) {
    try {
      const doc = await this.db.collection(collectionName).doc(docId).get();
      if (!doc.exists) {
        return { exists: false };
      }

      const data = doc.data();
      const storageUrls = [];
      const fieldsToCheck = [
        "image",
        "images",
        "imageUrl",
        "imageURL",
        "photo",
        "photos",
        "thumbnail",
        "gallery",
      ];

      for (const field of fieldsToCheck) {
        if (data[field]) {
          if (Array.isArray(data[field])) {
            data[field].forEach((url, index) => {
              if (this.isFirebaseStorageUrl(url)) {
                storageUrls.push({ field, url, index, type: "firebase" });
              } else if (this.isBackblazeB2Url(url)) {
                storageUrls.push({ field, url, index, type: "backblaze" });
              }
            });
          } else if (typeof data[field] === "string") {
            if (this.isFirebaseStorageUrl(data[field])) {
              storageUrls.push({ field, url: data[field], type: "firebase" });
            } else if (this.isBackblazeB2Url(data[field])) {
              storageUrls.push({ field, url: data[field], type: "backblaze" });
            }
          }
        }
      }

      return {
        exists: true,
        documentId: docId,
        collectionName: collectionName,
        storageUrls: storageUrls,
        migrationStatus: data.migrationMetadata || null,
        needsMigration: storageUrls.some((url) => url.type === "firebase"),
        totalFirebaseUrls: storageUrls.filter((url) => url.type === "firebase")
          .length,
        totalBackblazeUrls: storageUrls.filter(
          (url) => url.type === "backblaze"
        ).length,
      };
    } catch (error) {
      console.error(
        `Failed to get migration status for ${collectionName}/${docId}:`,
        error
      );
      throw error;
    }
  }

  deleteImage = (id) => this.storage.ref("products").child(id).delete();

  editProduct = (id, updates) =>
    this.db.collection("products").doc(id).update(updates);

  removeProduct = (id) => this.db.collection("products").doc(id).delete();

  addOrder = async (id, order) => {
    const products = (await this.getProductsAll()).docs.map((doc) =>
      doc.data()
    );
    const items = order.items.map((item) => {
      const product = products.find(({ id }) => id === item.id);
      return { ...item, ...product };
    });
    if (order.promo.code) {
      order.promo.uses++;
      await this.db
        .collection("promo")
        .doc(order.promo.code)
        .update({ uses: order.promo.uses });
    }
    await this.db
      .collection("order")
      .doc(id)
      .set({ ...order, otp: false, items });
    order.items.map(async (item) => {
      const product = products.find(({ id }) => id === item.id);
      product.totalQuantity -= item.quantity;
      product[`${item.selectedSize}Quantity`] -= item.quantity;
      if (
        product[`${item.selectedSize}Quantity`] < 0 ||
        product.totalQuantity < 0
      ) {
        throw "Product is out of stock";
      }
      await this.db.collection("products").doc(item.id).set(product);
    });
  };

  getOrders = () => this.db.collection("order").get();

  getPromos = () => this.db.collection("promo").get();

  getOrder = (id) => this.db.collection("order").doc(id).get();

  getPromo = (id) => this.db.collection("promo").doc(id).get();

  removeOrder = (id, order) => {
    order.items.map(async (item) => {
      item.totalQuantity += item.quantity;
      item[`${item.selectedSize}Quantity`] += item.quantity;
      await this.db
        .collection("products")
        .doc(item.id)
        .set(item, { merge: true });
    });
    return this.db.collection("order").doc(id).delete();
  };
  removePromo = (id) => this.db.collection("promo").doc(id).delete();
  usePromoCode = async (promo) => {
    const promoCode = await this.getPromo(promo);
    if (promoCode.exists) {
      const promoData = promoCode.data();
      const startDate = promoData.startDate;
      const endDate = promoData.endDate;

      if (isTodayBetweenDates(startDate, endDate)) {
        if (promoData.uses < promoData.max) {
          // promoData.uses++;

          localStorage.setItem("promo", JSON.stringify(promoData));
          return promoData;
        } else {
          throw "your promo code has exceeded the max number of uses";
        }
      } else {
        throw "your promo code is expired";
      }
    } else {
      throw "The promo code that you submited does not exists";
    }
  };

  getUserOrders = () =>
    this.db
      .collection("order")
      .where("uid", "==", this.auth.currentUser.uid)
      .get();

  updateOrder = (id, order) =>
    this.db.collection("order").doc(id).update(order);
  updatePromo = (promo) =>
    this.db.collection("promo").doc(promo.code).update(promo);
}

const firebaseInstance = new Firebase();

export default firebaseInstance;
