import React from "react";

const parseMarkdown = (text: string) => {
  const regex = /\*\*(.*?)\*\*/g; // Match text inside ** **
  return text.split(regex).map((chunk, index) => {
    if (index % 2 === 1) {
      return <b key={index}>{chunk}</b>; // Render bold text
    }
    return chunk; // Render plain text
  });
};

export function Typewriter(props: { text: string; speed: number, typeEnabled: boolean, setGenreRenderFlag: Function }) {
  const [displayText, setDisplayText] = React.useState("");

  React.useEffect(() => {
    if(props.typeEnabled) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(props.text.slice(0, i + 1));
        i++;
  
        if (i === props.text.length) {
          clearInterval(interval);
          props.setGenreRenderFlag()
        }
      }, props.speed);
  
      return () => clearInterval(interval);
    }
    else {
      setDisplayText(props.text)
    }
  }, [props.text, props.speed, props.typeEnabled]);

  return (
    <React.Fragment>
      {displayText.split("\n").map((obj: string, idx: number) => {
        return (
          <p key={obj + idx}>
            <span>{parseMarkdown(obj)}</span>
          </p>
        );
      })}
    </React.Fragment>
  );
}
