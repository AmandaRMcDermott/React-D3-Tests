import React, { useState } from "react";

const tooltipContext = React.createContext();

function useTooltip() {
  const [tooltip, setTooltip] = useState(false);

  return { tooltip, setTooltip };
}

export { useTooltip, tooltipContext };
