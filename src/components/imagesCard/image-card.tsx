import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { TopArtistItem } from "@/types/spotify";

export function ImageCard(props: { obj: TopArtistItem }) {
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
            <div className="absolute w-[100%] p-4" style={{ top: Math.floor(size / 2) + "vh", left: 0 }}>
              <motion.div exit={{ opacity: 0 }}>
                <h1 className="font-serif font-bolder text-center text-7xl drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-sky-400">
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
