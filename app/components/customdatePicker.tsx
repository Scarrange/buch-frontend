// DatePicker.tsx
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const CustomDatePicker = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
//TODO Fehler beheben
  return (
    <div className="form-control mt-3" style={{ maxWidth: "400px" }}>
      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        className="form-control"
        dateFormat="dd/MM/yyyy"
        placeholderText="Datum"
      />
    </div>
  );
};

export default CustomDatePicker;
