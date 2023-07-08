import React from 'react'
import styled from 'styled-components'
import Wrap from '@components/Wrap'
import { Nunito } from 'next/font/google'
import Link from 'next/link'

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})

const Section = styled.section`
  display: grid;
  place-items: center;
  background-color: var(--text-light);
  min-height: 95vh;
`;

const Container = styled.div`
  margin-inline: auto;
  width: min(90%, 500px);
  text-align: center;

  h1 { font-size: 2.5rem; }

  p { margin: 1rem 0;}

  a {
    margin-top: 1rem;
    color: var(--accident);
    text-decoration: underline;

    @media screen and (hover: hover) {
      transition: opacity 0.5s ease-out;

      &:hover { opacity: 0.55; }
    }
  }
`;

export default function Unauthorized() {
  return (
    <>
      <Section className={nunito.className}>
        <Wrap>
          <Container>
            <h1>Accès non autorisé</h1>
            <p>Vous n&apos;avez pas les droits nécessaires pour accéder à cette page.</p>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Container>
        </Wrap>
      </Section>
    </>
  )
}