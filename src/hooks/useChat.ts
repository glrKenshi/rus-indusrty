import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type {
  ChatMessage,
  ChatRole,
  ChatTopic,
  MenuLevel,
  TechSpec,
} from "@/types/chat";
import {
  chatApiBase,
  getChatAvatarPath,
  roleGreetingByRole,
  CHAT_INITIAL_MESSAGE,
  VISITOR_ID_STORAGE_KEY,
} from "@/config/chat";
import {
  clamp,
  getOfflineReply,
  extractTechSpecFromText,
  formatTechSpecSummary,
  buildNextQuestions,
  isSpecReadyForLead,
} from "@/lib/chat";
import { randomId } from "@/lib/utils";

const ROOT_MENU_MESSAGE =
  "Выберите направление — так я быстрее дам точный ответ:";

const MENU_MESSAGES: Record<string, string> = {
  equipment: "🏭 Оборудование:\n• Маркировка\n• Весы\n• Упаковка",
  software: "💻 IT/ПО:\n• MES\n• WMS\n• ERP\n• Интеграции",
  service: "🛠️ Авария/техподдержка.\nЧто перестало работать?",
  design: "🏗️ Проектирование.\nОпишите задачу и масштабы.",
  equipment_marking:
    "🔖 Маркировка. Скажите: продукт, скорость линии и формат упаковки.",
  equipment_weight:
    "⚖️ Весы/чеквейер. Скажите диапазон веса и требуемую точность.",
  equipment_packaging:
    "📦 Упаковка. Скажите продукт, формат упаковки и производительность.",
};

function buildQuickChips(
  topic: ChatTopic,
  techSpec: TechSpec,
  menu: MenuLevel
): string[] {
  const chips: string[] = [];
  if (topic === "software" && techSpec.erpExists === undefined)
    chips.push("ERP есть", "ERP нет");
  if (
    techSpec.mes === undefined &&
    (topic === "equipment" || topic === "software")
  )
    chips.push("MES да", "MES нет");
  if (techSpec.marking === undefined && topic === "equipment")
    chips.push("Маркировка да", "Маркировка нет");
  if (topic === "equipment" && !techSpec.equipmentType)
    chips.push("Маркировка", "Весы", "Упаковка");
  if (
    (menu === "equipment_marking" || techSpec.equipmentType === "маркировка") &&
    !techSpec.packaging
  )
    chips.push("Лоток", "Вакуум", "Flow-pack", "Термоформ");
  if (topic === "service") chips.push("Есть код ошибки", "Кода ошибки нет");
  return chips.slice(0, 6);
}

export function useChat() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<ChatRole>("engineer");
  const [roleSelected, setRoleSelected] = useState(false);
  const [avatarState, setAvatarState] = useState<
    "idle" | "typing" | "answering"
  >("idle");
  const [menu, setMenu] = useState<MenuLevel>("root");
  const [topic, setTopic] = useState<ChatTopic>("unknown");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: randomId(), role: "Ассистент", text: CHAT_INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [techSpec, setTechSpec] = useState<TechSpec>({});
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadCity, setLeadCity] = useState("");
  const [sendingLead, setSendingLead] = useState(false);

  const visitorIdRef = useRef<string>("");
  const sessionIdRef = useRef<string>(randomId());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
      if (saved) visitorIdRef.current = saved;
      else {
        const id = randomId();
        visitorIdRef.current = id;
        localStorage.setItem(VISITOR_ID_STORAGE_KEY, id);
      }
    } catch {
      visitorIdRef.current = randomId();
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((roleName: string, text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: randomId(), role: roleName, text },
    ]);
  }, []);

  const setMessageText = useCallback((id: string, text: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, text } : m))
    );
  }, []);

  const addAssistantTyping = useCallback(
    (
      fullText: string,
      opts?: { speedMs?: number; initialDelayMs?: number }
    ) => {
      const speedMs = clamp(opts?.speedMs ?? 14, 6, 30);
      const initialDelayMs = clamp(opts?.initialDelayMs ?? 120, 0, 800);
      const id = randomId();
      setMessages((prev) => [...prev, { id, role: "Ассистент", text: "" }]);
      setAvatarState("answering");
      let i = 0;
      const start = () => {
        const timer = window.setInterval(() => {
          i += 1;
          setMessageText(id, fullText.slice(0, i));
          if (i >= fullText.length) {
            window.clearInterval(timer);
            window.setTimeout(() => setAvatarState("idle"), 220);
          }
        }, speedMs);
      };
      window.setTimeout(start, initialDelayMs);
    },
    [setMessageText]
  );

  const updateTechSpecFromText = useCallback((text: string) => {
    setTechSpec((prev) => extractTechSpecFromText(text, prev));
  }, []);

  const showTechSpecSummary = useCallback(() => {
    const summary = formatTechSpecSummary(techSpec);
    addAssistantTyping(
      `📋 Я собрал предварительное ТЗ:\n\n${summary}\n\nХотите, отправлю менеджеру? Нажмите "📨 Менеджеру".`
    );
  }, [techSpec, addAssistantTyping]);

  const checkContext = useCallback(async () => {
    try {
      if (!visitorIdRef.current) return;
      const res = await fetch(
        `${chatApiBase}/api/context?visitorId=${encodeURIComponent(visitorIdRef.current)}`
      );
      const data = await res.json();
      if (data?.found && data?.message) addAssistantTyping(data.message);
    } catch {
      // ignore
    }
  }, [addAssistantTyping]);

  useEffect(() => {
    if (!open) return;
    checkContext();
  }, [open, checkContext]);

  const showRootMenu = useCallback(
    (animate: boolean) => {
      setMenu("root");
      setTopic("unknown");
      if (animate) addAssistantTyping(ROOT_MENU_MESSAGE);
      else addMessage("Ассистент", ROOT_MENU_MESSAGE);
    },
    [addMessage, addAssistantTyping]
  );

  const selectRole = useCallback(
    (r: ChatRole) => {
      setRole(r);
      setAvatarState("idle");
      setRoleSelected(true);
      addAssistantTyping(roleGreetingByRole[r].start);
      showRootMenu(true);
    },
    [addAssistantTyping, showRootMenu]
  );

  const selectMenu = useCallback(
    (level: MenuLevel) => {
      setMenu(level);
      if (level === "equipment") setTopic("equipment");
      if (level === "software") setTopic("software");
      if (level === "service") setTopic("service");
      if (level === "design") setTopic("design");
      const msg = MENU_MESSAGES[level];
      if (msg) addAssistantTyping(msg);
      if (level === "equipment_marking") {
        setTopic("equipment");
        setTechSpec((p) => ({ ...p, equipmentType: "маркировка" }));
      }
      if (level === "equipment_weight") {
        setTopic("equipment");
        setTechSpec((p) => ({ ...p, equipmentType: "весовое оборудование" }));
      }
      if (level === "equipment_packaging") {
        setTopic("equipment");
        setTechSpec((p) => ({ ...p, equipmentType: "упаковка" }));
      }
    },
    [addAssistantTyping]
  );

  const goBack = useCallback(() => {
    if (menu.startsWith("equipment_")) {
      setMenu("equipment");
      addAssistantTyping("Ок, возвращаемся к разделу оборудования.");
    } else {
      showRootMenu(true);
    }
  }, [menu, addAssistantTyping, showRootMenu]);

  const buildTranscript = useCallback(
    (limit = 25) =>
      messages
        .slice(-limit)
        .map((m) => `${m.role}: ${m.text}`)
        .join("\n\n"),
    [messages]
  );

  const sendLeadToManager = useCallback(async () => {
    setSendingLead(true);
    try {
      const res = await fetch(`${chatApiBase}/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          role,
          menu,
          topic,
          name: leadName,
          contact: leadContact,
          city: leadCity,
          techSpec,
          transcript: buildTranscript(25),
        }),
      });
      const data = await res.json();
      if (data?.ok) {
        addAssistantTyping(
          "✅ Принял. Я отправил менеджеру ваше ТЗ и контекст.\nЕсли хотите — продолжим уточнять детали, чтобы ускорить расчёт."
        );
      } else {
        addAssistantTyping(
          "⚠️ Не получилось отправить менеджеру. Попробуйте ещё раз."
        );
      }
      setLeadOpen(false);
      setLeadName("");
      setLeadContact("");
      setLeadCity("");
    } catch {
      addAssistantTyping(
        "⚠️ Сервер недоступен. Запустите backend и попробуйте снова."
      );
    } finally {
      setSendingLead(false);
    }
  }, [
    role,
    menu,
    topic,
    leadName,
    leadContact,
    leadCity,
    techSpec,
    buildTranscript,
    addAssistantTyping,
  ]);

  const sendMessage = useCallback(
    async (forcedText?: string) => {
      const text = (forcedText ?? input).trim();
      if (!text) return;
      addMessage("Вы", text);
      updateTechSpecFromText(text);
      setInput("");
      setAvatarState("typing");
      const nextQ = buildNextQuestions(techSpec, topic, menu);
      const tzReady = isSpecReadyForLead(techSpec, topic);
      try {
        const res = await fetch(`${chatApiBase}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            role,
            visitorId: visitorIdRef.current,
            sessionId: sessionIdRef.current,
            menu,
            topic,
            techSpec,
          }),
        });
        const data = await res.json();
        setAvatarState("answering");
        addAssistantTyping(data.reply || getOfflineReply(text, role));
        const questions: string[] = Array.isArray(data?.nextQuestions)
          ? data.nextQuestions
          : nextQ;
        if (questions.length) {
          setTimeout(
            () =>
              addAssistantTyping(
                "Чтобы предложить точное решение, уточню:\n• " +
                questions.slice(0, 4).join("\n• "),
                { speedMs: 11, initialDelayMs: 120 }
              ),
            600
          );
        }
        const ready = data?.tzReady ?? tzReady;
        if (ready) {
          setTimeout(
            () =>
              addAssistantTyping(
                "Я уже собрал основу ТЗ. Нажмите «📋 ТЗ» — покажу, и «📨 Менеджеру» — отправлю."
              ),
            1100
          );
        }
      } catch {
        setAvatarState("idle");
        addAssistantTyping(
          "⚠️ Сейчас я работаю в автономном режиме.\n\n" + getOfflineReply(text, role)
        );
        if (nextQ.length) {
          setTimeout(
            () =>
              addAssistantTyping(
                "Чтобы предложить точное решение, уточню:\n• " +
                nextQ.slice(0, 4).join("\n• ")
              ),
            700
          );
        }
        if (tzReady) {
          setTimeout(
            () =>
              addAssistantTyping(
                "Я уже собрал основу ТЗ. Нажмите «📋 ТЗ» — покажу, и «📨 Менеджеру» — отправлю."
              ),
            1200
          );
        }
      }
    },
    [
      input,
      techSpec,
      topic,
      menu,
      role,
      addMessage,
      updateTechSpecFromText,
      addAssistantTyping,
    ]
  );

  const quickChips = useMemo(
    () => buildQuickChips(topic, techSpec, menu),
    [topic, techSpec, menu]
  );

  const applyChip = useCallback(
    (chip: string) => {
      setInput(chip);
      setTimeout(() => sendMessage(chip), 0);
    },
    [sendMessage]
  );

  return {
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
    addMessage,
    addAssistantTyping,
    getAvatarPath: getChatAvatarPath,
    updateTechSpecFromText,
    showTechSpecSummary,
    selectRole,
    selectMenu,
    showRootMenu,
    goBack,
    sendMessage,
    sendLeadToManager,
    quickChips,
    applyChip,
  };
}
