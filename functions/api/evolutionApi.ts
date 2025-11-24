import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'https://evolution-api.grupovorp.com';
const API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'apikey': API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface InstanceStatus {
  instance: {
    instanceName: string;
    state: string;
  };
}

export interface QRCodeResponse {
  code: string;
  base64: string;
  pairingCode?: string;
}

export interface ConnectionState {
  instance: {
    instanceName: string;
    state: string;
  };
}

export const evolutionApi = {
  // Verifica o status da instância
  async checkInstanceStatus(instanceName: string): Promise<InstanceStatus> {
    const response = await api.get(`/instance/connectionState/${instanceName}`);
    return response.data;
  },

  // Conecta a instância (gera QR Code)
  async connectInstance(instanceName: string): Promise<QRCodeResponse> {
    const response = await api.get(`/instance/connect/${instanceName}`);
    return response.data;
  },

  // Verifica o estado da conexão
  async getConnectionState(instanceName: string): Promise<ConnectionState> {
    const response = await api.get(`/instance/connectionState/${instanceName}`);
    return response.data;
  },
};
