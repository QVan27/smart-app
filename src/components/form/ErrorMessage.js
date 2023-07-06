import React from 'react'
import styled from 'styled-components'
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  weights: [500],
})

const Message = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  top: -25px;
  color: var(--accident);
  font-size: 0.875rem;
  font-weight: 500;
`;

export default function ErrorMessage({ text }) {
  return (
    <Message className={orbitron.className}>{text}</Message>
  )
}
