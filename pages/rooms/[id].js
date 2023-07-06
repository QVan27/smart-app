import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import styled from "styled-components";
import Wrap from '@components/Wrap'
import { Nunito } from 'next/font/google'
import { Icon } from '@iconify/react';
import SubmitButton from '@components/buttons/SubmitButton';

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})

const Section = styled.section`
  display: grid;
  place-items: center;
  align-content: center;
  min-height: 95vh;
  background-color: var(--text-light);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: min(100%, 31.25rem);
  margin-inline: auto;

  .image {
    border-radius: 0.3125rem;
    height: 15.375rem;
    overflow: hidden;
    box-shadow: var(--primary-shadow);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.625rem;
    margin-top: 2rem;
  }

  .name,
  .floor,
  .email,
  .phone {
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .floor,
  .email,
  .phone {
    display: flex;
    justify-content: space-between;
    width: 100%;

    span {
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
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
      margin: 0.375rem 0 1.87rem 0;
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

export default function SingleRoom({ idRoom }) {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const [roomName, setRoomName] = useState('');
  const [roomFloor, setRoomFloor] = useState('');
  const [roomEmail, setRoomEmail] = useState('');
  const [roomPhone, setRoomPhone] = useState('');

  const handleClick = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/rooms/${id}`, {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const room = await response.json();
          setData(room);
        } else {
          console.log('Failed to fetch booking information.');
        }
      } catch (error) {
        console.error('Error fetching booking information:', error);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user', {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const user = await response.json();
          setUser(user);
        } else {
          console.log('Failed to fetch user information.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUser();
  }, []);

  const showButtonsAdminOrModerator = user?.roles.includes('MODERATOR') || user?.roles.includes('ADMIN');
  const showButtonsAdmin = user?.roles.includes('ADMIN');

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken')
        }
      });

      if (response.ok) {
        router.push('/rooms');
      } else {
        console.log('Failed to delete the room.');
      }
    } catch (error) {
      console.error('Error deleting the room:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
          name: roomName,
          pointOfContactEmail: roomEmail,
          pointOfContactPhone: roomPhone,
          floor: roomFloor
        }),
      });

      if (response.ok) {
        router.push('/rooms');
      } else {
        console.log('Failed to update the room.');
      }
    } catch (error) {
      console.error('Error updating the room:', error);
    }
  };

  const handleRoomNameInputChange = (e) => {
    setRoomName(e.target.value)
  };

  const handleRoomFloorInputChange = (e) => {
    setRoomFloor(e.target.value)
  };

  const handleRoomEmailInputChange = (e) => {
    setRoomEmail(e.target.value)
  };

  const handleRoomPhoneInputChange = (e) => {
    setRoomPhone(e.target.value)
  };

  return (
    <>
      <Section className={nunito.className}>
        <Wrap>
          <Container>
            <div className="image">
              <img src={data?.image} alt={data?.name} />
            </div>
            <p className='name'>{data?.name}</p>
            <p className='floor'>Étage(s) : <span>{data?.floor}</span></p>
            <p className='email'>Email : <span>{data?.pointOfContactEmail}</span></p>
            <p className='phone'>Téléphone : <span>{data?.pointOfContactPhone}</span></p>
            {showButtonsAdminOrModerator && (
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
                    <p>Modifier les informations de la salle</p>
                    <Form onSubmit={handleSubmit}>
                      <div className='form-group'>
                        <label htmlFor='name'>Nom de la salle :</label>
                        <input
                          type='text'
                          id='name'
                          name='name'
                          placeholder={data?.name}
                          value={roomName}
                          required
                          onChange={handleRoomNameInputChange} />
                      </div>
                      <div className='form-group'>
                        <label htmlFor='email'>Email :</label>
                        <input
                          type='text'
                          id='email'
                          name='email'
                          placeholder={data?.pointOfContactEmail}
                          value={roomEmail}
                          required
                          onChange={handleRoomEmailInputChange} />
                      </div>
                      <div className='form-group'>
                        <label htmlFor='phone'>Téléphone :</label>
                        <input
                          type='text'
                          id='phone'
                          name='phone'
                          placeholder={data?.pointOfContactPhone}
                          value={roomPhone}
                          required
                          onChange={handleRoomPhoneInputChange} />
                      </div>
                      <div className='form-group'>
                        <label htmlFor='floor'>Étage(s) :</label>
                        <input
                          type='text'
                          id='floor'
                          name='floor'
                          placeholder={data?.floor}
                          value={roomFloor}
                          required
                          onChange={handleRoomFloorInputChange} />
                      </div>
                      <SubmitButton text="Valider" backgroundColor="var(--accident)" />
                    </Form>
                  </div>
                </div>
              </>
            )}
          </Container>
        </Wrap>
      </Section>
    </>
  )
}
