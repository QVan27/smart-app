import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import styled from "styled-components";
import Wrap from '@components/Wrap'
import { Nunito } from 'next/font/google'
import { Icon } from '@iconify/react';
import Link from 'next/link';

import Select from 'react-select';
import SmallSubmitButton from '@components/buttons/SmallSubmitButton'

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})


const Section = styled.section`
  display: grid;
  place-items: center;
  align-content: center;
  padding: 5.5rem 0;
  min-height: 95vh;
  width: 100%;
  background-color: var(--text-light);

  .room-link {
    width: 100%;
  }

  @media screen and (min-width: 768px) {
    .room-link {
      grid-area: 1 / 5 / 2 / 9;
    }

    .guests {
      grid-area: 2 / 1 / 3 / 9;
    }
  }

  @media screen and (min-width: 1180px) {
    padding: 0;

    .room-link {
      grid-area: 2 / 1 / 3 / 4;
    }

    .guests {
      grid-area: 1 / 4 / 3 / 9;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.875rem;
  flex-shrink: 0;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
  }

`;

const About = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;

  @media screen and (min-width: 768px) {
    grid-area: 1 / 1 / 2 / 5;
  }

  @media screen and (min-width: 1180px) {
    grid-area: 1 / 1 / 2 / 4;
  }

  .talk {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3125rem;

    h1 {
      font-size: 0.875rem;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    &__dates {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;

      span {
        text-align: center;
        font-size: 0.75rem;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
  }
`;

const Room = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 0.3125rem;
  background: var(--text-light);
  box-shadow: var(--primary-shadow);
  overflow: hidden;

  .image {
    display: flex;
    width: 100%;
    height: 9.375rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    display: flex;
    padding: 0.9375rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
    align-self: stretch;

    &__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: stretch;

      p:first-child {
        text-align: center;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

      p:last-child {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.625rem;

        span {
          text-align: center;
          font-size: 0.75rem;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }
    }

    &__bottom {
      display: flex;
      flex-direction: column;
      color: var(--secondary-text);
      font-size: 0.75rem;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.25rem;
  margin-top: 1.88rem;
  padding-bottom: 1.88rem;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media screen and (min-width: 1180px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ListItem = styled.li`
  display: flex;
  position: relative;
  align-items: center;
  gap: 0.9375rem;
  padding: 0rem 0rem 0rem 0.9375rem;

  .list__img {
    border-radius: 50%;
    box-shadow: var(--secondary-shadow);
    overflow: hidden;
    width: 2.5rem;
    min-width: 2.5rem;
    height: 2.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .list__text {
    color: var(--primary-text);
    font-size: 0.875rem;

    &__job {
      color: var(--secondary-text);
      font-size: 0.8rem;
      text-transform: capitalize;
    }
  }

  &.active {
    background-color: var(--light-gray);
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 50%;
  right: -5rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;

  svg path { fill: var(--accident); }

  @media screen and (min-width: 768px) {
    right: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;

  @media screen and (min-width: 768px) {
    grid-area: 3 / 1 / 3 / 4;
  }

  .users {
    display: flex;  
    flex-direction: column;
    gap: 0.875rem;
  }
`;

export default function SingleBooking() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [room, setRoom] = useState(null);
  const booking = data?.booking;
  const [user, setUser] = useState(null);
  const showButtonsAdminOrModerator = user?.roles.includes('MODERATOR') || user?.roles.includes('ADMIN');
  const [optionList, setOptionList] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();
  const userIds = selectedOptions?.map(option => option.value);

  const handleAddUsers = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${id}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken'),
        },
        body: JSON.stringify({ userIds }),
      });

      if (response.ok) {
        console.log('Users added to the booking successfully.');
      } else {
        console.log('Failed to add users to the booking.');
      }
    } catch (error) {
      console.error('Error adding users to the booking:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const users = await response.json();
          const modifiedUsers = users.map(user => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName} (${user.position})`
          }));
          setOptionList(modifiedUsers);
        } else {
          console.log('Failed to fetch users information.');
        }
      } catch (error) {
        console.error('Error fetching users information:', error);
      }
    };

    fetchUsers();
  }, []);

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

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/${id}`, {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const booking = await response.json();
          setData(booking);
        } else {
          console.log('Failed to fetch booking information.');
        }
      } catch (error) {
        console.error('Error fetching booking information:', error);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  useEffect(() => {
    if (booking?.roomId) {
      const fetchRoom = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/rooms/${booking?.roomId}`, {
            headers: {
              'x-access-token': localStorage.getItem('accessToken')
            }
          });

          if (response.ok) {
            const room = await response.json();
            setRoom(room);
          } else {
            console.log('Failed to fetch booking information.');
          }
        } catch (error) {
          console.error('Error fetching booking information:', error);
        }
      };


      fetchRoom();
    }
  }, [booking?.roomId]);

  const handleRemoveUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${booking?.id}/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'x-access-token': localStorage.getItem('accessToken'),
          },
        }
      );

      if (response.ok) {
        const response = await fetch(`http://localhost:8080/api/bookings/${id}`, {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const booking = await response.json();
          setData(booking);
        } else {
          console.log('Failed to fetch booking information.');
        }
        console.log('User removed from booking successfully.');
      } else {
        console.log('Failed to remove user from booking.');
      }
    } catch (error) {
      console.error('Error removing user from booking:', error);
    }
  };

  return (
    <>
      <Section className={nunito.className}>
        <Wrap>
          <Container>
            <About>
              <Icon icon="solar:calendar-linear" />
              <div className='talk'>
                <h1>{booking?.purpose}</h1>
                <div className='talk__dates'>
                  <span>{booking?.startDate}</span>
                  <span>{booking?.endDate}</span>
                </div>
              </div>
            </About>
            <Link className='room-link' href={`/rooms/${room?.id}/`}>
              <Room>
                <div className='image'>
                  <img src={room?.image} alt="" />
                </div>
                <div className='content'>
                  <div className='content__top'>
                    <p>{room?.name}</p>
                    <p>
                      <Icon icon="mdi:people" />
                      <span>
                        {booking?.users.length}
                      </span>
                    </p>
                  </div>
                  <div className='content__bottom'>
                    <p>{room?.floor} étage(s)</p>
                    <p>{room?.pointOfContactEmail}</p>
                  </div>
                </div>
              </Room>
            </Link>
            <div className='guests'>
              <p>Participants</p>
              <List>
                {booking?.users &&
                  booking?.users
                    .sort((a, b) => a.firstName.localeCompare(b.firstName))
                    .map((user) => (
                      <ListItem
                        key={user.id}
                        className='list__item'
                      >
                        <div className='list__img'>
                          <img src={user.picture} alt={user.firstName} />
                        </div>
                        <div className='list__text'>
                          <div className='list__text__name'>
                            {user.firstName + ' ' + user.lastName}
                          </div>
                          <div className='list__text__job'>
                            {user.position}
                          </div>
                        </div>
                        {showButtonsAdminOrModerator && (
                          <RemoveButton onClick={() => handleRemoveUser(user.id)}>
                            <Icon icon="gg:remove" />
                          </RemoveButton>
                        )}
                      </ListItem>
                    ))}
              </List>
            </div>
            {showButtonsAdminOrModerator && (
              <Form onSubmit={handleAddUsers}>
                <div className='users'>
                  <label htmlFor="users">Ajouter des participants</label>
                  <Select
                    options={optionList}
                    placeholder="Sélectionner des participants"
                    value={selectedOptions}
                    onChange={setSelectedOptions}
                    isSearchable={true}
                    isMulti
                    required
                  />
                </div>
                <SmallSubmitButton text="Ajouter" backgroundColor="var(--accident)" />
              </Form>
            )}
          </Container>
        </Wrap>
      </Section>
    </>
  )
}
