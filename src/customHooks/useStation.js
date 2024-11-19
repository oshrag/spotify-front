import { onToggleModal } from "../store/actions/app.actions.js";
import { FloatingMenuStation } from "../cmps/FloatingMenuStation";
import { EditStationDetails } from "../cmps/EditStationDetails";

export const useStation = ({ station, location, onCreateEmptyStation }) => {

  function handleClick(ev) {
    ev.preventDefault();
    const element = ev.currentTarget;
    const rect = element.getBoundingClientRect();
    let style;
    console.log('location:', location)
    switch (location) {
      case "library":
        style = {
          left: `${rect.left + 230}px`,
          top: `${rect.top}px`
        }
        break
      case "station-details":
        style = {
          left: `${rect.left + 50}px`,
          top: `${rect.top + 20}px`
        }
        break;
      case "main":
        style = {
          left: `${rect.left}px`,
          top: `${rect.top + 20}px`
        }
        break;
      case "search":
        style = {
          left: `${rect.left}px`,
          top: `${rect.top + 20}px`
        }
        break;

    }
    if (location === "modal-add" || location === "modal-more") return;
    onToggleModal({
      cmp: FloatingMenuStation,
      props: {
        station,
        location,
        onDone() {
          onToggleModal(null);
        },
        class: "floating-menu-station",
        onCreateEmptyStation: onCreateEmptyStation,
        onOpenStationDetails() {
          onToggleModal(null)
          onToggleModal({
            cmp: EditStationDetails,
            props: {
              stationToEdit: station,
              onDone() {
                onToggleModal(null);
              },
              class: "floating-edit-station-details",
            },
          });
        },
      },
      style
    });
  }

  return { handleClick };
}