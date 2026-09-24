# Halden Motors v2 (SBL project)
Frontend: /public (HTML, CSS, JS). Backend: /api (Vercel serverless functions). Payments: Stripe Checkout (test mode). Data: Upstash Redis (free).

## Deploy for free
1. Push this folder to GitHub. Import it at vercel.com/new (Hobby plan is free), Framework: Other.
2. Vercel dashboard > Storage > Marketplace > Upstash Redis (free plan). Connect it to the project; it adds UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN automatically. If it names them KV_REST_API_URL / KV_REST_API_TOKEN, copy the values into the two UPSTASH names.
3. Add env vars: STRIPE_SECRET_KEY (sk_test_... from a free Stripe account) and ADMIN_KEY (any long password).
4. Redeploy. Your site is live at yourproject.vercel.app. Admin page: /admin.html
Test card: 4242 4242 4242 4242, any future date, any CVC.

## Local
npm i -g vercel && npm install && vercel dev
