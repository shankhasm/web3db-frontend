import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { SqlContext } from "../../../context/SqlContext";
import { QueryContainer, StyledTextarea } from "./styles";

const RunQuery: React.FC = () => {
  const { runQuery } = useContext(SqlContext);
  const [inputQuery, setInputQuery] = useState("");

  const handleRunQuery = () => {
    if (runQuery) {
      runQuery(inputQuery);
    } else {
      console.error("runQuery is not defined in the context.");
    }
  };

  return (
    <QueryContainer>
      <StyledTextarea
        as="textarea"
        value={inputQuery}
        onChange={(e) => setInputQuery(e.target.value)}
        placeholder="Write your SQL query here..."
      />
      <Button variant="primary" onClick={handleRunQuery} className="mt-3">
        Run Query
      </Button>
    </QueryContainer>
  );
};

export default RunQuery;
