import Input from "../components/input";
import CheckBox from "../components/checkBox";
import DropDown from "~/components/dropDown";

export default function searchPage() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1>Suchformular</h1>
        <Input placeholder="ISBN" />
        <Input placeholder="Titel" />
        <DropDown />
        <div
          className="container d-flex justify-content-around mt-3"
          style={{ maxWidth: "400px" }}
        >
          <CheckBox text="JavaScript" />
          <CheckBox text="TypeScript" />
        </div>
      </div>
    </div>
  );
}
