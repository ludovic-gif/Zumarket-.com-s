import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  MessageCircle,
  Sparkles,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export const ChatDrawer: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    activeChatId,
    setActiveChatId,
    conversations,
    messages,
    sendMessage,
    currentUser,
    products,
    generateWhatsAppLink,
    setSelectedProductId,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [showConversationListMobile, setShowConversationListMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtrer les conversations pour l'utilisateur actuel
  const userConversations = conversations.filter((c) => {
    if (!currentUser) return false;
    return c.buyerId === currentUser.id || c.sellerId === currentUser.id;
  });

  const activeConversation =
    conversations.find((c) => c.id === activeChatId) || userConversations[0] || conversations[0];

  const conversationMessages = activeConversation
    ? messages.filter((m) => m.conversationId === activeConversation.id)
    : [];

  const activeProduct = activeConversation?.productId
    ? products.find((p) => p.id === activeConversation.productId)
    : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;
    sendMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!activeConversation) return;
    sendMessage(activeConversation.id, prompt);
  };

  const quickPrompts = [
    'Cet article est-il disponible actuellement ?',
    'Pouvez-vous expédier en express dans ma ville ?',
    'Le prix est-il négociable ?',
    'Avez-vous d’autres tailles ou coloris ?',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsChatOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col sm:flex-row overflow-hidden">
          {/* Panneau gauche : Liste des conversations */}
          <div
            className={`w-full sm:w-72 bg-neutral-50 border-r border-neutral-200 flex flex-col ${
              !showConversationListMobile && activeConversation ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-neutral-900" />
                <h3 className="text-sm font-bold text-neutral-900">Messagerie directe</h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="sm:hidden p-1.5 text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {userConversations.length === 0 ? (
                <div className="text-center py-10 px-4 text-xs text-neutral-400">
                  Aucune conversation pour le moment. Ouvrez un article et cliquez sur « Discuter » pour contacter le créateur.
                </div>
              ) : (
                userConversations.map((conv) => {
                  const isBuyer = currentUser?.id === conv.buyerId;
                  const otherPartyName = isBuyer ? conv.sellerName : conv.buyerName;
                  const otherPartyAvatar = isBuyer ? conv.sellerAvatar : conv.buyerAvatar;
                  const isSelected = activeConversation?.id === conv.id;
                  const unread = isBuyer ? conv.unreadBuyerCount : conv.unreadSellerCount;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setActiveChatId(conv.id);
                        setShowConversationListMobile(false);
                      }}
                      className={`w-full p-3 rounded-xl text-left transition flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-white shadow-sm border border-neutral-200/90'
                          : 'hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <img
                        src={otherPartyAvatar}
                        alt={otherPartyName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {otherPartyName}
                          </span>
                          <span className="text-[10px] text-neutral-400 shrink-0">
                            {conv.lastTimestamp}
                          </span>
                        </div>
                        {conv.productTitle && (
                          <span className="text-[10px] font-semibold text-amber-700 block truncate">
                            {conv.productTitle}
                          </span>
                        )}
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>

                      {unread > 0 && (
                        <span className="w-4 h-4 bg-amber-500 text-neutral-950 font-black text-[10px] rounded-full flex items-center justify-center shrink-0">
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Panneau droit : Fil de discussion actif */}
          {activeConversation ? (
            <div
              className={`flex-1 flex flex-col bg-white ${
                showConversationListMobile ? 'hidden sm:flex' : 'flex'
              }`}
            >
              {/* En-tête de la discussion active */}
              <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowConversationListMobile(true)}
                    className="sm:hidden p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={
                      currentUser?.id === activeConversation.buyerId
                        ? activeConversation.sellerAvatar
                        : activeConversation.buyerAvatar
                    }
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                  />

                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      {currentUser?.id === activeConversation.buyerId
                        ? activeConversation.sellerName
                        : activeConversation.buyerName}
                    </h4>
                    <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Discussion en direct active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Bascule rapide vers WhatsApp */}
                  {activeProduct && (
                    <button
                      onClick={() => {
                        const link = generateWhatsAppLink(activeProduct);
                        window.open(link, '_blank', 'noopener,noreferrer');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition cursor-pointer"
                      title="Basculer sur WhatsApp"
                    >
                      <Send className="w-3 h-3 rotate-45 text-emerald-600" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                  )}

                  <button
                    id="close-chat-drawer-btn"
                    onClick={() => setIsChatOpen(false)}
                    className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contexte du produit épinglé */}
              {activeProduct && (
                <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeProduct.images[0]}
                      alt={activeProduct.title}
                      className="w-10 h-10 rounded-lg object-cover border border-amber-200 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                        Échange au sujet de
                      </span>
                      <p className="text-xs font-bold text-neutral-900 line-clamp-1">
                        {activeProduct.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-neutral-900">
                      {formatPrice(activeProduct.price)}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedProductId(activeProduct.id);
                      }}
                      className="px-2 py-0.5 text-[11px] font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md transition cursor-pointer"
                    >
                      Voir
                    </button>
                  </div>
                </div>
              )}

              {/* Zone de défilement des messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/30">
                {conversationMessages.length === 0 ? (
                  <div className="text-center py-10 text-xs text-neutral-400">
                    Envoyez un message pour démarrer la discussion avec ce vendeur.
                  </div>
                ) : (
                  conversationMessages.map((msg) => {
                    const isSelf = msg.senderId === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                            isSelf
                              ? 'bg-neutral-950 text-white rounded-tr-none'
                              : 'bg-white text-neutral-900 border border-neutral-200 rounded-tl-none'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-1 px-1 flex items-center gap-1">
                          {msg.timestamp}
                          {isSelf && <CheckCheck className="w-3 h-3 text-neutral-400" />}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions rapides de messages */}
              <div className="px-4 py-2 bg-white border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-2.5 py-1 text-[11px] whitespace-nowrap rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Barre de saisie du message */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
                <input
                  id="chat-message-input"
                  type="text"
                  placeholder="Écrivez votre message ou votre question..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs bg-neutral-100 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <button
                  id="chat-send-btn"
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 disabled:opacity-40 transition shadow-sm cursor-pointer"
                  title="Envoyer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-neutral-400 text-xs">
              Sélectionnez une discussion ou contactez un vendeur depuis un article.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
