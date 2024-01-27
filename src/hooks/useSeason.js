import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";

const useSeasonalProducts = (itemsCount) => {
  function getSeason() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0 to 11 (January is 0, December is 11)

    // Define the start months for each season
    const springStartMonth = 2; // March
    const summerStartMonth = 4; // June
    const autumnStartMonth = 6; // September
    const winterStartMonth = 9; // December

    // Determine the season based on the current month
    if (currentMonth >= springStartMonth && currentMonth < summerStartMonth) {
      return "Spring";
    } else if (
      currentMonth >= summerStartMonth &&
      currentMonth < autumnStartMonth
    ) {
      return "Summer";
    } else if (
      currentMonth >= autumnStartMonth &&
      currentMonth < winterStartMonth
    ) {
      return "Autumn";
    } else {
      return "Winter";
    }
  }
  const season = getSeason();

  return season;
};

export default useSeasonalProducts;
