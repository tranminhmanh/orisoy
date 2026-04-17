interface TelegramMessageOptions {
  parseMode?: string;
  disablePreview?: boolean;
}

type TelegramAlertType = "rank_change" | "new_publish" | "audit_issue" | "competitor";

function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram bot token or chat ID not configured");
  }

  return { botToken, chatId };
}

export async function sendTelegramMessage(
  message: string,
  options?: TelegramMessageOptions
): Promise<boolean> {
  try {
    const { botToken, chatId } = getTelegramConfig();

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: options?.parseMode ?? "HTML",
          disable_web_page_preview: options?.disablePreview ?? false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Telegram API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("sendTelegramMessage error:", error);
    throw new Error(
      `Failed to send Telegram message: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function sendTelegramAlert(
  type: TelegramAlertType,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    let message: string;

    switch (type) {
      case "rank_change":
        message = formatRankChangeAlert(data);
        break;
      case "new_publish":
        message = formatNewPublishAlert(data);
        break;
      case "audit_issue":
        message = formatAuditIssueAlert(data);
        break;
      case "competitor":
        message = formatCompetitorAlert(data);
        break;
      default:
        message = `<b>Alert:</b> ${JSON.stringify(data)}`;
    }

    return sendTelegramMessage(message, { parseMode: "HTML" });
  } catch (error) {
    console.error("sendTelegramAlert error:", error);
    throw new Error(
      `Failed to send Telegram alert: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

function formatRankChangeAlert(data: Record<string, unknown>): string {
  const keyword = String(data.keyword ?? "Unknown");
  const oldPos = Number(data.oldPosition ?? 0);
  const newPos = Number(data.newPosition ?? 0);
  const domain = String(data.domain ?? "");
  const direction = newPos < oldPos ? "improved" : "dropped";
  const emoji = newPos < oldPos ? "+" : "-";

  return `<b>Rank ${direction === "improved" ? "Improvement" : "Drop"}</b>

<b>Keyword:</b> ${keyword}
<b>Domain:</b> ${domain}
<b>Position:</b> ${oldPos} -> ${newPos} (${emoji}${Math.abs(newPos - oldPos)})`;
}

function formatNewPublishAlert(data: Record<string, unknown>): string {
  const title = String(data.title ?? "Untitled");
  const url = String(data.url ?? "");
  const platform = String(data.platform ?? "WordPress");

  return `<b>New Content Published</b>

<b>Title:</b> ${title}
<b>Platform:</b> ${platform}
<b>URL:</b> ${url}`;
}

function formatAuditIssueAlert(data: Record<string, unknown>): string {
  const severity = String(data.severity ?? "warning");
  const issue = String(data.issue ?? "Unknown issue");
  const domain = String(data.domain ?? "");
  const count = Number(data.count ?? 1);

  return `<b>Site Audit ${severity === "critical" ? "CRITICAL" : "Warning"}</b>

<b>Domain:</b> ${domain}
<b>Issue:</b> ${issue}
<b>Affected pages:</b> ${count}`;
}

function formatCompetitorAlert(data: Record<string, unknown>): string {
  const competitor = String(data.competitor ?? "Unknown");
  const event = String(data.event ?? "activity detected");
  const details = String(data.details ?? "");

  return `<b>Competitor Activity</b>

<b>Competitor:</b> ${competitor}
<b>Event:</b> ${event}
${details ? `<b>Details:</b> ${details}` : ""}`;
}
