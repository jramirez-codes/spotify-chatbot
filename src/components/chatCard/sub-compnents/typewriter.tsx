import React from "react";

export function Typewriter(props: { text: string; speed: number }) {
  const [displayText, setDisplayText] = React.useState("");
  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(props.text.slice(0, i + 1));
      i++;

      if (i === props.text.length) {
        clearInterval(interval);
      }
    }, props.speed);

    return () => clearInterval(interval);
  }, [props.text, props.speed]);

  return <span>{displayText}</span>;
}
