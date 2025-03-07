import axios from "axios";

type Tunnel = {
    public_url: string;
}

type NgrokTunnelResponse = {
    tunnels: Tunnel[];
}

export const getNgrokUrl = async (): Promise<string> => {
    try {
        const response = await axios.get<NgrokTunnelResponse>("http://localhost:4040/api/tunnels");
        
        if (!response.data.tunnels || response.data.tunnels.length === 0) {
            throw new Error("No active ngrok tunnels found");
        }

        const url = response.data.tunnels[0].public_url;
        return url.replace(/^https?:\/\//, '');
    } catch (error) {
        // Check if the error is a connection error (ngrok not running)
        if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
            throw new Error("Ngrok is not running");
        }
        // For any other errors
        throw error;
    }
}