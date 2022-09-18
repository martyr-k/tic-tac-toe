import "./styles/Element.css";
import { hideBorder } from "./util/helpers";

export default function Element({ value, index, handlePlay }) {
  const handleClick = () => {
    if (value) return;
    handlePlay(index);
  };

  return (
    <div
      className="Element-container"
      style={{
        ...hideBorder(index),
        cursor: value ? "not-allowed" : "pointer"
      }}
      onClick={handleClick}
    >
      <span>{value}</span>
    </div>
  );
}
