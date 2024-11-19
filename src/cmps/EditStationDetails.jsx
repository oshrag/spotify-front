import { useSelector } from "react-redux";
import { updateStationDetails } from "../store/actions/station.actions.js";
import { ImgUploader } from "./ImgUploader.jsx";
import { SvgIcon } from "./SvgIcon.jsx";

export const EditStationDetails = ({ stationToEdit, onDone }) => {
  const currentStation = useSelector(storeState => storeState.stationModule.station)
  let stationToSave = stationToEdit;

  function onSubmitDetails(ev) {
    ev.preventDefault()
    onDone()
    updateStationDetails(stationToSave, currentStation?._id)
  }

  function handleChange({ target }) {
    let { name: field, value, type } = target;
    switch (type) {
      case "number":
      case "range":
        value = +value;
        break;
      case "checkbox":
        value = target.checked;
        break;
    }

    stationToSave = { ...stationToSave, [field]: value };
    //console.log("stationToSave:", stationToSave);
  }

  function onUploaded(imgUrl1) {
    console.log("imgUrl:", imgUrl1);
    stationToSave = { ...stationToSave, imgUrl: imgUrl1 };
  }

  return (
    <div className="edit-station-details">
      <section className="modal-header">
        <span>Edit Details</span>
        <span onClick={onDone}>
          <SvgIcon iconName="close" />
        </span>
      </section>

      <form onSubmit={onSubmitDetails}>
        <input
          className="fieldName"
          name="name"
          type="text"
          placeholder="name"
          defaultValue={stationToEdit.name}
          onChange={handleChange}
        ></input>
        <textarea
          className="fieldDescription"
          name="description"
          type="textarea"
          cols="40"
          rows="5"
          placeholder="Description"
          defaultValue={stationToEdit.description}
          onChange={handleChange}
        ></textarea>
        {/* <input name="thumbnail" type="file" onChange={handleChange}></input> */}
        <span className="upload">
          {/* <img src={stationToEdit.imgUrl} /> */}
          <ImgUploader
            onUploaded={onUploaded}
            background={stationToEdit.imgUrl}
          />
        </span>

        <button className="send btn-type-4">save</button>
      </form>
    </div>
  );
};
