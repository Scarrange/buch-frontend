import Input from "../components/input";
import SliderWithValue from "../components/slider";
import DropDown from "../components/dropDown";
import CheckBox from "../components/checkBox";
import Radio from "~/components/radio";
import CustomDatePicker from "~/components/customdatePicker";

export default function newBookPage() {
  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h1>Neues Buch anlegen</h1>
      <Input placeholder="ISBN" />
      <Input placeholder="Titel" />
      <Input placeholder="Homepage" />
      <CustomDatePicker />
      <Input placeholder="Preis" />
      <Input placeholder="Rabatt" />
      <div
        className="container d-flex justify-content-around mt-3"
        style={{ maxWidth: "400px" }}
      >
        <Radio name="lieferbar" />
        <Radio name="nicht lieferbar" />
      </div>
      <SliderWithValue min={1} max={5} text="Rating" />
      <DropDown />
      <div
        className="container d-flex justify-content-around mt-3"
        style={{ maxWidth: "400px" }}
      >
        <CheckBox text="JavaScript" />
        <CheckBox text="TypeScript" />
      </div>
      <button type="button" className="btn btn-success btn-lg mt-4">
        Buch anlegen
      </button>
    </div>
  );
}
