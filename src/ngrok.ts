import axios from "axios";

type Tunnel = {
    public_url: string;
}

type NgrokTunnelResponse = {
    tunnels: Tunnel[];
}

export const getNgrokUrl = async () => {
    const response = await axios.get<NgrokTunnelResponse>("localhost:4040/api/tunnels");

    const url = response.data.tunnels[0].public_url;

    // TODO: Parse to remove http(s)

    return url;
}