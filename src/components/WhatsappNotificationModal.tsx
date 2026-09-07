import React, { useState } from 'react';
import { Member } from '../types';
import { X, Send, MessageCircle, Check, Copy } from 'lucide-react';

interface WhatsappNotificationModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onNotificationSent: (memberId: string) => void;
}

export function WhatsappNotificationModal({
  member,
  isOpen,
  onClose,
  onNotificationSent,
}: WhatsappNotificationModalProps) {
  if (!isOpen || !member) return null;

  const defaultMessage = `Hola ${member.name}! Te escribimos de GymFlow para recordarte que tu cuota de ${member.planName || 'gimnasio'} vence el ${member.membershipExpiry}. Podés renovar por transferencia o en recepción para seguir entrenando sin interrupciones. ¡Te esperamos!`;

  const [message, setMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const cleanPhone = member.phone.replace(/[^0-9]/g, '');

  const handleSendWhatsApp = () => {
    // Format wa.me link
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onNotificationSent(member.id);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1400);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Aviso de Vencimiento</h3>
              <p className="text-xs text-slate-500">Enviar mensaje por WhatsApp a {member.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {sentSuccess ? (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-lg font-bold text-slate-900">¡Notificación Iniciada!</p>
              <p className="text-sm text-slate-500">Se abrió el chat con el socio y se registró el aviso en su historial.</p>
            </div>
          ) : (
            <>
              {/* Member Summary pill */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Socio y teléfono</p>
                  <p className="text-sm font-bold text-slate-900">{member.name} ({member.phone})</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Vencimiento</p>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    {member.membershipExpiry}
                  </span>
                </div>
              </div>

              {/* Message edit area */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Mensaje personalizado
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copiado' : 'Copiar texto'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed transition-all"
                />
              </div>

              {/* Quick Template Switchers */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMessage(`Hola ${member.name}! Tu cuota vence hoy. Te esperamos para renovar!`)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Recordatorio corto
                </button>
                <button
                  type="button"
                  onClick={() => setMessage(defaultMessage)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Mensaje detallado
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Enviar por WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
