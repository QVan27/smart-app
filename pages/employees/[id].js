import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Nunito } from 'next/font/google'
import Select from 'react-select';
import styled from "styled-components";
import Wrap from '@components/Wrap'
import { Icon } from '@iconify/react';
import SubmitButton from '@components/buttons/SubmitButton';

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
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-inline: auto;
  width: min(100%, 414px);

  .buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.625rem;
    margin-top: 2rem;
  }

  .edit {
    display: grid;
    place-items: center;
    position: fixed;
    inset: 0;
    z-index: 13;
    transition: all 0.3s ease-out;
    pointer-events: none;
    opacity: 0;

    &.active {
      background-color: rgba(0, 0, 0, 0.5);
      pointer-events: all;
      opacity: 1;
    }

    &__container {
      position: relative;
      background-color: var(--text-light);
      padding: 1.75rem;
      border-radius: 0.3125rem;

      @media screen and (min-width: 576px) {
        padding: 1.875rem;
      }

      p {
        margin-bottom: 0.675rem;
        text-align: center;
        font-size: 1.175rem;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      } 
    }

    &__close {
      position: absolute;
      top: 0.325rem;
      right: 0.325rem;
      cursor: pointer;

      svg {
        width: 1.5rem;
        height: 1.5rem;
        
        path { fill: var(--primary-text); }
      }
    }
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.88rem;
  margin-bottom: 3.17rem;

  .img {
    width: 9.375rem;
    height: 9.375rem;
    border-radius: 50px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: var(--secondary-shadow);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    p:first-child {
      font-size: 1.125rem;
      font-weight: 700;
    }

    p:last-child {
      color: var(--secondary-text);
      font-size: 0.875rem;
      font-weight: 500;
      margin-top: 0.3125rem;
    }
  }
`;

const List = styled.ul`
  li {
    position: relative;

    p:first-child {
      margin-bottom: 0.3125rem;
      color: var(--secondary-text);
      font-size: 0.75rem;
    }

    p:last-child {
      color: #23252C;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: -0.3125rem;
      left: 0;
      right: 0;
      height: 1px;
      background-color: var(--secondary-text);
    }
  }
`;

const Button = styled.button`
  display: flex;
  padding: 1.25rem 3.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.675rem;
  border-radius: 30px;
  background: var(--main);
  border: none;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;

  &.delete {
    background: var(--accident);
  }

  @media screen and (hover: hover) {
    position: relative;
    overflow: hidden;

    span {
      position: relative;
      z-index: 2;
    }

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
      width: 10rem;
      height: 10rem;
    }

    &:hover::before {
      transform: translate(-50%, -50%) scale(1.5);
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: stretch;

  .form-group {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    label,
    input {
      color: var(--primary-text);
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  
    input {
      margin: 0.375rem 0 0 0;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid var(--secondary-text);
      font-size: 0.875rem;
      font-weight: 500;
  
      &::placeholder { color: var(--secondary-text); }
  
      &:focus {
        outline: none;
        border-bottom: 1px solid var(--accident);
      }
      font-weight: 500;
    }
  }
`;

export default function SingleEmployee() {
  const router = useRouter();
  const { id } = router.query;
  const [userInfo, setUserInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState(userInfo?.email || '');
  const [positionOptions, setPositionOptions] = useState(null);
  const position = positionOptions?.value;

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const handleEmailInputChange = (e) => {
    setEmail(e.target.value)
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken')
        }
      });

      if (response.ok) {
        router.push('/employees');
      } else {
        console.log('Failed to delete the room.');
      }
    } catch (error) {
      console.error('Error deleting the room:', error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const user = await response.json();
          setUserInfo(user);
        } else {
          console.log('Failed to fetch user information.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user', {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        } else {
          console.log('Failed to fetch user information.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const showButtonsAdminOrModerator = currentUser?.roles.includes('MODERATOR') || currentUser?.roles.includes('ADMIN');
  const showButtonsAdmin = currentUser?.roles.includes('ADMIN');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
          email,
          position,
        }),
      });

      if (response.ok) {
        router.push('/employees');
      } else {
        console.log('Failed to update the employee.');
      }
    } catch (error) {
      console.error('Error updating the employee:', error);
    }
  };

  return (
    <Section className={nunito.className}>
      <Wrap>
        <Container>
          <Info>
            <div className='img'>
              <img src={userInfo?.picture} alt="" />
            </div>
            <div className='content'>
              <p>{userInfo?.firstName + " " + userInfo?.lastName}</p>
              <p>{userInfo?.email}</p>
            </div>
          </Info>
          <List>
            <li>
              <p>Poste</p>
              <p>{userInfo?.position}</p>
            </li>
          </List>
          {userInfo?.roles.includes('ADMIN') ? (
            null
          ) : (
            showButtonsAdminOrModerator && (
              <>
                <div className='buttons'>
                  <Button onClick={handleClick}>
                    <Icon icon="mdi:pencil" />
                    <span>Modifier</span>
                  </Button>
                  {showButtonsAdmin && (
                    <Button onClick={handleDelete} className='delete'>
                      <Icon icon="mdi:trash-can-outline" />
                      <span>Supprimer</span>
                    </Button>
                  )}
                </div>
                <div className={`edit ${isActive ? 'active' : ''}`}>
                  <div className='edit__container'>
                    <div className='edit__close' onClick={handleClick}>
                      <Icon icon="carbon:close-filled" />
                    </div>
                    <p>Modifier les informations</p>
                    <Form onSubmit={handleSubmit}>
                      <div className='form-group'>
                        <label htmlFor='email'>Email :</label>
                        <input
                          type='text'
                          id='email'
                          name='email'
                          placeholder={userInfo?.email}
                          value={email}
                          onChange={handleEmailInputChange}
                          required />
                      </div>
                      <Select
                        name="position"
                        placeholder="Sélectionner un poste"
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
                      <SubmitButton text="Valider" backgroundColor="var(--accident)" />
                    </Form>
                  </div>
                </div>
              </>
            )
          )}
        </Container>
      </Wrap>
    </Section>
  )
}
