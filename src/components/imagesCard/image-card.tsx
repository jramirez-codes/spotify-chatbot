import React from "react";
export function ImageCard(props: { obj: any }) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [size] = React.useState(Math.floor(Math.random() * (35 - 10 + 1)) + 10);
  const [margin] = React.useState(Math.floor(Math.random() * (20 - 3 + 1)) + 3);
  return (
    <div style={{ margin: margin }} className="relative">
      <img
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        className="rounded object-contain drop-shadow-lg"
        style={{ minWidth: size + "vw", minHeight: size + "vw" }}
        src={props.obj.images[1].url}
      />
      {isHovering && (
        <div className="absolute top-0 left-0">
          <h1>Test</h1>
        </div>
      )}
    </div>
  );
}
