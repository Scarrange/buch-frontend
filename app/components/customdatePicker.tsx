import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ClientOnly } from "remix-utils/client-only";

export const CustomDatePicker = (props: { defaultValue?: string }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    if (props.defaultValue) {
      setStartDate(new Date(props.defaultValue));
    }
  }, [props.defaultValue]);

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
