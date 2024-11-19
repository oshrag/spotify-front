import { svgService } from "../services/svg.service.js";

export function SvgIcon({ iconName, style }) {
  const svg = svgService.getSVG(iconName);
  return <i dangerouslySetInnerHTML={{ __html: svg }} className={style}></i>;
}

export function AllIcons() {
  const svgs = svgService.getAllIcons()

  return (
    <section>
      {Object.entries(svgs).map(([key, value]) => (
        <>
          <h4>{key}</h4>
          <div
            key={key}
            className="svg-container"
            style={{
              maxWidth: "100px",
              maxHeight: "100px",
              display: "block",
            }}
          >
            <i dangerouslySetInnerHTML={{ __html: value }}></i>
          </div>
          <hr />
        </>
      ))}
    </section>
  );
}
