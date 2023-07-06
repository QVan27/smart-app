import React, { useState } from "react";
import Image from 'next/image'
import { Orbitron } from 'next/font/google'
import { useRouter } from 'next/router';
import styled from 'styled-components'
import AuthLayout from '@components/layouts/AuthLayout'
import Wrap from '@components/Wrap'
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

const Form = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 1.87rem;
  width: min(100%, 400px);

  .form-groups {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.875rem;

    div { display: none; }
  }

  input,
  select {
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

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const roles = ['USER'];
  const [picture, setPicture] = useState('https://avatars.githubusercontent.com/u/12041934');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!firstName || !lastName || !email || !position || !password) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      if (!isEmailValid(email)) {
        setError('Veuillez entrer une adresse email valide');
        return;
      }

      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, picture, position, password, roles }),
      });

      if (res.ok) {
        setError('');
        setSuccess('Compte créé avec succès');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        setError('Erreur de création de compte');
      }
    } catch (error) {
      console.error('Erreur de création de compte:', error);
      setError('Erreur de création de compte');
    }
  }

  const handleFirstNameInputChange = (e) => { setFirstName(e.target.value); };
  const handleLastNameInputChange = (e) => { setLastName(e.target.value); };
  const handleEmailInputChange = (e) => { setEmail(e.target.value); };
  const handlePositionInputChange = (e) => { setPosition(e.target.value); };
  const handlePasswordInputChange = (e) => { setPassword(e.target.value); };
  const handlePictureInputChange = (e) => { setPicture(e.target.value); };

  return (
    <Wrap>
      <Container>
        <div>
          <Image
            src="/images/astro-signin.svg"
            alt="logo"
            width={200}
            height={150}
            style={{ objectFit: "contain" }}
            priority={true} />
          <Title className={orbitron.className}>Smart</Title>
        </div>
        <SubTitle>Créer votre compte</SubTitle>
        <Form onSubmit={handleSubmit}>
          {success && <SuccessMessage text={success} />}
          {error && <ErrorMessage text={error} />}
          <div className='form-groups'>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Prénom"
              value={firstName}
              onChange={handleFirstNameInputChange}
              required />
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Nom"
              value={lastName}
              onChange={handleLastNameInputChange}
              required />
          </div>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailInputChange}
            required />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Mot de passe"
            value={password}
            onChange={handlePasswordInputChange}
            required />
          <div className='form-groups'>
            <select name="position" value={position} onChange={handlePositionInputChange} required>
              <option value="developer">Développeur</option>
              <option value="designer">Designer</option>
              <option value="UX/UI">UX/UI</option>
              <option value="marketing">Marketing</option>
              <option value="manager">Manager</option>
            </select>
            <select name="roles" value={roles} multiple={false} disabled>
              <option value="USER">Utilisateur</option>
              <option value="MODERATOR">MODERATOR</option>
            </select>
          </div>
          <input
            type="text"
            id="picture"
            name="picture"
            placeholder="Photo de profil"
            value={picture}
            onChange={handlePictureInputChange}
            disabled />
          <SubmitButton text="S'inscrire" backgroundColor="var(--accident)" />
        </Form>
      </Container>
    </Wrap>
  )
}

SignUp.getLayout = function (page) {
  return (
    <AuthLayout>
      {page}
    </AuthLayout>
  )
}