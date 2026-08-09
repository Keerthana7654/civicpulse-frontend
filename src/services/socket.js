import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "./api";

let client = null;

export function connectSocket(onConnected) {
  if (client && client.active) return client;

  client = new Client({
    webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
    reconnectDelay: 4000,
    onConnect: () => onConnected?.(client),
  });

  client.activate();
  return client;
}

export function disconnectSocket() {
  client?.deactivate();
  client = null;
}
