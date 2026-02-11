
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Youtube, ExternalLink, Loader2, Volume2, VolumeX } from 'lucide-react';
import { askDraMelyana, generateSpeech } from '../services/geminiService';
import { Message } from '../types';

interface ChatbotProps {
  userName: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicializa a saudação quando o nome do usuário muda ou o bot é aberto
  useEffect(() => {
    if (messages.length === 0 && userName) {
      setMessages([
        { role: 'assistant', content: `Olá, ${userName}! Sou a Dra. Melyana. Estou aqui para te guiar na sua jornada fitness. Como posso te ajudar com sua alimentação hoje?` }
      ]);
    }
  }, [userName, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const decodeBase64 = (base64: string) => {
    try {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (e) {
      console.error("Erro no decode base64:", e);
      return new Uint8Array();
    }
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const playAudio = async (base64Audio: string) => {
    if (isMuted || !base64Audio) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();
      
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) {
      console.error("Erro ao reproduzir áudio:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await askDraMelyana(userMsg, userName);
      const audioBase64 = await generateSpeech(response.text);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text,
        links: response.links,
        youtubeQuery: userMsg, // Usamos a pergunta do usuário para o redirecionamento
        audioBase64: audioBase64 || undefined
      }]);

      if (audioBase64 && !isMuted) {
        playAudio(audioBase64);
      }
    } catch (err) {
      console.error("Erro no processamento da mensagem:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[550px] glass shadow-3d rounded-[2rem] flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-300 border-rose-100">
          <div className="bg-gradient-to-r from-rose-400 to-rose-300 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <img src="https://picsum.photos/seed/melyana/100/100" alt="Dra Melyana" className="object-cover w-full h-full" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Dra. Melyana</h3>
                <p className="text-[10px] opacity-90">Ativa • Respondendo da Internet</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsMuted(!isMuted)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors" title={isMuted ? "Desmutar" : "Mutar"}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/60">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-sm relative group ${
                  msg.role === 'user' 
                    ? 'bg-rose-500 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-rose-50 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                  
                  {msg.role === 'assistant' && msg.audioBase64 && (
                    <button 
                      onClick={() => playAudio(msg.audioBase64!)}
                      className="absolute -right-2 -top-2 bg-rose-100 text-rose-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Volume2 size={12} />
                    </button>
                  )}

                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-rose-50 space-y-1">
                      <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Baseado em:</p>
                      {msg.links.slice(0, 2).map((link, i) => (
                        <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-blue-500 hover:underline truncate">
                          <ExternalLink size={10} /> {link.title}
                        </a>
                      ))}
                    </div>
                  )}

                  {msg.youtubeQuery && (
                    <div className="mt-4">
                      <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent("Dra Melyana " + msg.youtubeQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all border border-red-100 shadow-sm"
                      >
                        <Youtube size={16} />
                        Assistir vídeo no YouTube
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-rose-50 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="animate-spin text-rose-400" size={16} />
                  <span className="text-xs text-rose-400 font-bold">Buscando a melhor resposta...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-rose-50 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Diga algo para Dra. Melyana...`}
              className="flex-1 bg-rose-50/50 border border-rose-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className={`${isLoading ? 'bg-slate-300' : 'bg-rose-500 hover:bg-rose-600'} text-white p-3 rounded-2xl transition-all shadow-md active:scale-95`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white p-5 rounded-full shadow-3d transition-all hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          <MessageCircle size={32} className="relative z-10" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
