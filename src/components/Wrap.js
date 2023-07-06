import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: min(calc(100% - 40px), 1200px);
  margin-inline: auto;
`;

export default function Wrap({ children}) {
  return (
    <Container>
      {children}
    </Container>
  );
}