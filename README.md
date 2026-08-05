# لوحة تحكم شبكة يوتيوب

نظام لإدارة أرباح وإحصائيات قنوات شبكة يوتيوب، مبني بـ Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma + SQLite, و NextAuth.

## التشغيل

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## حسابات افتراضية

| الدور | اسم المستخدم | كلمة المرور |
| --- | --- | --- |
| مدير | `admin` | `Yt@2026Pass` |
| صانع محتوى | `user1` | `Yt@2026Pass` |
| صانع محتوى | `user2` | `Yt@2026Pass` |
| صانع محتوى | `user3` | `Yt@2026Pass` |

غيّر كلمة المرور الافتراضية من صفحة "إعدادات الملف الشخصي" بعد أول تسجيل دخول.

## أوامر مفيدة

- `npm run db:studio` — فتح Prisma Studio لتصفح قاعدة البيانات.
- `npm run db:migrate` — إنشاء/تطبيق migration جديد بعد تعديل `prisma/schema.prisma`.
- `npm run db:seed` — إعادة تشغيل بيانات البذر (idempotent، لا يكرر المستخدمين الموجودين).

## قاعدة البيانات

SQLite عبر Prisma driver adapters (`@prisma/adapter-better-sqlite3`). للانتقال إلى PostgreSQL في الإنتاج، بدّل `provider` في `prisma/schema.prisma` واستبدل المُهيّئ (adapter) في `src/lib/prisma.ts` و `prisma/seed.ts` بمُهيّئ Postgres المناسب (مثل `@prisma/adapter-pg`).
