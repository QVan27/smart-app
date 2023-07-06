import AuthLayout from '@components/layouts/AuthLayout'
import styled from 'styled-components'
import { Orbitron } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import Wrap from '@components/Wrap'
import { useRouter } from 'next/router';
import { useState } from 'react';
import SubmitButton from '@components/buttons/SubmitButton'
import ErrorMessage from '@components/form/ErrorMessage';
import SuccessMessage from '@components/form/SuccessMessage';

const orbitron = Orbitron({
  subsets: ['latin'],
  weights: [400, 700],
})

const Container = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  height: 100vh;
  width: 100%;
  color: var(--text-light);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 4rem;
`;

const SubTitle = styled.h2`
  margin: 3.13rem 0 2.94rem 0;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Redirect = styled.p`
  margin-top: 2.94rem;
  color: #adadad;
  font-size: 0.875rem;
  font-weight: 500;

  a { text-decoration: underline; }
`;

const Form = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  width: min(100%, 400px);

  input {
    margin-bottom: 2.94rem;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--secondary-text);
    font-size: 0.875rem;
    font-weight: 500;

    &::placeholder { color: var(--text-light); }

    &:focus {
      outline: none;
      border-bottom: 1px solid var(--accident);
    }
  }
`;

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('accessToken', data.accessToken);

        setError('');
        setSuccess('Connexion réussie. Redirection en cours...');

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        console.log('Échec de la connexion.');
        setError('Échec de la connexion.');
      }
    } catch (error) {
      console.error('Erreur lors de la requête de connexion:', error);
      setError('Erreur lors de la requête de connexion.');
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Wrap>
      <Container>
        <div>
          <Image
            src="/images/astro-connect.svg"
            alt="logo"
            width={200}
            height={150}
            style={{ objectFit: "contain" }}
            priority={true} />
          <Title className={orbitron.className}>Smart</Title>
        </div>
        <SubTitle>Connecter votre compte</SubTitle>
        <Form onSubmit={handleSubmit}>
          {success && <SuccessMessage text={success} />}
          {error && <ErrorMessage text={error} />}
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Mot de passe"
            value={password}
            onChange={handlePasswordChange}
            required />
          <SubmitButton text="Se connecter" backgroundColor="var(--accident)" />
        </Form>
        <Redirect>
          Ou créer <Link href="/auth/signup">votre compte</Link>
        </Redirect>
      </Container>
    </Wrap>
  )
}

SignIn.getLayout = function (page) {
  return (
    <AuthLayout>
      {page}
    </AuthLayout>
  )
}