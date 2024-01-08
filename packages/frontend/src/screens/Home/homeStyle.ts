import styled from "styled-components";

export const HomeContainer = styled.div`
  height: 100vh;
  display: flex;
  width: 100vw !important;
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
`;

export const HomeButton = styled.button`
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

export const HomeForm = styled.div`
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

export const HomeInput = styled.input`
  border: 1px solid grey;
  font-size: larger;
  padding: 2px;
  font-family: inherit;
  columns: grey;
`;
