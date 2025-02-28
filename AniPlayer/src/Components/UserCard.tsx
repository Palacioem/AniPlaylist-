import { Avatar, Button, Card, Group, Text } from '@mantine/core';
import classes from '../Styles/UserCard.module.css'
import { UserProfile } from './types';
const stats = [
  { value: '34K', label: 'Followers' },
];

interface UserProp{
    user: UserProfile
}

export const UserCard:React.FC<UserProp> = ({user}) =>{
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text ta="center" fz="lg" fw={500}>
        {user.followers?.total}
      </Text>
      <Text ta="center" fz="sm" c="dimmed" lh={1}>
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder padding="xl" radius="md" className={classes.card}>
      <Card.Section
        h={140}
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80)',
        }}
      />
      <Avatar
        src= {user.images[1]?.url ?? "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png"}
        size={80}
        radius={80}
        mx="auto"
        mt={-30}
        className={classes.avatar}
      />
      <Text ta="center" fz="lg" fw={500} mt="sm">
        {user.display_name}
      </Text>
      <Text ta="center" fz="sm" c="dimmed">
    
      </Text>
      <Group mt="md" justify="center" gap={30}>
        {items}
      </Group>
    <Button 
      fullWidth 
      radius="md" 
      mt="xl" 
      size="md" 
      variant="default" 
      onClick={() => window.location.href = user.external_urls?.spotify}
    >
      Follow
    </Button>
    </Card>
  );
}