import { Painting } from "../../types/paiting.types";
import "./PaintingModal.css";

type Props = {
  painting: Painting;
  onClose: () => void;
};

export function PaintingModal({ painting, onClose }: Props) {
  const LIGHT_MODE_BACKGROUND_COLOR = "#fafafa";
  const DARK_MODE_BACKGROUND_COLOR = "#2a2b2e";

  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const backgroundColor = prefersDarkMode
    ? DARK_MODE_BACKGROUND_COLOR
    : LIGHT_MODE_BACKGROUND_COLOR;

  return (
    <div className="modal" style={{ backgroundColor: backgroundColor }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h1>{painting.title}</h1>
        <h2>{painting.year}</h2>
        <h4>
          {painting.dimensions.width} x {painting.dimensions.height}
        </h4>
        <img id="paiting-modal-img" src={painting.url} alt={painting.title} />
      </div>
    </div>
  );
}
