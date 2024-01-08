import styled from "styled-components";

export const WaitingContainer = styled.div`
  height: 100vh;
  display: flex;
  width: 100vw !important;
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
`;

export const WaitingButton = styled.button`
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  outline: none;
  background-color: #35ccee;
  border-radius: 20px;
  border: none;
  font-size: larger;
  font-family: inherit;
`;

export const WaitingForm = styled.div`
  background-color: white;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 220px;
  box-shadow: 2px 2px 10px grey;
  color: grey;
  padding: 12px;
`;

export const WaitingInput = styled.input`
  border: 1px solid grey;
  font-size: larger;
  padding: 2px;
  font-family: inherit;
  columns: grey;
`;
