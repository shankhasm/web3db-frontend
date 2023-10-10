import styled from "styled-components";
import { Button, Form } from "react-bootstrap";

export const QueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  gap: 20px;
`;

export const StyledTextarea = styled(Form.Control)`
  resize: vertical;
  width: 60%;
  height: 200px;
  font-size: 16px;
  padding: 15px;
  border-radius: 5px;
`;

export const StyledButton = styled(Button)`
  width: 150px;
  height: 50px;
  font-size: 18px;
  border-radius: 5px;
  background-color: #007bff;
  border: none;
  &:hover {
    background-color: #0056b3;
  }
`;
