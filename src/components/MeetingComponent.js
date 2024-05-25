import React from 'react';
import { useUserProfile } from '../contexts/UserContext';
import { useSearchParams } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, Autocomplete, Button, FormControl,InputLabel, Input, FormHelperText, Stack, FormGroup } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';



export const MeetingComponent = () => {

    const userProfile = useUserProfile();
    const [location, setLocation] = React.useState(null);
    const [formState, setFormState] = React.useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const friends = [
        {label: "John", id: 1235},
        {label: "Bill", id: 12335},
        {label: "Hank", id: 12325}
    ]

    const onSubmit = (event) => {
        event.preventDefault();
        console.log('submitting', event.currentTarget.elements);
        const formElements = Array.from(event.currentTarget.elements);
        setFormState({
            place: formElements.find(item => item.id === "location_field").defaultValue,
            datetime: formElements.find(item => item.id === "datetime_field").defaultValue,
            attendees: formElements.find(item => item.id === "attendees_field").defaultValue

        });
    }

    React.useEffect(() => {
        axios.post(`http://localhost:8000/meeting` , formState, {
        })
        .then(response => console.log(response))
        .catch((error)=> console.log(error));
    }, [formState])

    React.useEffect(() => {
        axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${searchParams.get('lat')}&lon=${searchParams.get('long')}`)
        .then((response) => response.data)
        .then((data) => {
            setLocation(data);
        })
        .catch((error) => console.log(error));
       }, []);

    return <div>
        <h1>Schedule a Meeting</h1>


  
    <form onSubmit={onSubmit}>
        <Stack spacing={4} sx={{width: '600px;'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField 
                value={ location?.display_name ?? 'Please enter a location'} 
                id="location_field" 
                />
            <DateTimePicker 
                label="Choose a date and time" 
                name="datetime"
                slotProps={{
                    textField: {
                        id: 'datetime_field'
                    }
                }}
                />
            <Autocomplete
                disablePortal
                id="attendees_field"
                options={friends}
                name="attendees"
                renderInput={(params) => <TextField {...params} label="Attendees" />}
                />
                <Button type="submit" variant="contained">Schedule Meeting</Button>
        </LocalizationProvider>
        </Stack>

        </form>
    </div>
}