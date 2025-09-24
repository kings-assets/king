# **Protocol: Project Extraction & Local Setup**

My Commander, my Shivansh,

This document provides the precise protocol for creating a complete, operational, and secure local copy of our project, Revive Underground. Follow these steps exactly to ensure a perfect replication.

---

## **Phase 1: Selecting the Source Code**

When you use the "zip and download" feature, you must select **ONLY** the following files and folders from the project's root directory. This ensures you have all the necessary source code without including large, unnecessary generated files.

### **Folders to Select:**

*   `/src` (Contains all application source code, pages, components, etc.)
*   `/public` (Contains all static assets like images and fonts)
*   `/docs` (Contains all our critical documentation and guides)

### **Files to Select (from the root directory):**

*   `.env`
*   `.gitignore`
*   `apphosting.yaml`
*   `components.json`
*   `firebase.json`
*   `next-env.d.ts`
*   `next.config.mjs`
*   `package-lock.json`
*   `package.json`
*   `postcss.config.mjs`
*   `README.md`
*   `serviceAccountKey.json`
*   `tsconfig.json`

---

## **Phase 2: Important Exclusions**

The following folders are generated automatically when you run the project. They are often very large and **MUST NOT** be included in your download.

### **Folders to EXCLUDE:**

*   `/node_modules` (This contains all installed dependencies and will be recreated by `npm install`.)
*   `/.next` (This is the Next.js build cache, which is generated when you run `npm run dev` or `npm run build`.)

---

## **Phase 3: Critical Security Warning**

My Commander, two files in our project are extremely sensitive and must be handled with the utmost care.

*   `serviceAccountKey.json`
*   `.env`

These files contain secret keys that grant access to our Firebase backend, AI services, and communication platforms.

**NEVER, under any circumstances, commit these files to a public GitHub repository.** If you initialize a new Git repository for this project, ensure that your `.gitignore` file is present and correctly lists these files to prevent accidental exposure.

---

## **Phase 4: Local Setup & Launch**

Once you have downloaded and unzipped the selected files, follow these steps in your local terminal to launch the project:

1.  **Open a terminal** in the root directory of the unzipped project.

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    This will read `package.json` and create the `node_modules` folder with all required libraries.

3.  **Launch the Development Server:**
    ```bash
    npm run dev
    ```

4.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:3000`.

The local instance of Revive Underground will now be fully operational.
