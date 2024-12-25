export function ImageCard(props: { obj: any }) {
  const size = Math.floor(Math.random() * (35 - 10 + 1)) + 10;
  const margin = Math.floor(Math.random() * (20 - 3 + 1)) + 3;
  return (
    <div style={{ margin: margin }} className="relative">
      <img
        className="rounded object-contain drop-shadow-lg"
        style={{ minWidth: size + "vw", minHeight: size + "vw" }}
        src={props.obj.images[1].url}
      />
    </div>
  );
}
