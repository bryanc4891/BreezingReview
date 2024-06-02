import React from 'react';
import GenericList from './GenericList';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';


const MeetingComponent = () => {
    const simpleItems = ['Item 1', 'Item 2', 'Item 3'];
    const complexItems = [
        { name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
        { name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
      ];

      const renderComplexItem = (item) => (
        <>
          <ListItemAvatar>
            <Avatar src={item.avatar} />
          </ListItemAvatar>
          <ListItemText primary={item.name} />
        </>
      );

      const title = "My Things"

      return (
        <>
            {/* <GenericList items={complexItems} title={title} renderItem={renderComplexItem} /> */}
            <GenericList items={complexItems} title={title} />
        </>
      )

}

export default MeetingComponent;