
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Utensils, 
  ShoppingBag, 
  FileText, 
  TrendingUp, 
  Calendar,
  ChefHat,
  ChevronRight,
  Download,
  CheckCircle2,
  Clock,
  Heart,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react';
import { RECIPES, WEEKLY_MENU, SHOPPING_LIST } from './constants';
import Chatbot from './components/Chatbot';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });

  // Recuperar usuário do localStorage na montagem
  useEffect(() => {
    const savedUser = localStorage.getItem('melyana_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Inicializar Google Login
  useEffect(() => {
    // Fix: Access google property from window by casting to any to prevent TS error
    const googleInstance = (window as any).google;
    if (!user && googleInstance) {
      /* global googleInstance */
      googleInstance.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // O usuário deve substituir pelo seu real ID se baixar
        callback: handleGoogleResponse
      });
      googleInstance.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large", width: "100%", shape: "pill", text: "continue_with" }
      );
    }
  }, [user]);

  const handleGoogleResponse = (response: any) => {
    try {
      // Decode JWT Payload (Simples decode base64 para id_token)
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const profile = JSON.parse(jsonPayload);
      
      const newUser: User = {
        name: profile.name,
        email: profile.email,
        weight: 62.0,
        targetWeight: 65.0
      };

      setUser(newUser);
      localStorage.setItem('melyana_user', JSON.stringify(newUser));
    } catch (e) {
      console.error("Erro ao processar login do Google:", e);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fallback name se estiver vazio (apenas para o mock de login)
    const finalName = authMode === 'register' ? authData.name : (authData.email.split('@')[0]);

    const newUser: User = {
      name: finalName || "Usuário",
      email: authData.email,
      weight: 62.0,
      targetWeight: 65.0
    };
    
    setUser(newUser);
    localStorage.setItem('melyana_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('melyana_user');
    setAuthData({ name: '', email: '', password: '' });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => {
        setActiveTab(id);
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 rounded-2xl mb-1 ${
        activeTab === id 
          ? 'bg-rose-400 text-white shadow-lg translate-x-1' 
          : 'text-slate-500 hover:bg-rose-50 hover:text-rose-400 hover:translate-x-1'
      }`}
    >
      <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
      {isSidebarOpen && <span className="font-semibold text-sm whitespace-nowrap animate-in fade-in duration-300">{label}</span>}
    </button>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-3d border border-white relative z-10 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-rose-300 rounded-2xl flex items-center justify-center shadow-xl shadow-rose-200 mb-4">
              <Heart className="text-white" size={32} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-800">Melyana<span className="text-rose-400 font-normal italic">Nutri</span></h1>
            <p className="text-slate-500 text-sm mt-2">Sua jornada para um corpo saudável começa aqui.</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'register' && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
                <input 
                  type="text" 
                  placeholder="Seu nome completo" 
                  required
                  value={authData.name}
                  onChange={e => setAuthData({...authData, name: e.target.value})}
                  className="w-full bg-white/50 border border-rose-100 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all shadow-sm"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                required
                value={authData.email}
                onChange={e => setAuthData({...authData, email: e.target.value})}
                className="w-full bg-white/50 border border-rose-100 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all shadow-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" size={18} />
              <input 
                type="password" 
                placeholder="Sua senha" 
                required
                value={authData.password}
                onChange={e => setAuthData({...authData, password: e.target.value})}
                className="w-full bg-white/50 border border-rose-100 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all shadow-sm"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-200 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {authMode === 'login' ? 'Entrar Agora' : 'Criar Minha Conta'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-rose-100"></div>
            </div>
            <span className="relative bg-white/60 px-4 text-xs font-bold text-rose-300 uppercase tracking-widest">ou</span>
          </div>

          {/* Botão de Login do Google */}
          <div id="googleSignInButton" className="w-full flex justify-center overflow-hidden h-12"></div>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              {authMode === 'login' ? 'Não tem conta? Cadastre-se agora' : 'Já possui conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-rose-900/10 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-teal-200/10 rounded-full blur-3xl pointer-events-none"></div>

      <aside 
        className={`fixed lg:relative z-40 h-full bg-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col border-r border-rose-50 ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-20 lg:w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 mb-4 overflow-hidden">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-tr from-rose-500 to-rose-300 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200 shrink-0">
              <Heart className="text-white" size={24} fill="currentColor" />
            </div>
            {isSidebarOpen && (
              <h1 className="text-2xl font-serif font-bold text-slate-800 tracking-tight animate-in fade-in slide-in-from-left-2">
                Melyana<span className="text-rose-400 font-normal italic">Nutri</span>
              </h1>
            )}
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-rose-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4">
          <NavItem id="dashboard" icon={Home} label="Dashboard" />
          <NavItem id="menu" icon={Calendar} label="Cardápio da Semana" />
          <NavItem id="recipes" icon={ChefHat} label="Receitas Fit" />
          <NavItem id="shopping" icon={ShoppingBag} label="Lista de Compras" />
          <NavItem id="pdfs" icon={FileText} label="Arquivos PDF" />
        </nav>

        <div className="p-4 m-4 bg-rose-50 rounded-3xl overflow-hidden transition-all relative group">
          <div className="flex items-center gap-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=fb7185&color=fff&bold=true`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0" 
            />
            {isSidebarOpen && (
              <div className="overflow-hidden animate-in fade-in duration-300 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500">Membro Premium</p>
              </div>
            )}
            {isSidebarOpen && (
              <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <div className="flex items-center gap-4 p-4 lg:p-6 lg:pb-2">
           <button onClick={toggleSidebar} className="p-3 bg-white shadow-soft rounded-2xl text-slate-500 hover:text-rose-500 hover:scale-105 active:scale-95 transition-all">
              <Menu size={20} />
            </button>
            <div className="hidden lg:block h-8 w-px bg-slate-200"></div>
            <div className="flex-1"></div>
        </div>

        <main className="flex-1 p-4 lg:p-10 overflow-y-auto w-full">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="animate-in slide-in-from-top-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-800 mb-1">Olá, <span className="text-rose-400 font-serif italic">{user.name}!</span> ✨</h2>
              <p className="text-slate-500 text-sm">Pronta para continuar sua transformação hoje?</p>
            </div>
            <div className="flex gap-4 animate-in slide-in-from-right-4 duration-500">
              <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 shadow-soft border border-white">
                <TrendingUp className="text-rose-400" size={20} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Peso Atual</p>
                  <p className="text-sm font-bold text-slate-700">{user.weight} kg / <span className="text-rose-400">{user.targetWeight} kg</span></p>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 glass rounded-[2.5rem] p-8 shadow-soft border border-white animate-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="text-rose-400" /> Macros do Dia
                    </h3>
                    <span className="text-xs font-semibold bg-rose-100 text-rose-500 px-3 py-1 rounded-full uppercase">Progresso: 75%</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'Proteínas', val: 120, target: 150, color: 'bg-rose-400', unit: 'g' },
                      { label: 'Carbos', val: 180, target: 200, color: 'bg-teal-400', unit: 'g' },
                      { label: 'Gorduras', val: 45, target: 60, color: 'bg-amber-400', unit: 'g' },
                    ].map((m, i) => (
                      <div key={i} className="bg-slate-50/50 rounded-3xl p-6 border border-white/50 shadow-sm">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-3">{m.label}</p>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-2xl font-bold text-slate-800">{m.val}</span>
                          <span className="text-slate-400 text-sm">/ {m.target}{m.unit}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${m.color} transition-all duration-1000 ease-out`} style={{ width: `${(m.val/m.target)*100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="glass rounded-[2.5rem] p-8 shadow-soft flex flex-col border border-white animate-in slide-in-from-right-8 duration-500">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Utensils className="text-rose-400" /> Próxima Refeição
                  </h3>
                  <div className="flex-1 relative rounded-3xl overflow-hidden mb-6 group cursor-pointer shadow-lg shadow-rose-100">
                    <img src="https://picsum.photos/seed/foodnext/400/500" alt="Next Meal" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                      <p className="text-white font-bold text-lg mb-1">Strogonoff Fit de Frango</p>
                      <div className="flex items-center gap-3 text-white/80 text-xs">
                        <span className="flex items-center gap-1"><Clock size={12} /> 20 min</span>
                        <span className="flex items-center gap-1"><Heart size={12} fill="white" /> 420 kcal</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-200 active:scale-95">
                    Ver Receita Completa
                  </button>
                </section>
              </div>
            )}

            {/* Abas Restantes (Menu, Recipes, etc) mantêm a lógica anterior */}
            {activeTab === 'menu' && (
              <div className="glass rounded-[2.5rem] p-8 shadow-soft border border-white animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold mb-8 font-serif">Planejamento Semanal</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                        <th className="px-6 py-2">Dia</th>
                        <th className="px-6 py-2">Café da Manhã</th>
                        <th className="px-6 py-2">Almoço</th>
                        <th className="px-6 py-2">Lanche</th>
                        <th className="px-6 py-2">Jantar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {WEEKLY_MENU.map((m, i) => (
                        <tr key={i} className="bg-white/50 hover:bg-white rounded-3xl transition-all hover:scale-[1.01] hover:shadow-sm">
                          <td className="px-6 py-5 font-bold text-rose-400 border-l-4 border-rose-400 rounded-l-2xl">{m.day}</td>
                          <td className="px-6 py-5 text-sm text-slate-600">{m.breakfast}</td>
                          <td className="px-6 py-5 text-sm text-slate-600">{m.lunch}</td>
                          <td className="px-6 py-5 text-sm text-slate-600">{m.snack}</td>
                          <td className="px-6 py-5 text-sm text-slate-600 rounded-r-2xl">{m.dinner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'recipes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-5 duration-500">
                {RECIPES.map((r) => (
                  <div key={r.id} className="glass rounded-[2.5rem] overflow-hidden group hover:shadow-3d transition-all duration-500 border border-white">
                    <div className="h-56 relative overflow-hidden">
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-rose-500 text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-sm">
                        {r.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-slate-800 leading-tight">{r.title}</h4>
                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{r.time}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="text-center p-2 bg-rose-50 rounded-xl">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">P</p>
                          <p className="text-sm font-bold text-rose-500">{r.macros.protein}g</p>
                        </div>
                        <div className="text-center p-2 bg-teal-50 rounded-xl">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">C</p>
                          <p className="text-sm font-bold text-teal-500">{r.macros.carbs}g</p>
                        </div>
                        <div className="text-center p-2 bg-amber-50 rounded-xl">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">G</p>
                          <p className="text-sm font-bold text-amber-500">{r.macros.fats}g</p>
                        </div>
                      </div>
                      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-rose-100 text-rose-400 font-bold hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all active:scale-95">
                        Ver Receita <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shopping' && (
              <div className="max-w-3xl mx-auto glass rounded-[2.5rem] p-10 shadow-soft border border-white animate-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border-b border-rose-100 pb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Lista de Compras</h3>
                    <p className="text-slate-500 text-sm">Tudo o que você precisa para a semana 01</p>
                  </div>
                  <button className="bg-slate-800 text-white px-8 py-3 rounded-2xl flex items-center gap-3 hover:bg-slate-700 transition-all shadow-lg active:scale-95">
                    <Download size={18} /> Baixar PDF
                  </button>
                </div>
                <div className="space-y-10">
                  {['Proteínas', 'Carboidratos', 'Vegetais', 'Gorduras'].map((cat) => (
                    <div key={cat}>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-6 h-[1px] bg-slate-300"></div> {cat}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SHOPPING_LIST.filter(item => item.category === cat).map((item) => (
                          <div key={item.id} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${item.checked ? 'bg-rose-400 border-rose-400 text-white' : 'border-rose-100 bg-white group-hover:border-rose-300'}`}>
                              {item.checked && <CheckCircle2 size={14} />}
                            </div>
                            <span className={`text-sm font-medium ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pdfs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                {[1, 2, 3, 4].map((week) => (
                  <div key={week} className="glass rounded-[2.5rem] p-8 flex items-center gap-6 group hover:shadow-3d hover:translate-y-[-4px] transition-all duration-500 border border-white">
                    <div className="w-20 h-24 bg-rose-100 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 transition-colors shrink-0">
                      <FileText className="text-rose-400 group-hover:text-white transition-colors" size={32} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-800 mb-1">Guia Completo - Semana 0{week}</h4>
                      <p className="text-slate-500 text-xs mb-4 italic">Inclui cardápio, macros e lista de substituições.</p>
                      <div className="flex gap-3">
                        <button className="bg-rose-50 text-rose-500 text-xs font-bold px-4 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 shadow-sm active:scale-95">
                          <Download size={14} /> Download
                        </button>
                        <button className="text-slate-400 text-xs font-bold px-4 py-2 hover:text-slate-600 transition-colors">
                          Visualizar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Chatbot userName={user.name} />
    </div>
  );
};

export default App;
