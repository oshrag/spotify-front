import { useNavigate } from "react-router";
import { logout } from "../store/actions/user.actions";
import { showSuccessMsg } from "../services/event-bus.service";

export const FloatingMenuUser = ({ onDone }) => {
  const navigate = useNavigate();

  async function onLogout() {
    onDone();
    await logout();
    navigate("/");
    showSuccessMsg("Logged out successfully");
  }
  return (
    <div className="floating-menu-user">
      <li onClick={onLogout}>Logout</li>
    </div>
  );
};
