import React, { useState } from "react";
import styled from 'styled-components'
import Wrap from '@components/Wrap'
import { useRouter } from 'next/router';
import SubmitButton from '@components/buttons/SubmitButton'
import Select from 'react-select';
import ErrorMessage from '@components/form/ErrorMessage';
import SuccessMessage from '@components/form/SuccessMessage';

const Section = styled.section`
  background-color: var(--text-light);
`;

const Container = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  height: 95vh;
  width: 100%;
  color: var(--primary-text);
`;

const Title = styled.p`
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

  input,
  select {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--secondary-text);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--primary-text);

    &::placeholder { color: var(--secondary-text); }

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

export default function CreateEmploye() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [positionOptions, setPositionOptions] = useState(null);
  const position = positionOptions?.value;
  const [roleOptions, setRoleOptions] = useState(null);
  const roles = [roleOptions?.value];
  const [password, setPassword] = useState('');
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

      const res = await fetch('http://localhost:8080/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          picture,
          position,
          password,
          roles
        }),
      });

      if (res.ok) {
        setError('');
        setSuccess('Compte créé avec succès');

        setTimeout(() => {
          router.push('/employees');
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
  const handlePasswordInputChange = (e) => { setPassword(e.target.value); };
  const handlePictureInputChange = (e) => { setPicture(e.target.value); };

  return (
    <Section>
      <Wrap>
        <Container>
          <Title>Ajouter un compte</Title>
          <Form onSubmit={handleSubmit}>
            {success && <SuccessMessage text={success} />}
            {error && <ErrorMessage text={error} />}
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
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailInputChange}
              required />
            <input
              type="text"
              id="picture"
              name="picture"
              placeholder="Photo de profil"
              value={picture}
              onChange={handlePictureInputChange}
              disabled />
            <Select
              name="position"
              placeholder="Sélectionner une poste"
              options={[
                { value: 'developer', label: 'Developer' },
                { value: 'designer', label: 'Designer' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'manager', label: 'Manager' },
                { value: 'ux/ui', label: 'UX/UI' },
              ]}
              onChange={setPositionOptions}
              value={positionOptions}
              required
            />
            <Select
              name="roles"
              placeholder="Sélectionner un rôle"
              options={[
                { value: 'USER', label: 'Utilisateur' },
                { value: 'MODERATOR', label: 'Manager' },
              ]}
              onChange={setRoleOptions}
              value={roleOptions}
              required
            />
            <input
              type="text"
              id="password"
              name="password"
              placeholder="Mot de passe"
              value={password}
              onChange={handlePasswordInputChange}
              required />
            <SubmitButton text="Ajouter" backgroundColor="var(--accident)" />
          </Form>
        </Container>
      </Wrap>
    </Section>
  )
}