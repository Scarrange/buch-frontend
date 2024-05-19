import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ClientOnly } from "remix-utils/client-only";

const CustomDatePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  //TODO Fehler beheben
  return (
    <div className="form-control mt-3" style={{ maxWidth: "400px" }}>
      <ClientOnly>
        {() => (
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            className="form-control"
            dateFormat="dd/MM/yyyy"
            placeholderText="Datum"
            showYearDropdown
          />
        )}
      </ClientOnly>
    </div>
  );
};

export default CustomDatePicker;
