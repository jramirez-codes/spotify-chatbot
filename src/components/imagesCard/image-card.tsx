import React from "react";
import { motion, AnimatePresence } from "motion/react";

export function ImageCard(props: { obj: any }) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [size] = React.useState(Math.floor(Math.random() * (35 - 10 + 1)) + 10);
  const [margin] = React.useState(Math.floor(Math.random() * (20 - 3 + 1)) + 3);
  return (
    <div style={{ margin: margin }} className="relative">
      <img
        onMouseEnter={() => {
          if (!isHovering) {
            setIsHovering((_: boolean) => true);
            setTimeout(() => {
              setIsHovering((_: boolean) => false);
            }, 1000);
          }
        }}
        className="rounded object-contain drop-shadow-lg"
        style={{ minWidth: size + "vw", minHeight: size + "vw" }}
        src={props.obj.images[1].url}
      />
      <AnimatePresence>
        {isHovering && (
          <>
            <div className="absolute w-[100%]" style={{ top: Math.floor(size / 2) + "vh", left: 0 }}>
              <motion.div key="box" exit={{ opacity: 0 }}>
                <h1 className="font-mono font-bolder text-center text-7xl" style={{ paintOrder: "stroke fill" }}>
                  {props.obj.name}
                </h1>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
