import React, {useEffect, useState} from 'react';
import GenericList from './GenericList';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import axios from "axios";
import {useUserProfile} from "../contexts/UserContext";


const MeetingComponent = () => {
    //need to replace this with an api call
    const simpleItems = ['Item 1', 'Item 2', 'Item 3'];
    const complexItems = [
        { name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
        { name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
      ];
    const userProfile = useUserProfile();
      // meeting place
      // attendees
      // whether each attendee is coming or not
      // time

    const [meetingsListLoading, setMeetingsListLoading] = useState(true);
    // let meetingsList = [];
    const [meetingsList, setMeetingsList] = useState([]);

    useEffect(() => {
        fetchMeetingsList();
    }, []);


    async function fetchMeetingsList() {
        setMeetingsListLoading(true);
        try {
            let userId= userProfile.sub;
            let meetingsUrl = `http://localhost:8000/get-meetings/${userId}`;
            const response = await axios.get(meetingsUrl);
            setMeetingsList(response.data.message);
        } catch (error) {
            console.error('Error fetching location from server:', error);
        }
        finally {
            setMeetingsListLoading(false);
        }
    }

      const renderComplexItem = (item) => (
        <>
          <ListItemAvatar>
            <Avatar src={item.avatar} />
          </ListItemAvatar>
          <ListItemText primary={item.name} />
        </>
      );

      const title = "My Things";

      return (
        <div className="meetings-container">
            {!meetingsListLoading && <GenericList items={meetingsList} title={title} renderItems={renderComplexItem} />}
        </div>
      )

}

export default MeetingComponent;