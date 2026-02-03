import { useChat } from "@/hooks/useChat";

const CHAT_PANEL_CLASS =
  "w-[390px] h-[560px] rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col";
const CHAT_INPUT_CLASS =
  "flex-1 px-3 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-lime/50";
const CHAT_BTN_CLASS =
  "px-3 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 text-xs hover:border-lime/40 text-white";
const CHAT_BTN_PRIMARY_CLASS =
  "px-4 py-2 rounded-lg backdrop-blur-xl bg-lime/20 border border-lime/30 hover:bg-lime/30 text-white";

export default function ChatWidget() {
  const {
    open,
    setOpen,
    role,
    roleSelected,
    avatarState,
    menu,
    messages,
    messagesEndRef,
    input,
    setInput,
    leadOpen,
    setLeadOpen,
    leadName,
    setLeadName,
    leadContact,
    setLeadContact,
    leadCity,
    setLeadCity,
    sendingLead,
    getAvatarPath,
    showTechSpecSummary,
    selectRole,
    selectMenu,
    goBack,
    sendMessage,
    sendLeadToManager,
    quickChips,
    applyChip,
  } = useChat();

  if (!open) {
    return (
      <div className="fixed right-5 bottom-5 z-[99999]">
        <button
          onClick={() => setOpen(true)}
          data-testid="chat-open"
          className="px-4 py-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:border-lime/50 transition-all"
        >
          💬 Чат
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-5 bottom-5 z-[99999]">
      <div className={CHAT_PANEL_CLASS}>
        <div className="px-4 py-3 backdrop-blur-xl bg-white/5 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={getAvatarPath(role, avatarState)}
              className="w-10 h-10 rounded-full border border-white/20 object-cover"
              alt="avatar"
            />
            <div className="font-semibold text-white">
              AI ассистент РУС-ИНДУСТРИИ
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {!roleSelected && (
          <div className="p-4 flex flex-col gap-2 border-b border-white/10">
            <button
              onClick={() => selectRole("engineer")}
              className={CHAT_BTN_CLASS}
            >
              🧠 Инженер
            </button>
            <button
              onClick={() => selectRole("tech")}
              className={CHAT_BTN_CLASS}
            >
              🛠️ Техподдержка
            </button>
            <button
              onClick={() => selectRole("consultant")}
              className={CHAT_BTN_CLASS}
            >
              💼 Консультант
            </button>
          </div>
        )}

        {roleSelected && menu === "root" && (
          <div className="px-4 py-2 flex gap-2 flex-wrap border-b border-white/10 text-sm text-white/90">
            <button onClick={() => selectMenu("equipment")}>
              🏭 Оборудование
            </button>
            <button onClick={() => selectMenu("software")}>
              💻 ПО / MES / ERP
            </button>
            <button onClick={() => selectMenu("service")}>🛠️ Авария</button>
            <button onClick={() => selectMenu("design")}>
              🏗️ Проектирование
            </button>
          </div>
        )}

        {roleSelected && menu === "equipment" && (
          <div className="px-4 py-2 flex gap-2 flex-wrap border-b border-white/10 text-sm text-white/90">
            <button onClick={() => selectMenu("equipment_marking")}>
              🔖 Маркировка
            </button>
            <button onClick={() => selectMenu("equipment_weight")}>
              ⚖️ Весы
            </button>
            <button onClick={() => selectMenu("equipment_packaging")}>
              📦 Упаковка
            </button>
            <button onClick={goBack}>← Назад</button>
          </div>
        )}

        <div
          data-testid="chat-messages"
          className="flex-1 px-4 py-3 overflow-y-auto text-sm text-white/90"
        >
          {messages.map((m) => (
            <div key={m.id} className="mb-3">
              <span className="font-semibold text-lime">{m.role}:</span>{" "}
              <span className="whitespace-pre-line">{m.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {roleSelected && quickChips.length > 0 && (
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {quickChips.map((c) => (
              <button
                key={c}
                onClick={() => applyChip(c)}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 hover:border-lime/40"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="px-4 py-3 border-t border-white/10 flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={showTechSpecSummary}
              className={CHAT_BTN_CLASS}
            >
              📋 ТЗ
            </button>
            <button
              onClick={() => setLeadOpen((v) => !v)}
              className={CHAT_BTN_CLASS}
            >
              📨 Менеджеру
            </button>
          </div>

          {leadOpen && (
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
              <div className="mb-2 text-white/80">
                Оставьте контакт — менеджер быстро ответит и пришлёт
                расчёт/КП.
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Имя"
                  className={CHAT_INPUT_CLASS}
                />
                <input
                  value={leadCity}
                  onChange={(e) => setLeadCity(e.target.value)}
                  placeholder="Город"
                  className={CHAT_INPUT_CLASS}
                />
              </div>
              <div className="flex gap-2">
                <input
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                  placeholder="Телефон / Email / Telegram"
                  className={CHAT_INPUT_CLASS}
                />
                <button
                  disabled={sendingLead || !leadContact.trim()}
                  onClick={sendLeadToManager}
                  className="px-3 py-2 rounded-lg bg-lime/20 border border-lime/30 hover:bg-lime/30 disabled:opacity-50 text-white"
                >
                  {sendingLead ? "..." : "Отправить"}
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Если коротко — в чём задача?"
              data-testid="chat-input"
              className={CHAT_INPUT_CLASS}
            />
            <button
              onClick={() => sendMessage()}
              data-testid="chat-send"
              className={CHAT_BTN_PRIMARY_CLASS}
            >
              Отпр.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
