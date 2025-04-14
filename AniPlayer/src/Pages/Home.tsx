import Searchbar from '../Components/SearchBar'
import SongCard from '../Components/SongCard'
import { Center, AppShell,Burger,Title,Flex, Group, Box} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Song, UserProfile} from '../Components/types';
import SpotifyButton from '../Components/SpotifyButton';
import { UserCard } from '../Components/UserCard';
import { fetchUserProfile } from '../API/api';
import SearchControl from '../Components/SearchControl'

function Home(){
    const [opened, { toggle }] = useDisclosure();
    const [songs, setSongs] = useState<Song[]>([])
    const [seen, setSeen] = useState<string[]>(["Lady Gaga", "Drake", "Adele", "Beyonce", "Ed Sheeran"])
    const [isLoggedIn, setLogin] = useState(false)
    const [User, setUser] = useState<UserProfile| undefined>()
    const [SearchType, setSearchType] = useState("track")

    const fetchAPI = async (searchQuery:string, type:string) => {
      try {
        const response = await axios.get("http://localhost:8080/spotify-search",{
          params:{
            q: searchQuery,
            type:type
          }
        });
        let formattedItems: Song[] = [];
        if (type === 'track') {
          formattedItems = response.data.tracks.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            album: item.album.name,
            image: item.album.images[0]?.url || "", // Handle missing images
            spotifyUrl: item.external_urls.spotify,
            previewUrl: item.preview_url || null, // Some tracks might not have previews
          }));
        } else if (type === 'playlist') {
          formattedItems = response.data.playlists.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            image: item.images[0]?.url || "", // Handle missing images
            spotifyUrl: item.external_urls.spotify,
          }));
        } else if (type === 'artist') {
            formattedItems = response.data.artists.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            genres: item.genres,
            image: item.images[0]?.url || "", // Handle missing images
            spotifyUrl: item.external_urls.spotify,
            }));
          } else if (type === 'album') {
            formattedItems = response.data.albums.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            image: item.images[0]?.url || "", // Handle missing images
            spotifyUrl: item.external_urls.spotify,
            releaseDate: item.release_date,
            }));
        }
        setSongs((prevItems: Song[]) => [...formattedItems, ...prevItems]);

        
      }catch(error){
        console.error("Error Fetching data:",error)
      }
      
    }

    const loginAPI = async () => {
      try{
        window.location.href = 'http://localhost:8080/login'; // Redirect the user to the Spotify login page
        
        
      }catch(error){
        console.error("Error Fetching data:",error)
      }
    }

    const logout = () => {
      localStorage.clear()
      setLogin(false)
      setUser(undefined)
    }

    useEffect(() => {
      let token = localStorage.getItem("access_token");
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const urlToken = params.get("access_token");
      if (urlToken) {
        setLogin(true);
        token = urlToken;
        localStorage.setItem("access_token", token);
        window.history.replaceState(null, '', window.location.pathname);
        fetchUserProfile(token).then((userProfile) => {
          setUser(userProfile);
          if (userProfile.id) {
            localStorage.setItem("spotify_id", userProfile.id);
          }
        });
      }
    }, []);

    useEffect(()=>{
      const StartQuery = seen[Math.floor(Math.random()*seen.length)]
      fetchAPI(StartQuery, SearchType);
       
    },[])

    return (
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 350,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
       
        <AppShell.Header>
          
            
                <Center style={{ width: '100%', height: '100%' }}>
                  <Flex
                    gap="md"
                    align="center"
                    justify="space-between"
                    style={{ height: '100%' }}
                  >
                     <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                      />
                        <Title>ANIPLAYLIST</Title>
                        <Searchbar onSubmit={(query) => fetchAPI(query, SearchType)} type={SearchType}/>
                        <SearchControl onChange={setSearchType} value={SearchType} />
                      { isLoggedIn ? <SpotifyButton onClick={logout} Name='LOGOUT'/> : <SpotifyButton onClick={loginAPI} Name='LOGIN'/>}
                  </Flex>
                </Center>
          
        </AppShell.Header>
        <AppShell.Navbar p="md">
        {User && <Box><UserCard user={User}/></Box>}
        </AppShell.Navbar>
        <AppShell.Main style={{flex:1, minHeight:0, overflow:'auto'}}>
            
            <Group justify='center' >
            <Title>SONG LIST</Title>
            <Flex
              direction="row"
              gap="md"
              align="center"
              justify="center"
              wrap="wrap"
              
            > 
              {songs.map(song => (
                <SongCard key={song.id} song={song}  />
              ))}
            </Flex>
            </Group>
            
                  
                  
              

            
            
        </AppShell.Main>
      </AppShell>
    );
  }


export default Home