import React from "react";
import styled from "styled-components";

const Button = styled.button`
  background: ${(props) => props.backgroundColor};
  color: var(--text-light);
  border: none;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  @media screen and (hover: hover) {
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      z-index: 1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      border-radius: 50%;
      background: var(--text-light);
      opacity: 0.35;
      transition: transform 0.5s ease-out;
      transform-origin: center;
      width: 5rem;
      height: 5rem;
    }

    &:hover::before {
      transform: translate(-50%, -50%) scale(1.5);
    }
  }
`;

export default function SmallSubmitButton({ text, backgroundColor }) {
  return (<Button type="submit" backgroundColor={backgroundColor}>{text}</Button>);
}