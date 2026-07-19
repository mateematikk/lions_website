import { loadEnvConfig } from "@next/env";
import { initializeWorkbook } from "../sheets";
import { setWebhook } from "../telegram";
import { requireEnv } from "../config";

loadEnvConfig(process.cwd());

async function main() {
  const productionUrl = process.argv[2] ?? process.env.BOT_PUBLIC_URL;
  if (!productionUrl) {
    throw new Error(
      "Передайте URL сайту: npm run bot:setup -- https://your-site.vercel.app"
    );
  }

  const baseUrl = productionUrl.replace(/\/+$/, "");
  const webhookUrl = `${baseUrl}/api/telegram/webhook`;
  const secret = requireEnv("TELEGRAM_WEBHOOK_SECRET");

  console.log("Перевіряю структуру Google Sheets...");
  await initializeWorkbook();

  console.log(`Реєструю webhook: ${webhookUrl}`);
  await setWebhook(webhookUrl, secret);

  console.log("Готово. Відкрийте бота в Telegram і надішліть /start.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
