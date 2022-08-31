
import { useRef, useEffect } from "react";

// TRACK user interaction events
export const useCodes = () => {
    const codes = useRef(new Set())
    useEffect(() => {
      //const onKeyDown = (e) => codes.current.delete(e.code)
      const dblclick = () => {
        if (!codes.current.has("dblclick")) {
        codes.current.add("dblclick");
      }
        else {
          codes.current.delete("dblclick");
        }
      }
      //window.addEventListener('keydown', onKeyDown)
      window.addEventListener("dblclick", dblclick)
      return () => {
        //window.removeEventListener('keydown', onKeyDown)
        window.removeEventListener("dblclick", dblclick)
      }
    }, [])
    return codes
  };
  