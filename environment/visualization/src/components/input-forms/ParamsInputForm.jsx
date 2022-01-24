import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";
import axios from "axios";
import { CONFIG } from '../../config'

const { PARAMS_API_URL } = CONFIG;

const schema = {
  type: "object",
  properties: {
    gamma: {
      type: "number",
    },
    batch_size: {
      type: "integer",
    },
    replay_buffer_size: {
      type: "integer",
    },
    replay_buffer_local: {
      type: "boolean",
    },
    reset_buffer: {
      type: "boolean",
    },
    random_frames: {
      type: "integer",
    },
    reset: {
      type: "boolean",
    },
    target_model_sync_frequency: {
      type: "integer",
    },
    learning_rate: {
      type: "number",
    },
  },
};

const uiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/gamma",
    },
    {
      type: "Control",
      scope: "#/properties/batch_size",
    },
    {
      type: "Control",
      scope: "#/properties/replay_buffer_size",
    },
    {
      type: "Control",
      scope: "#/properties/replay_buffer_local",
    },
    {
      type: "Control",
      scope: "#/properties/reset_buffer",
    },
    {
      type: "Control",
      scope: "#/properties/random_frames",
    },
    {
      type: "Control",
      scope: "#/properties/reset",
    },
    {
      type: "Control",
      scope: "#/properties/target_model_sync_frequency",
    },
    {
      type: "Control",
      scope: "#/properties/learning_rate",
    },
  ],
};

export const ParamsInputForm = () => {

  const [data, setData] = useState({
    gamma: 0.99,
    batch_size: 1024,
    replay_buffer_size: 10000,
    replay_buffer_local: true,
    reset_buffer: true,
    random_frames: 5000,
    reset: true,
    target_model_sync_frequency: 50,
    learning_rate: 0.01,
  });

  const handleSubmit = () => {
    axios.get(`${PARAMS_API_URL}params`, {
      params: data
    }).then(() => console.log("Sent params successfully."))
    .catch(err => console.log("Did not send params.", err))
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
      }}
    >
      <JsonForms
        schema={schema}
        uischema={uiSchema}
        renderers={vanillaRenderers}
        cells={vanillaCells}
        data={data}
        onChange={({ data, _errors }) => setData(data)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
