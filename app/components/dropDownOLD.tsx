import { ClientOnly } from "remix-utils/client-only";

const DropDown = () => {
  return (
    <ClientOnly>
      {() => (
        <div className="dropdown mt-3" style={{ maxWidth: "400px" }}>
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ maxWidth: "400px" }}
          >
            Buchart
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="#">
                Druckausgabe
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Kindle
              </a>
            </li>
          </ul>
        </div>
      )}
    </ClientOnly>
  );
};

export default DropDown;
