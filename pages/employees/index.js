import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Wrap from '@components/Wrap'
import { Nunito } from 'next/font/google'
import { Icon } from '@iconify/react';
import Link from 'next/link';

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 500, 700],
})

const Section = styled.section`
  min-height: 100vh;
  padding-top: 5.5rem;
  width: 100%;
  background-color: var(--text-light);
`;

const Container = styled.div``;

const Research = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;

  @media screen and (min-width: 1200px) {
    padding-left: 0;
    width: 1200px;
    margin-inline: auto;
  }

  
  .add {
    display: flex;
    justify-content: space-between;
    padding-right: 20px;
    margin-bottom: 1.25rem;

    a {
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: underline;
      transition: opacity 0.5s ease-out;

      @media screen and (hover: hover) { &:hover { opacity: 0.65; } }
    }

    @media screen and (min-width: 1200px) { padding-right: 0; }
  }
  
  .filters {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    padding: 10px 20px 10px 0;
    overflow-x: scroll;
    overflow-y: hidden;

    &::-webkit-scrollbar { display: none; }
  }

  .filter {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9375rem;
    cursor: pointer;

    &__img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: var(--primary-text);
      color: var(--text-light);

      &.all {
        color: var(--text-light);
        font-size: 0.75rem;
        font-weight: 500;
      }
    }

    &__text {
      font-size: 0.85rem;
      font-weight: 500;
    }

    &.active {
      .filter__img {
        outline: 2px solid var(--accident);
        color: var(--accident);
      }
    }

    @media screen and (hover: hover) {
      &:hover {
        .filter__img {
          outline: 2px solid var(--accident);
          color: var(--accident);
        }
      }
    }
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  margin-top: 1.88rem;
  padding-bottom: 1.88rem;
`;

const User = styled.li`
  display: flex;
  padding: 0rem 0rem 0rem 0.9375rem;
  align-items: center;
  gap: 0.9375rem;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.9375rem;

    .list__img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: var(--secondary-shadow);
  
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
  }

`;

export default function Edit() {
  const [users, setUsers] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsersInfo = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          headers: {
            'x-access-token': localStorage.getItem('accessToken')
          }
        });

        if (response.ok) {
          const user = await response.json();

          setUsers(user);
        } else {
          console.log('Failed to fetch user information.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUsersInfo();
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

  const handleFilterChange = (filter) => { setActiveFilter(filter); };
  const showButtonsAdmin = currentUser?.roles.includes('ADMIN');

  return (
    <Section className={nunito.className}>
      <Research>
        <div className='add'>
          <span>Groupes</span>
          {showButtonsAdmin && <Link href="/employees/create">Ajouter</Link>}
        </div>
        <div className='filters'>
          <div
            className={`filter ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <div className='filter__img all'>
              Tout
            </div>
            <div className='filter__text'>
              Contacts
            </div>
          </div>
          <div
            className={`filter ${activeFilter === 'designer' ? 'active' : ''}`}
            onClick={() => handleFilterChange('designer')}
          >
            <div className='filter__img'>
              <Icon icon="clarity:design-line" />
            </div>
            <div className='filter__text'>
              Designers
            </div>
          </div>
          <div
            className={`filter ${activeFilter === 'marketing' ? 'active' : ''}`}
            onClick={() => handleFilterChange('marketing')}
          >
            <div className='filter__img'>
              <Icon icon="nimbus:marketing" />
            </div>
            <div className='filter__text'>
              Marketing
            </div>
          </div>
          <div
            className={`filter ${activeFilter === 'developer' ? 'active' : ''}`}
            onClick={() => handleFilterChange('developer')}
          >
            <div className='filter__img'>
              <Icon icon="iconoir:developer" />
            </div>
            <div className='filter__text'>
              Développeurs
            </div>
          </div>
          <div
            className={`filter ${activeFilter === 'ux/ui' ? 'active' : ''}`}
            onClick={() => handleFilterChange('ux/ui')}
          >
            <div className='filter__img'>
              <Icon icon="majesticons:ux-circle-line" />
            </div>
            <div className='filter__text'>
              UX/UI
            </div>
          </div>
          <div
            className={`filter ${activeFilter === 'manager' ? 'active' : ''}`}
            onClick={() => handleFilterChange('manager')}
          >
            <div className='filter__img'>
              <Icon icon="majesticons:ux-circle-line" />
            </div>
            <div className='filter__text'>
              Manageurs
            </div>
          </div>
        </div>
      </Research>
      <Wrap>
        <Container>
          <List>
            {users &&
              users
                .filter((user) => {
                  if (activeFilter === 'all') {
                    return true;
                  } else {
                    return user.position.toLowerCase().includes(activeFilter);
                  }
                })
                .sort((a, b) => a.firstName.localeCompare(b.firstName))
                .map((user) => (
                  <User key={user.id}>
                    <Link href={`/employees/${user.id}`} className='list__link'>
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
                    </Link>
                  </User>
                ))}
          </List>
        </Container>
      </Wrap>
    </Section>
  );
}
