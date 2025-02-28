
import axios from 'axios'



export const fetchUserProfile = async (token:string) =>{
    try{
        const response = await axios.get("http://localhost:8080/getProfile",{
            params: {
                q: token
            }
        });
        return response.data
    } catch (error) {
        console.error(error);
    }
}

