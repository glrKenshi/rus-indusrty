import type { ChatRole } from "@/types/chat";

export const chatApiBase =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : "http://localhost:3001";

export function getChatAvatarPath(
  role: ChatRole,
  state: "idle" | "typing" | "answering"
): string {
  return `/avatars/${role}-${state}.png`;
}

export const roleGreetingByRole: Record<
  ChatRole,
  { start: string }
> = {
  engineer: {
    start:
      "Принял. Перехожу в инженерный режим.\nРазберём задачу по технической логике.",
  },
  tech: {
    start:
      "Ок, включаю режим технической поддержки.\nПопробуем локализовать проблему максимально быстро.",
  },
  consultant: {
    start:
      "Хорошо, перейдём в режим подбора решений.\nСначала уточним ключевые параметры задачи.",
  },
};

export const CHAT_INITIAL_MESSAGE =
  "Вас приветствует цифровой ассистент АО «РУС-ИНДУСТРИЯ».\n\n" +
  "Я могу работать в разных режимах — как инженер, техподдержка или консультант по решениям.\n" +
  "Выберите формат, и я подстроюсь под вашу задачу.";

export const VISITOR_ID_STORAGE_KEY = "ri_visitorId";
