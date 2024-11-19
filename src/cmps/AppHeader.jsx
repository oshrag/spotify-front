import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { login, logout, signup } from "../store/actions/user.actions";
import { utilService } from "../services/util.service.js";

import { LoginSignup } from "../pages/LoginSignup.jsx";
import { SvgIcon } from "../cmps/SvgIcon";
import { AppSearch } from "../cmps/AppSearch";
import { onToggleModal } from "../store/actions/app.actions.js";
import { FloatingMenuUser } from "./FloatingMenuUser.jsx";

export function AppHeader({ backgroundColor = null }) {
  const user = useSelector((storeState) => storeState.userModule.user);
  const [isSearchDisplayed, setIsSearchDisplayed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getLocation();
  }, [location]);

  function getLocation() {
    if (location.pathname.includes("search")) {
      setIsSearchDisplayed(true);
    } else {
      setIsSearchDisplayed(false);
    }
  }

  function onGoToLoginSignup(location) {
    navigate(`/${location}`);
  }

  function onOpenUserModal(ev) {
    const element = ev.currentTarget;
    const rect = element.getBoundingClientRect();

    onToggleModal({
      cmp: FloatingMenuUser,
      props: {
        onDone() {
          onToggleModal(null);
        },
        class: "floating-menu-user",
      },
      style: {
        left: `${rect.left - 120}px`,
        top: `${rect.top + 35}px`,
      },
    });
  }

  const userLatter = user ? utilService.getFirstChar(user.fullname) : null;
  const darkenedBackground_50 = utilService.darkenColor(
    "rgba(173,152,151,1)",
    50
  );

  return (
    <header className="app-header" style={{ backgroundColor: backgroundColor }}>
      <>
        <section>
          <button
            className="btn-back icon-type-1 big"
            onClick={() => navigate(-1)}
          >
            <SvgIcon iconName={"back"} />
          </button>
          <button
            className="btn-forward icon-type-1 big"
            onClick={() => navigate(1)}
          >
            <SvgIcon iconName={"forward"} />
          </button>
        </section>
        {user && (
          <section onClick={onOpenUserModal} className="user-info">
            <span style={{ backgroundColor: darkenedBackground_50 }}>
              <small
                style={{
                  backgroundColor: backgroundColor,
                }}
              >
                {userLatter}
              </small>
            </span>
          </section>
        )}
        {!user && (
          <section className="btns-login-signup">
            <button
              onClick={() => onGoToLoginSignup("signup")}
              className="btn-signup"
            >
              Sign up
            </button>
            <button
              onClick={() => onGoToLoginSignup("login")}
              className="btn-login"
            >
              Login
            </button>
          </section>
        )}
        {isSearchDisplayed && <AppSearch />}
      </>
    </header>
  );
}
