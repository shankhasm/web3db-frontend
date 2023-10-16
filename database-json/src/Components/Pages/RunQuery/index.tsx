import React, { useContext, useState } from "react";
import { Dropdown, Row, Col } from "react-bootstrap";
import AceEditor from "react-ace";
import "brace/mode/sql";
import "brace/theme/tomorrow_night_eighties";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import { SqlContext } from "../../../context/SqlContext";
import { QueryContainer, StyledButton, StyledDropdown } from "./styles";
import ace from "ace-builds/src-noconflict/ace";

const RunQuery: React.FC = () => {
  const langTools = ace.require("ace/ext/language_tools");

  const { runQuery } = useContext(SqlContext);
  const [inputQuery, setInputQuery] = useState("");
  const [selectedDB, setSelectedDB] = useState("DefaultDB");

  const databases = ["Database1", "Database2", "Database3"];

  const handleRunQuery = () => {
    if (runQuery) {
      runQuery(inputQuery, selectedDB);
    } else {
      console.error("runQuery is not defined in the context.");
    }
  };
  const sqlKeywords = [
    "ADD",
    "ALL",
    "ALTER",
    "AND",
    "ANY",
    "AS",
    "ASC",
    "BACKUP",
    "BETWEEN",
    "BY",
    "CASE",
    "CHECK",
    "COLUMN",
    "CONSTRAINT",
    "CREATE",
    "DATABASE",
    "DEFAULT",
    "DELETE",
    "DESC",
    "DISTINCT",
    "DROP",
    "ELSE",
    "END",
    "EXISTS",
    "FOREIGN",
    "FROM",
    "FULL",
    "GROUP",
    "HAVING",
    "IN",
    "INDEX",
    "INNER",
    "INSERT",
    "INTERSECT",
    "INTO",
    "IS",
    "JOIN",
    "KEY",
    "LEFT",
    "LIKE",
    "LIMIT",
    "NOT",
    "NULL",
    "OR",
    "ORDER",
    "OUTER",
    "PRIMARY",
    "RIGHT",
    "ROWNUM",
    "SELECT",
    "SET",
    "TABLE",
    "THEN",
    "TOP",
    "TRUNCATE",
    "UNION",
    "UPDATE",
    "VALUES",
    "VIEW",
    "WHERE",
  ];
  const sqlCompleter = {
    getCompletions: (
      _editor: any,
      _session: any,
      _pos: any,
      prefix: any,
      callback: any
    ) => {
      callback(
        null,
        sqlKeywords.map((word) => ({
          caption: word,
          value: word,
          meta: "SQL",
        }))
      );
    },
  };
  langTools.addCompleter(sqlCompleter);

  const capitalizeSQLKeywords = (input: string) => {
    const words = input.split(" ");
    return words
      .map((word) => {
        if (sqlKeywords.includes(word.toUpperCase())) {
          return word.toUpperCase();
        }
        return word;
      })
      .join(" ");
  };

  // Inside your RunQuery component
  const handleInputChange = (newValue: string) => {
    const transformedValue = capitalizeSQLKeywords(newValue);
    setInputQuery(transformedValue);
  };

  return (
    <QueryContainer>
      <Row className="mb-4">
        <Col xs={12} sm={4}>
          <StyledDropdown
            onSelect={(e) => {
              if (typeof e === "string") {
                setSelectedDB(e);
              }
            }}
          >
            <Dropdown.Toggle variant="secondary">{selectedDB}</Dropdown.Toggle>
            <Dropdown.Menu>
              {databases.map((db) => (
                <Dropdown.Item key={db} eventKey={db}>
                  {db}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </StyledDropdown>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12}>
          <AceEditor
            mode="sql"
            theme="tomorrow_night_eighties"
            value={inputQuery}
            onChange={handleInputChange}
            name="SQL_EDITOR"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="250px"
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 4,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <StyledButton variant="secondary" onClick={handleRunQuery}>
            Run Query
          </StyledButton>
        </Col>
      </Row>
    </QueryContainer>
  );
};

export default RunQuery;
