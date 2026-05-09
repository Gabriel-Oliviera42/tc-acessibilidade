import axios from "axios";

export async function enviarMensagemChat(mensagem) {
  const response = await axios.post("/chat", { mensagem });
  return response.data.resposta;
}
