
# **Protocol: The Genesis Deployment**

My Commander, my Shivansh,

This document contains the precise protocol for deploying our creation, Revive Underground, to a live, global production environment. We will use **Vercel**, the optimal platform for Next.js applications, as the primary example, but the principles apply to any modern hosting provider like your Hostinger VPS.

**Your mission is to establish our permanent fortress in the cloud.** Follow these steps with 100% fidelity.

---

### **Phase 1: Secure Your Codebase on GitHub**

Your code must live in a secure, version-controlled location before it can be deployed.

1.  **Create a GitHub Repository:**
    *   Go to [GitHub](https://github.com/new).
    *   Create a new repository. A good name would be `revive-underground`.
    *   **CRITICAL:** Make the repository **Private**. Our codebase is proprietary and must be protected.

2.  **Push Your Code from Firebase Studio:**
    *   In your local Firebase Studio terminal, initialize Git and push your project to the repository you just created.
    *   Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username and `YOUR_REPOSITORY_NAME` with the name you chose (e.g., `revive-underground`).

    ```bash
    git init -b main
    git add .
    git commit -m "Genesis Commit: Initializing Revive Underground"
    git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
    git push -u origin main
    ```

---

### **Phase 2: Forge the Deployment Fortress (Vercel Example)**

Vercel is the easiest way to deploy a Next.js app, but you can adapt these principles for Hostinger using Docker as we previously discussed.

1.  **Sign Up & Connect:**
    *   Go to [Vercel](https://vercel.com) and sign up using your GitHub account.
    *   From your Vercel dashboard, click "**Add New...**" -> "**Project**".

2.  **Import Your Repository:**
    *   Vercel will show a list of your GitHub repositories. Find your new private repository and click "**Import**".

3.  **Configure the Project:**
    *   Vercel will automatically detect that this is a Next.js project. The default settings are perfect. **You do not need to change them.**
    *   The most critical step is next: configuring our secrets.

---

### **Phase 3: The Secret Vault - Environment Variables**

This is the most important phase. You must transfer our secret keys from your local `.env` file to your hosting provider's secure vault. This is how the live application connects to our AI, database, and notification services.

1.  **Locate Environment Variable Settings:**
    *   In Vercel, this is in the Project Settings under "**Environment Variables**". On Hostinger, you would supply these to your Docker container.

2.  **Add Each Secret:**
    *   You will now add each key-value pair from your `.env` file one by one.

    | Key                               | Value From                                                                                             |
    | --------------------------------- | ------------------------------------------------------------------------------------------------------ |
    | `GOOGLE_API_KEY`                  | Your Google AI Studio API key.                                                                         |
    | `TAVILY_API_KEY`                  | Your Tavily Search API key.                                                                            |
    | `TELEGRAM_BOT_TOKEN`              | The token for your Telegram bot.                                                                       |
    | `TELEGRAM_CHAT_ID`                | The chat ID for your Telegram notifications.                                                           |
    | `TWILIO_ACCOUNT_SID`              | Your Twilio Account SID.                                                                               |
    | `TWILIO_AUTH_TOKEN`               | Your Twilio Auth Token.                                                                                |
    | `TWILIO_PHONE_NUMBER`             | Your Twilio phone number.                                                                              |
    | `BUSINESS_OWNER_PHONE_NUMBER`     | Your personal phone number for receiving admin alerts via SMS.                                         |
    | `NEXT_PUBLIC_BASE_URL`            | The final URL of your live website (e.g., `https://your-domain.com`).                                   |

3.  **The Master Key (`FIREBASE_SERVICE_ACCOUNT_JSON`):**
    *   This is our most sensitive key. It must be handled with care.
    *   **Action 1:** Open the `serviceAccountKey.json` file in your editor.
    *   **Action 2:** Select **ALL** the text in the file and copy it.
    *   **Action 3:** In your hosting provider's secrets manager, create a new variable with the key `FIREBASE_SERVICE_ACCOUNT_JSON`.
    *   **Action 4:** Paste the entire contents of the JSON file into the value field. It will be a long, multi-line string. Your host will handle it correctly.

---

### **Phase 4: Deploy**

1.  **Initiate Deployment:**
    *   With all environment variables added, click the "**Deploy**" button on Vercel, or run your `docker compose up -d --build` command on Hostinger.

2.  **Triumph:**
    *   The hosting service will now build and deploy our application. This may take a few minutes.
    *   Once complete, you will be given a live URL. Revive Underground is now online.

This protocol ensures a secure, successful launch. Execute it precisely.
