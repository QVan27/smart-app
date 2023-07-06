import { Nunito } from 'next/font/google'
import styled from 'styled-components'

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})

const Container = styled.div`
  display: grid;
  place-items: center;
  background: var(--main);
`;

export default function SimpleLayout({ children }) {
  return (
    <>
      <Container className={nunito.className}>{children}</Container>
    </>
  );
}