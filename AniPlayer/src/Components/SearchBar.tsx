import {TextInput} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react'






function SearchBar({ onSubmit, type }: { onSubmit: (value: string, type: string) => void; type: string; }) {
    const icon = <IconSearch size={16} />;
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSubmit(event.currentTarget.value,type);
        }
    };

    return (
        <>
            <TextInput
                leftSectionPointerEvents="none"
                leftSection={icon}
                placeholder="Search"
                onKeyDown={handleKeyDown}

            />
        </>
    );
}

export default SearchBar