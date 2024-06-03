import React from 'react';
import { useUserProfile } from '../contexts/UserContext';
import { useSearchParams } from 'react-router-dom';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TextField, Autocomplete, Button, Stack, Box } from '@mui/material';
import axios from 'axios';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Checkbox from '@mui/material/Checkbox';



export const MeetingComponent = () => {

    const now = Date.now();

    const userProfile = useUserProfile();
    const [friends, setFriends] = React.useState([]);

    const [formState, setFormState] = React.useState({
        organiser: userProfile,
        place: null,
        datetime: null,
        attendees: null
    });
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSubmit = (event) => {
        event.preventDefault();
            axios.post(`http://localhost:8000/meeting` , {
                organiser: userProfile.sub,
                place: formState?.place.place_id,
                datetime: formState.datetime,
                attendees: formState?.attendees.map(value => value[0]).join(',')
            }, {
        })
        .then(response => console.log(response))
        .catch((error)=> console.log(error));
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormState((prevState) => ({
            ...prevState,
            place: value
        }));
    }

    React.useEffect(() => {
        axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${searchParams.get('lat')}&lon=${searchParams.get('long')}`)
        .then((response) => response.data)
        .then((data) => {
            setFormState((prevState) => {
                return {
                    ...prevState,
                    place: data
                }
            });
        })
        .catch((error) => console.log(error));
       }, []);

    React.useEffect(() => {
        axios.get(`http://localhost:8000/users/${userProfile.sub}`)
        .then((response) => {
            setFriends(response.data.data);
        })
        .catch(error => console.log('error getting friends', error));
    }, [])

    const handleAutoCompleteSelect = (event, value) => {
        setFormState((prevState) => {
            return {
                ...prevState,
                attendees: value
            }
        })
    }

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return <>
    <Box component="form" onSubmit={handleSubmit}> 
        <Stack spacing={4} sx={{width: '600px;', margin: 'auto'}}>
        <h1>Schedule a Meeting</h1>
      <LocalizationProvider dateAdapter={AdapterMoment}>
            <TextField 
                value={ formState.place?.display_name ?? 'Please enter a location'} 
                id="location_field" 
                onChange={handleChange}
                />
            <DateTimePicker 
                label="Choose a date and time" 
                name="datetime"
                value={formState.value}
                onChange={(value) => {
                    setFormState((prevState) => {
                        return {
                            ...prevState,
                            datetime: value.format("YYYY-MM-DD HH:mm:ss")
                        }
                    })
                }}
                // onChange={(newDate) => {
                //     // setFormState((prevState) => {
                //     //     ...prevState,
                //     //     datetime: value
                //     // })
                //     setFormState((prevState) => {
                //        return {
                //             ...prevState,
                //         datetime: newDate
                //     }
                //     })
                // }}
                // onChange={(newValue) => setSelectedDateTime(newValue)}
                slotProps={{
                    textField: {
                        id: 'datetime_field'
                    }
                }}
                />
            <Autocomplete
                multiple
                disablePortal
                id="attendees_field"
                options={friends}
                name="attendees"
                renderInput={(params) => <TextField {...params} label="Attendees" />}
                onChange={handleAutoCompleteSelect}
                // isOptionEqualToValue={(option, value) => option.value === value.value }
                disableCloseOnSelect
                getOptionLabel={(option) => option[1]}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option[1]}
                    </li>
                )}
                />
                <Button type="submit" variant="contained">Schedule Meeting</Button>
        </LocalizationProvider>
        </Stack>

        </Box>
    </>
}