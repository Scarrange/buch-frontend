const DropDown = () => {
  return (
    //TODO FIx dieses dumem Ding
    //https://getbootstrap.com/docs/5.3/components/dropdowns/
    //es liegt irgendwie an popper, aber ich habe es auch damit nicht zum laufen gebracht
    <div className="dropdown mt-3">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Bitte fixt mich, ich halte es nicht mehr aus
      </button>
      <ul className="dropdown-menu">
        <li>
          <a className="dropdown-item" href="#">
            Action
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Another action
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Something else here
          </a>
        </li>
      </ul>
    </div>
  );
};

export default DropDown;
