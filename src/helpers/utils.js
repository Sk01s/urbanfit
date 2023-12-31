/* eslint-disable no-nested-ternary */
export const displayDate = (timestamp) => {
  const date = new Date(timestamp);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // return day + ' ' + monthNames[monthIndex] + ' ' + year;
  return `${monthNames[monthIndex]} ${day}, ${year}`;
};

export const displayMoney = (n) => {
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // or use toLocaleString()
  return format.format(n);
};

export const calculateTotal = (arr) => {
  if (!arr || arr?.length === 0) return 0;

  const total = arr.reduce((acc, val) => acc + val, 0);

  return total.toFixed(2);
};

export const displayActionMessage = (msg, status = "info") => {
  const div = document.createElement("div");
  const span = document.createElement("span");

  div.className = `toast ${
    status === "info"
      ? "toast-info"
      : status === "success"
      ? "toast-success"
      : "toast-error"
    // eslint-disable-next-line indent
  }`;
  span.className = "toast-msg";
  span.textContent = msg;
  div.appendChild(span);

  if (document.querySelector(".toast")) {
    document.body.removeChild(document.querySelector(".toast"));
    document.body.appendChild(div);
  } else {
    document.body.appendChild(div);
  }

  setTimeout(() => {
    try {
      document.body.removeChild(div);
    } catch (e) {
      console.log(e);
    }
  }, 3000);
};
export const calculateDiscount = (subtotal, promo) => {
  // const promo = JSON.parse(localStorage.getItem("promo")) || { percentage: 0 };
  const percentage = promo.percentage / 100;
  return subtotal * percentage;
};

export function isTodayBetweenDates(startDateStr, endDateStr) {
  const today = new Date();
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return today >= startDate && today <= endDate;
}
export const calculateSubtotal = (items) => {
  return items.reduce((acc, next) => {
    if (next.onSale) {
      return (
        acc +
        Number(next.price) *
          (1 - Number(next.percentage / 100)) *
          Number(next.quantity)
      );
    }
    return acc + Number(next.price) * Number(next.quantity);
  }, 0);
};

export const HighProducts = (products) =>
  products.filter((item) => item.priority === 1);

export function arraysHaveSameValues(arr1, arr2) {
  return (
    arr1.length === arr2.length && arr1.every((value) => arr2.includes(value))
  );
}
