import React, { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState(null);

  /* Handle the form submit */
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the default to not reload the page

    const workout = { title, load, reps };

    // post the data
    const response = await fetch("http://localhost:4000/api/workouts/", {
      method: "POST",
      body: JSON.stringify(workout), // send workout in body as json
      headers: {
        "Content-Type": "application/json",
      },
    });

    // get the response fro mcontroller
    const json = await response.json();

    // check for errors from response
    if (!response.ok) {
      setError(json.error); // get the error massage
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setError(null);
      console.log("new workout added!");

      // reset the form
      setTitle("");
      setLoad("");
      setReps("");

      setEmptyFields();

      // reload the workouts list
      dispatch({ type: "CREATE_WORKOUT", payload: workout });
    }
  };

  return (
    <div>
      <form className="create" onSubmit={handleSubmit}>
        <h3>Add a New Wokout:</h3>

        <label>Excersize Title</label>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={
            emptyFields && emptyFields.includes("title") ? "error" : ""
          }
        />

        <label>Load (kg):</label>
        <input
          type="number"
          onChange={(e) => setLoad(e.target.value)}
          value={load}
          className={emptyFields && emptyFields.includes("load") ? "error" : ""}
        />

        <label>Number of Reps:</label>
        <input
          type="number"
          onChange={(e) => setReps(e.target.value)}
          value={reps}
          className={emptyFields && emptyFields.includes("reps") ? "error" : ""}
        />

        <button type="submit">Add Workout</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default WorkoutForm;
