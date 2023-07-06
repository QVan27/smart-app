import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Wrap from '@components/Wrap'
import { Nunito } from 'next/font/google'
import { Icon } from '@iconify/react';
import { formatDate, formatTime } from '@utils/dateFormats';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})

const Section = styled.section`
  display: grid;
  place-items: center;
  align-content: center;
  min-height: 100vh;
  width: 100%;
  background-color: var(--text-light);
`;

const List = styled.div`
  display: grid;
  gap: 1.25rem;
  padding: 5.5rem 0;

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
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
      max-width: 80%;
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

const CreateBookingButton = styled.div`
  a {
    display: flex;
    width: 3.125rem;
    height: 3.125rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    border-radius: 50px;
    background: #23252C;
    box-shadow: var(--secondary-shadow);
  }
`;

export default function Home() {
  const router = useRouter();
  const [userBookings, setUserBookings] = useState(null);

  useEffect(() => {
    const fetchUserBooKings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/bookings', {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const user = await response.json();
          setUserBookings(user);
        } else {
          console.log('Failed to fetch user information.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserBooKings();
  }, []);

  return (
    <>
      <Section>
        <Wrap>
          <List>
            {userBookings
            ?.filter(booking => booking.isApproved === true)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .map((booking, i) => {
              const firstFiveUsers = booking?.users.slice(0, 5);
              const remainingUsersCount = booking?.users.length - firstFiveUsers.length;

              return (
                <Link key={i} href={`/${booking.id}`}>
                  <BookingCard key={i} className={nunito.className}>
                    <div className='heading'>
                      <p>{booking.purpose}</p>
                      <span>{formatDate(booking.startDate)}</span>
                    </div>
                    <div className='infos'>
                      <div className='infos__group infos__group--date'>
                        <Icon icon="ph:clock" />
                        <span>{formatTime(booking.startDate) + " - " + formatTime(booking.endDate)}</span>
                      </div>
                      <div className='infos__group infos__group--loc'>
                        <Icon icon="bx:map" />
                        <span>{booking.room.name}</span>
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
              );
            })}
          </List>
        </Wrap>
      </Section>
      <CreateBookingButton>
        <Link href="/create-booking">
          <Image
            src="/images/plus.svg"
            width={15}
            height={15}
            alt="plus" />
        </Link>
      </CreateBookingButton>
    </>
  )
}
