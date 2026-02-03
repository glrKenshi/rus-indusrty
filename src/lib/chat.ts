import type { ChatRole, ChatTopic, MenuLevel, TechSpec } from "@/types/chat";

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getOfflineReply(userText: string, role: ChatRole): string {
  const t = userText.toLowerCase();

  if (t.includes("маркиров")) {
    return (
      "Маркировку подбираем под скорость и тип упаковки.\n" +
      "Если скажете продукт + скорость + формат упаковки — я уже смогу дать типовую конфигурацию."
    );
  }

  if (t.includes("вес") || t.includes("чеквейер")) {
    return (
      "Весовое оборудование зависит от диапазона веса и требуемой точности.\n" +
      "Скажите: минимальный/максимальный вес и целевая точность."
    );
  }

  if (t.includes("упаков")) {
    return (
      "Упаковка зависит от продукта и формата.\n" +
      "Скажите: продукт, тип упаковки (лоток/вакуум/flow-pack/термоформ) и производительность."
    );
  }

  if (t.includes("mes") || t.includes("wms") || t.includes("erp")) {
    return (
      "IT-контур строим от текущей архитектуры.\n" +
      "Скажите: есть ли ERP, сколько линий, и нужно ли подключать оборудование (весы/принтеры/сканеры)."
    );
  }

  if (
    t.includes("не работает") ||
    t.includes("ошибка") ||
    t.includes("встала") ||
    t.includes("слом")
  ) {
    return (
      "Похоже на аварийный кейс.\n" +
      "Скажите: что именно остановилось, есть ли код ошибки и что было перед сбоем."
    );
  }

  if (role === "engineer")
    return "Ок. Дайте 2–3 параметра — я соберу конфигурацию.";
  if (role === "consultant")
    return "Ок. Уточним масштабы и сроки — предложу варианты.";
  return "Ок. Давайте быстро уточним симптомы и код ошибки.";
}

export function extractTechSpecFromText(
  text: string,
  prev: TechSpec
): TechSpec {
  const t = text.toLowerCase();
  const updated: TechSpec = { ...prev };

  if (t.includes("мясо")) updated.product = "мясо";
  if (t.includes("рыб")) updated.product = "рыба";
  if (t.includes("сыр")) updated.product = "сыр";
  if (t.includes("птиц") || t.includes("кур")) updated.product = "птица";

  const speedMatch = t.match(
    /(\d+)\s?(уп\/мин|уп\/м|уп в мин|уп\/minute|шт\/мин|шт\/м|pcs\/min|pack\/min)/
  );
  if (speedMatch) updated.speed = speedMatch[0];

  if (t.includes("без маркиров")) updated.marking = false;
  else if (t.includes("маркиров")) updated.marking = true;

  if (t.includes("без mes")) updated.mes = false;
  else if (t.includes("mes")) updated.mes = true;

  if (t.includes("есть erp") || t.includes("erp есть"))
    updated.erpExists = true;
  if (t.includes("без erp") || t.includes("нет erp"))
    updated.erpExists = false;

  const linesMatch = t.match(/(\d+)\s?(линий|линии|line)/);
  if (linesMatch) updated.linesCount = linesMatch[0];

  if (t.includes("лоток") || t.includes("лотков")) updated.packaging = "лоток";
  if (t.includes("вакуум")) updated.packaging = "вакуум";
  if (t.includes("flow")) updated.packaging = "flow-pack";
  if (t.includes("термоформ")) updated.packaging = "термоформование";

  const w = t.match(
    /(\d+(\.\d+)?)\s?(г|кг)\s?(-|до)\s?(\d+(\.\d+)?)\s?(г|кг)/
  );
  if (w) updated.weightRange = w[0];

  if (t.includes("маркиров")) updated.equipmentType = "маркировка";
  if (t.includes("вес") || t.includes("чеквейер"))
    updated.equipmentType = "весовое оборудование";
  if (t.includes("упаков")) updated.equipmentType = "упаковка";

  if (
    t.includes("ошибка") ||
    t.includes("не работает") ||
    t.includes("встала") ||
    t.includes("слом") ||
    t.includes("stop")
  ) {
    updated.problem = text;
  }

  return updated;
}

export function formatTechSpecSummary(spec: TechSpec): string {
  const lines: string[] = [];
  if (spec.product) lines.push(`• продукт: ${spec.product}`);
  if (spec.speed) lines.push(`• скорость: ${spec.speed}`);
  if (spec.equipmentType) lines.push(`• тип: ${spec.equipmentType}`);
  if (spec.packaging) lines.push(`• упаковка: ${spec.packaging}`);
  if (spec.weightRange) lines.push(`• диапазон веса: ${spec.weightRange}`);
  if (spec.linesCount) lines.push(`• линии: ${spec.linesCount}`);
  if (spec.erpExists !== undefined)
    lines.push(`• ERP: ${spec.erpExists ? "есть" : "нет"}`);
  if (spec.marking !== undefined)
    lines.push(`• маркировка: ${spec.marking ? "да" : "нет"}`);
  if (spec.mes !== undefined)
    lines.push(`• интеграция MES: ${spec.mes ? "да" : "нет"}`);
  if (spec.problem) lines.push(`• проблема: ${spec.problem}`);
  return lines.length
    ? lines.join("\n")
    : "Пока мало данных — напишите пару параметров (продукт/скорость/маркировка).";
}

export function buildNextQuestions(
  spec: TechSpec,
  topic: ChatTopic,
  menu: MenuLevel
): string[] {
  const q: string[] = [];

  if (topic === "unknown") {
    q.push(
      "Ок. Это про оборудование, IT/ПО, техподдержку (авария) или проектирование?"
    );
    return q;
  }

  if (topic === "service") {
    if (!spec.problem)
      q.push(
        "Что именно остановилось (линия/весы/принтер/сканер/контроллер)?"
      );
    q.push("Есть код ошибки на экране? (если да — напишите как есть)");
    q.push("Что было перед сбоем: обновление, смена партии, смена настроек?");
    return q.slice(0, 4);
  }

  if (topic === "software") {
    if (spec.erpExists === undefined) q.push("ERP уже есть? (да/нет)");
    if (!spec.linesCount) q.push("Сколько линий/участков нужно подключить?");
    if (spec.mes === undefined)
      q.push(
        "Нужна MES-надстройка (учёт производства в реальном времени)? (да/нет)"
      );
    q.push(
      "Нужно подключать оборудование (весы/маркировка/сканеры) к системе? (да/нет)"
    );
    return q.slice(0, 4);
  }

  if (topic === "design") {
    if (!spec.product) q.push("Какой продукт/категория производства?");
    q.push("Какая целевая производительность (примерно)?");
    q.push("Новая площадка или модернизация существующей?");
    q.push("Какие ограничения: площадь/персонал/бюджет/сроки?");
    return q.slice(0, 4);
  }

  if (topic === "equipment") {
    if (!spec.equipmentType && menu === "equipment")
      q.push("Какой тип оборудования: маркировка / весы / упаковка?");
    if (!spec.product) q.push("Какой продукт (мясо/птица/рыба/сыр/другое)?");
    if (!spec.speed)
      q.push("Скорость/производительность линии? (например 120 уп/мин)");
    if (
      spec.marking === undefined &&
      (spec.equipmentType === "маркировка" || menu === "equipment_marking")
    )
      q.push("Маркировка нужна? (да/нет)");
    if (spec.mes === undefined) q.push("Интеграция с MES/ERP нужна? (да/нет)");

    if (
      (menu === "equipment_marking" || spec.equipmentType === "маркировка") &&
      !spec.packaging
    ) {
      q.push("Какой формат упаковки (лоток/вакуум/flow-pack/термоформ)?");
    }
    if (
      (menu === "equipment_weight" ||
        spec.equipmentType === "весовое оборудование") &&
      !spec.weightRange
    ) {
      q.push(
        "Диапазон веса (пример: 0.2–1.2 кг) и нужна ли контрольная точность?"
      );
    }

    return q.slice(0, 4);
  }

  return q.slice(0, 4);
}

export function isSpecReadyForLead(spec: TechSpec, topic: ChatTopic): boolean {
  if (topic === "service") return !!spec.problem;
  if (topic === "software")
    return spec.erpExists !== undefined && !!spec.linesCount;
  if (topic === "design") return !!spec.product;
  if (topic === "equipment")
    return !!spec.product && !!spec.speed && !!spec.equipmentType;
  return false;
}
