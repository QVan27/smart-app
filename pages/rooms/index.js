import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Wrap from '@components/Wrap'
import { Nunito } from 'next/font/google'
import { Icon } from '@iconify/react';
import Link from 'next/link';
import LinkButton from '@/src/components/buttons/LinkButton';

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})

const Section = styled.section`
  display: grid;
  place-items: center;
  padding: 5.5rem 0;
  width: 100%;
  background-color: var(--text-light);

  @media screen and (min-width: 1180px) {
    min-height: 95vh;
    padding: 4rem 0;
  }
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

export default function Rooms() {
  const [rooms, setRooms] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rooms', {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const rooms = await response.json();
          setRooms(rooms);
        } else {
          console.log('Failed to fetch rooms information.');
        }
      } catch (error) {
        console.error('Error fetching rooms information:', error);
      }
    };

    fetchRooms();
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

  const showButtonsAdminOrModerator = user?.roles.includes('MODERATOR') || user?.roles.includes('ADMIN');

  return (
    <>
      <Section className={nunito.className}>
        <Wrap>
          <List>
            {rooms?.map((room, i) => (
              <li key={i}>
                <Link href={`/rooms/${room.id}`}>
                  <Room>
                    <div className='image'>
                      <img src={room.image} alt="" />
                    </div>
                    <div className='content'>
                      <div className='content__top'>
                        <p>{room.name}</p>
                        <p>
                          <Icon icon="material-symbols:floor" />
                          <span>{room.floor}</span>
                        </p>
                      </div>
                      <div className='content__bottom'>
                        <p>{room.pointOfContactEmail}</p>
                        <p>{room.pointOfContactPhone}</p>
                      </div>
                    </div>
                  </Room>
                </Link>
              </li>
            ))}
          </List>
          {showButtonsAdminOrModerator && (
            <LinkButton href="/rooms/add" text="Ajouter une salle" backgroundColor="var(--main)" />
          )}
        </Wrap>
      </Section>
    </>
  )
}
