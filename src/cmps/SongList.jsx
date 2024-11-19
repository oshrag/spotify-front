import { SongPreview } from "./SongPreview.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SvgIcon } from "./SvgIcon.jsx";
import { useScreenCategory } from "../customHooks/useBreakpoint.js";

export const SongList = ({
  songs,
  onAddToStation,
  isSongSavedAtStation,
  isUserStation,
  type,
  onDragEnd,
}) => {
  const screenCategory = useScreenCategory();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="songs-list">
        {(provided) => (
          <ul
            className="song-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {type === "station" &&
            screenCategory !== "mobile" &&
            songs.length ? (
              <li className="song-preview-station-grid">
                <label>#</label>
                <label>Title</label>
                <label>Date added</label>
                <label></label>
                <label className="song-duration">
                  <SvgIcon iconName="clock" />
                </label>
              </li>
            ) : null}

            {songs.map(
              (song, index) =>
                isUserStation ? (
                  <Draggable key={song.id} draggableId={song.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <SongPreview
                          song={song}
                          onAddToStation={onAddToStation}
                          isSongSavedAtStation={isSongSavedAtStation}
                          isUserStation={isUserStation}
                          type={type}
                          index={index}
                        />
                      </li>
                    )}
                  </Draggable>
                ) : (
                  <li key={song.id}>
                    <SongPreview
                      song={song}
                      onAddToStation={onAddToStation}
                      isSongSavedAtStation={isSongSavedAtStation}
                      isUserStation={isUserStation}
                      type={type}
                      index={index}
                    />
                  </li>
                )

              // <Draggable key={song.id} draggableId={song.id} index={index}>
              //   {(provided) => (
              //     <li
              //       ref={provided.innerRef}
              //       {...provided.draggableProps}
              //       {...provided.dragHandleProps}
              //     >
              //       <SongPreview
              //         song={song}
              //         onAddToStation={onAddToStation}
              //         isSongSavedAtStation={isSongSavedAtStation}
              //         isUserStation={isUserStation}
              //         type={type}
              //         index={index}
              //       />
              //     </li>
              //   )}
              // </Draggable>
            )}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};
