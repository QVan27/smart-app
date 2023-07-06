import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Nunito } from 'next/font/google'
import Select from 'react-select';
import styled from "styled-components";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Wrap from '@components/Wrap'
import SubmitButton from '@components/buttons/SubmitButton'
import ErrorMessage from '@components/form/ErrorMessage';
import SuccessMessage from '@components/form/SuccessMessage';

const nunito = Nunito({
  subsets: ['latin'],
  weights: [400, 700],
})

const Section = styled.section`
  display: grid;
  place-items: center;
  align-content: center;
  min-height: 95vh;
  width: 100%;
  background-color: var(--text-light);
`;

const Form = styled.form`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 1.5rem;
  margin-inline: auto;
  width: min(414px, 100%);

  .title,
  .rooms,
  .users {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .dates {
    display: flex;
    gap: 0.375rem;
  }

  .title input {
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

export default function CreateBooking() {
  const router = useRouter();
  const [start, setStartDate] = useState(null);
  const [end, setEndDate] = useState(null);
  const [roomBooking, setRoomBooking] = useState();
  const [rooms, setRooms] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [selectedOptions, setSelectedOptions] = useState();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [optionList, setOptionList] = useState([]);
  const userIds = selectedOptions?.map(option => option.value);

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!start || !end) {
        setError('Veuillez sélectionner une date de début et de fin');
        return;
      }

      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accessToken')
        },
        body: JSON.stringify({
          startDate: start.$d.toLocaleDateString() + ' ' + start.$d.toLocaleTimeString(),
          endDate: end.$d.toLocaleDateString() + ' ' + end.$d.toLocaleTimeString(),
          purpose,
          roomId: roomBooking?.value,
          userIds
        }),
      });

      if (res.ok) {
        setError('');
        setSuccess('Réunion créé avec succès');

        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        console.log('Erreur de création de réunion');
        setError('Erreur de création de réunion');
      }
    } catch (error) {
      console.error('Erreur de création de réunion:', error);
      setError('Erreur de création de réunion');
    }
  }

  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
  };

  return (
    <>
      <Section className={nunito.className}>
        <Wrap>
          <Form onSubmit={handleSubmit}>
            {success && <SuccessMessage text={success} />}
            {error && <ErrorMessage text={error} />}
            <div className='title'>
              <label htmlFor='purpose'>Objet de la réunion</label>
              <input
                type="text"
                id="purpose"
                placeholder='Optimisation UI/UX : Actions Concrètes'
                value={purpose}
                required
                onChange={handlePurposeChange} />
            </div>
            <div className='dates'>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                <DateTimePicker
                  label="Début de la réunion"
                  value={start?.$d}
                  onChange={(newValue) => setStartDate(newValue)}
                />
                <DateTimePicker
                  label="Fin de la réunion"
                  value={end?.$d}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </LocalizationProvider>
            </div>
            <div className='rooms'>
              <label htmlFor="room">Salle</label>
              <Select
                name="room"
                placeholder="Sélectionner une salle"
                options={rooms.map((room) => ({
                  value: room.id,
                  label: room.name
                }))}
                onChange={setRoomBooking}
                value={roomBooking}
                required
              />
            </div>
            <div className='users'>
              <label htmlFor="users">Participants</label>
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
            <SubmitButton text="Créer" backgroundColor="var(--accident)" />
          </Form>
        </Wrap>
      </Section>
    </>
  )
}
