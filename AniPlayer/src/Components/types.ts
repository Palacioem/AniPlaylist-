export interface Song {
    id: string;
    name: string;
    artist: string;
    album: string;
    image: string;
    spotifyUrl: string;
    previewUrl: string | null;
}