import React, { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { displayActionMessage } from "@/helpers/utils";
import { connectAdvanced } from "react-redux";

export default function DatePickerValue({
  values,
  setValues,
  propName,
  name,
  comparedTo = new Date(),
}) {
  // const [value, setValue] = useState(dayjs("2022-04-17"));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={name}
        value={dayjs(values[propName])}
        onChange={(newValue) => {
          comparedTo = dayjs(comparedTo);
          const isTodayOrFuture =
            newValue.isSame(comparedTo, "day") || newValue.isAfter(comparedTo);
          if (newValue.isValid() && isTodayOrFuture) {
            setValues({ ...values, [propName]: newValue.toDate() });
            return newValue;
          } else {
            displayActionMessage("you date is not correct ");
            setValues({ ...values, [propName]: comparedTo });
            return comparedTo;
          }
        }}
      />
    </LocalizationProvider>
  );
}
