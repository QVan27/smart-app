import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Wrap from '@components/Wrap'
import { Nunito } from 'next/font/google'
import { Icon } from '@iconify/react';
import { formatTime, formatDate } from '@utils/dateFormats';
import Link from 'next/link';
import SmallSubmitButton from '@components/buttons/SmallSubmitButton';

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 600, 700],
})

const Section = styled.section`
  display: grid;
  place-items: center;
  align-content: center;
  min-height: 95vh;
  padding: 5.5rem 0;
  width: 100%;
  background-color: var(--text-light);
`;

const Container = styled.div`
  display: grid;
  gap: 4rem;

  .group {
    display: grid;
    gap: 1.25rem;
  }
`;

const Title = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
`;

const List = styled.ul`
  display: grid;
  gap: 1.25rem;

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Item = styled.li`
  position: relative;

  a { position: relative; }
`;

const BookingCard = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9375rem;
  align-self: stretch;
  padding: 0.625rem 0.9375rem 0.9375rem 0.9375rem;
  border-radius: 5px;
  background: var(--text-light);
  box-shadow: 5px 5px 20px 0px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: var(--accident);
    width: 5px;
  }

  .heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;

    p {
      font-size: 0.875rem;
      font-weight: 600;
      max-width: 70%;
    }

    span {
      color: var(--secondary-text);
      text-align: center;
      font-size: 0.6875rem;
    }
  }

  .users {
    display: flex;
    gap: 0.3125rem;
    align-items: center;

    .user {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: var(--secondary-shadow);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.remaining {
        display: flex;
        align-items: center;
        background: var(--main);
        justify-content: center;
        color: var(--text-light);
        font-size: 0.5rem;
        font-weight: 500;
      }
    }
  }

  .infos {
    .infos__group {
      display: flex;
      align-items: center;
      gap: 0.9375rem;

      &--date {
        margin-bottom: 0.3125rem;
      }

      svg {
        color: var(--accident);
      }

      span {
        color: #23252C;
        font-size: 0.75rem;
        font-weight: 500;
      }
    }
  }
`;

const Form = styled.form`
  position: absolute;
  z-index: 2;
  top: 0.625rem;
  right: 0.625rem;
`;

export default function ManageBooking() {
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    const fetchBooKings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bookings', {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const bookings = await response.json();
          setBookings(bookings);
        } else {
          console.log('Failed to fetch user information.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchBooKings();
  }, [bookings]);

  const handleValidate = async (e, bookingId) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
          isApproved: true
        })
      });

      if (response.ok) {
        console.log('Booking approved successfully.');
      } else {
        console.log('Failed to approve booking.');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleDelete = async (e, bookingId) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
          isApproved: true
        })
      });

      if (response.ok) {
        console.log('Booking approved successfully.');
      } else {
        console.log('Failed to approve booking.');
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  return (
    <>
      <Section>
        <Wrap>
          <Container>
            <div className='group'>
              <Title className={nunito.className}>Approuver les réunions</Title>
              <List>
                {bookings?.filter((booking) => booking.isApproved === false)
                  .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                  .map((booking, i) => {
                    const firstFiveUsers = booking?.users.slice(0, 5);
                    const remainingUsersCount = booking?.users.length - firstFiveUsers.length;
                    return (
                      <>
                        <Item key={i}>
                          <Link href={`/${booking?.id}`}>
                            <BookingCard className={nunito.className}>
                              <div className='heading'>
                                <p>{booking?.purpose}</p>
                              </div>
                              <div className='infos'>
                                <div className='infos__group infos__group--date'>
                                  <Icon icon="uil:schedule" />
                                  <span>{formatDate(booking?.startDate)}</span>
                                </div>
                                <div className='infos__group infos__group--date'>
                                  <Icon icon="ph:clock" />
                                  <span>{formatTime(booking?.startDate) + " - " + formatTime(booking?.endDate)}</span>
                                </div>
                                <div className='infos__group infos__group--loc'>
                                  <Icon icon="bx:map" />
                                  <span>{booking?.room.name}</span>
                                </div>
                              </div>
                              <div className='users'>
                                {firstFiveUsers.map((user, i) => (
                                  <div key={i} className='user'>
                                    <img src={user.picture} alt={user.name} />
                                  </div>
                                ))}
                                {remainingUsersCount > 0 && (
                                  <div className='remaining user'>{`+${remainingUsersCount}`}</div>
                                )}
                              </div>
                            </BookingCard>
                          </Link>
                          <Form onSubmit={(e) => handleValidate(e, booking?.id)}>
                            <SmallSubmitButton text="Valider" backgroundColor="var(--main)">Supprimer</SmallSubmitButton>
                          </Form>
                        </Item>
                      </>
                    )
                  })}
              </List>
            </div>
            <div className='group'>
              <Title className={nunito.className}>Supprimer une réunion existante</Title>
              <List>
                {bookings?.filter((booking) => booking.isApproved === true)
                  .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                  .map((booking, j) => {
                    const firstFiveUsers = booking?.users.slice(0, 5);
                    const remainingUsersCount = booking?.users.length - firstFiveUsers.length;
                    return (
                      <>
                        <Item key={j}>
                          <Link href={`/${booking?.id}`}>
                            <BookingCard className={nunito.className}>
                              <div className='heading'>
                                <p>{booking?.purpose}</p>
                              </div>
                              <div className='infos'>
                                <div className='infos__group infos__group--date'>
                                  <Icon icon="uil:schedule" />
                                  <span>{formatDate(booking?.startDate)}</span>
                                </div>
                                <div className='infos__group infos__group--date'>
                                  <Icon icon="ph:clock" />
                                  <span>{formatTime(booking?.startDate) + " - " + formatTime(booking?.endDate)}</span>
                                </div>
                                <div className='infos__group infos__group--loc'>
                                  <Icon icon="bx:map" />
                                  <span>{booking?.room.name}</span>
                                </div>
                              </div>
                              <div className='users'>
                                {firstFiveUsers.map((user, i) => (
                                  <div key={i} className='user'>
                                    <img src={user.picture} alt={user.name} />
                                  </div>
                                ))}
                                {remainingUsersCount > 0 && (
                                  <div className='remaining user'>{`+${remainingUsersCount}`}</div>
                                )}
                              </div>
                            </BookingCard>
                          </Link>
                          <Form onSubmit={(e) => handleDelete(e, booking?.id)}>
                            <SmallSubmitButton text="Supprimer" backgroundColor="var(--accident)">Supprimer</SmallSubmitButton>
                          </Form>
                        </Item>
                      </>
                    )
                  })}
              </List>
            </div>
          </Container>
        </Wrap>
      </Section>
    </>
  )
}