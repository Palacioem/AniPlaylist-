import React from 'react';
import {IconBrandSpotify} from '@tabler/icons-react'
import { Button ,} from '@mantine/core';


interface SpotifyButtonProps {
    onClick: () => void;
    Name: string;
}

const SpotifyButton: React.FC<SpotifyButtonProps> = ({ onClick, Name }) => {

    return (
        <Button
            radius='xl'
            leftSection={<IconBrandSpotify size={26}/>}
            variant='outline'
            color='rgba(0, 252, 55, 1)'
            onClick={onClick}
        >
            {Name}
        </Button>
    );
};

export default SpotifyButton;