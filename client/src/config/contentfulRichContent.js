import React from "react";
import { BLOCKS } from "@contentful/rich-text-types";

const richContentConfig = {
  renderNode: {
    [BLOCKS.QUOTE]: (node) => {
      const quote = node.content[0].content[0].value;
      return (
        <div
          style={{
            borderLeft: "4px solid #5F9EA0",
          }}
        >
          {quote}
        </div>
      );
    },
  },
};

export default richContentConfig;
