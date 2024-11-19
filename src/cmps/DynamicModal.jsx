import { useSelector } from "react-redux";
import { SvgIcon } from "./SvgIcon.jsx";

import { onToggleModal } from "../store/actions/app.actions.js";
import { useScreenCategory } from "../customHooks/useBreakpoint.js";
import { useEffect, useRef } from "react";

export function DynamicModal() {
  const modalData = useSelector((storeState) => storeState.appModule.modalData);

  const screenCategory = useScreenCategory();

  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCloseModal();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalData]);

  function onCloseModal() {
    onToggleModal(null);
  }

  if (!modalData) return <></>;

  const Cmp = modalData?.cmp || (() => "");
  const props = modalData?.props || {};
  // const style = modalData?.style || {};
  const style = screenCategory !== "mobile" && modalData ? modalData.style : {};

  // console.log(style);
  // console.log(`${props.class}`);

  return (
    <>
      {props.class === "floating-edit-station-details" && (
        <section onClick={onCloseModal} className="modal-backdrop"></section>
      )}
      {/* <section onClick={onCloseModal} className="modal-backdrop"></section> */}
      <section
        ref={modalRef}
        style={style}
        className={`modal-content  ${props.class}`}
      >
        <Cmp {...props} />
        {/* <span className="btn close-btn" onClick={onCloseModal}>
          <SvgIcon iconName="close" />
        </span> */}
      </section>
    </>
  );
}
