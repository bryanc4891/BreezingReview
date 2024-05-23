import React from 'react';
import { useUserProfile } from '../contexts/UserContext';
import { useSearchParams } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, Autocomplete, Button } from '@mui/material';



export const MeetingComponent = () => {

    const userProfile = useUserProfile();
    console.log("userProfile", userProfile);
    const [location, setLocation] = React.useState();
    
    const [searchParams, setSearchParams] = useSearchParams();

    const friends = [
        {label: "John", id: 1235},
        {label: "Bill", id: 12335},
        {label: "Hank", id: 12325}
    ]

    React.useEffect(() => {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${searchParams.get('lat')}&lon=${searchParams.get('long')}`)
        .then((response) => response.json())
        .then((data) => {
            setLocation(data);
        })
        .catch((error) => console.log(error));
       }, []);

       if (location) {
        console.log("location", location);
       }

    return <div>
        <h1>Schedule a Meeting</h1>
        <form>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
            <TextField label={ location?.display_name ?? 'Please enter a location'} id="outlined-basic"  />
            <DateTimePicker label="Choose a date and time" />
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={friends}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Attendees" />}
                />
                <Button variant="contained">Schedule Meeting</Button>
        </DemoContainer>
        </LocalizationProvider>
    </form>
        
    </div>
}