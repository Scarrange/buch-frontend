import { useState } from "react";
import DatePicker from "react-datepicker";
import { ClientOnly } from "remix-utils/client-only";

const CustomDatePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  return (
    <ClientOnly>
      {() => (
        <div className="form-control mt-3" style={{ maxWidth: "400px" }}>
          <DatePicker
            name="datum"
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Datum"
            showYearDropdown
          />
        </div>
      )}
    </ClientOnly>
  );
};

export default CustomDatePicker;
