import React from "react";
import { Orbitron, Nunito } from 'next/font/google'
import styled from "styled-components";

const orbitron = Orbitron({
  subsets: ['latin'],
  weights: [400, 700],
})

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})

const Container = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5vh;

  div {
    p {
      font-size: 1rem;
      text-align: center;
      color: var(--secondary-text);
    }

    p:last-child {
      font-size: 0.55rem;
      margin-top: 0.2rem;
    }
  }
`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Container>
      <div>
        <p className={orbitron.className}>Smart</p>
        <p className={nunito.className}>All rights reserved, {year}</p>
      </div>
    </Container>
  );
}