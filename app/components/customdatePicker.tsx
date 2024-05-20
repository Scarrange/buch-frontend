import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ClientOnly } from "remix-utils/client-only";

const CustomDatePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  return (
    <ClientOnly>
      {() => (
        <div className="form-control mt-3" style={{ maxWidth: "400px" }}>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            className="form-control"
            dateFormat="dd/MM/yyyy"
            placeholderText="Datum"
            showYearDropdown
          />
        </div>
      )}
    </ClientOnly>
  );
};

export default CustomDatePicker;
