import { eventBus, showSuccessMsg } from "../services/event-bus.service";
import { useState, useEffect, useRef } from "react";
import {
  socketService,
  SOCKET_EVENT_REVIEW_ABOUT_YOU,
} from "../services/socket.service";
import { SvgIcon } from "./SvgIcon.jsx";

export function UserMsg() {
  const [msg, setMsg] = useState(null);
  const timeoutIdRef = useRef();

  useEffect(() => {
    const unsubscribe = eventBus.on("show-msg", (msg) => {
      setMsg(msg);
      // window.scrollTo({ top: 0, behavior: 'smooth' })
      if (timeoutIdRef.current) {
        timeoutIdRef.current = null;
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = setTimeout(closeMsg, 5000);
    });

    socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, (review) => {
      showSuccessMsg(`New review about me ${review.txt}`);
    });

    return () => {
      unsubscribe();
      socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU);
    };
  }, []);

  function closeMsg() {
    setMsg(null);
  }

  console.log("msg: ", msg);
  if (!msg) return <span></span>;

  return (
    <section className={`user-msg ${msg.type}`}>
      <section className="user-msg-inner">
        {/* <button onClick={closeMsg}>
          {" "}
          <SvgIcon iconName="close" />{" "}
        </button> */}
        <span>{msg.txt}</span>
      </section>
    </section>
  );
}
