import { SegmentedControl } from '@mantine/core';
import classes from '../Styles/SearchControl.module.css'

interface SearchControlProps {
    onChange: (value: string) => void;
    value:string
}


const SearchControl: React.FC<SearchControlProps> = ({ onChange,value }) => {
return (
    <SegmentedControl
            value={value}
            radius="xl"
            size="sm"
            data={['track', 'album', 'artist', 'playlist']}
            classNames={classes}
            onChange={onChange}
            
    />
);
}

export default SearchControl;
