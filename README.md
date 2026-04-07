
# SyncIt Client
SyncIt Client is the Next.js-based frontend for the SyncIt application, designed to provide a seamless user experience for managing and syncing liked songs across multiple music platforms, such as Spotify and YouTube. This frontend is under active development and will integrate closely with the powerful SyncIt backend, which handles authentication, API requests, data processing, and synchronization tasks efficiently.

SyncIt waitlist is live! 🚀🎵 Join now: [https://syncit.org.in/](https://syncit.org.in/) 🔥

## 📸 Screenshots

> A glimpse into the SyncIt experience — clean, fast, and built for power users.

<p align="center">
  <img src="assets/screenshots/hero.png" width="800"/>
</p>

<table align="center">
  <tr>
    <td align="center">
      <img src="assets/screenshots/why-syncit.png" width="400"/><br/>
    </td>
    <td align="center">
      <img src="assets/screenshots/how-it-works.png" width="400"/><br/>
    </td>
  </tr>
</table>

<details>
<summary>▶️ View more screens</summary>

<br>
<img src="assets/screenshots/login.png" width="800"/>
<img src="assets/screenshots/dashboard.png" width="800"/>
<img src="assets/screenshots/confirmation.png" width="800"/>
<img src="assets/screenshots/completed.png" width="800"/>
<img src="assets/screenshots/preferences.png" width="800"/>
<img src="assets/screenshots/settings.png" width="800"/>



</details>

## 🚀 Features (Planned & In Development) ✨
- Modern UI/UX: Built with Next.js, Tailwind CSS, and ShadCN, ensuring a clean, responsive, and accessible interface.
- Smooth Animations: Powered by Framer Motion for interactive and dynamic UI elements.
- Cross-Platform Syncing: Interfaces with the SyncIt backend to manage and sync liked songs across different music streaming services.
- Authentication & Authorization: Secure login via OAuth for platforms like Spotify and YouTube.
- Real-Time Updates: Fetch and display live data from the backend.
- Intuitive Dashboard: A user-friendly interface to view, manage, and track synced songs.
- Extendable Architecture: Designed to allow easy integration of additional music platforms in future updates.
## Technologies Used 🛠
SyncIt Client leverages the latest technologies to ensure performance, scalability, and maintainability:
- Framework: Next.js (App Router, Server Components)
- Styling: Tailwind CSS, ShadCN
- Animations: Framer Motion
- Icons: Remix Icons, React Icons
- State Management: React Context API (for managing global state efficiently)
- API Communication: Fetching and managing data from the SyncIt backend via REST APIs.
## 📂 Project Structure

The frontend follows a modular, component-driven architecture using Next.js App Router, with clear separation between UI components, state management (hooks), and API interaction layers.
## 📂 Project Structure

```text
SyncIt-Client/
├── app/                        # Next.js App Router (pages & layouts)
│   ├── auth/                   # Authentication flow
│   ├── connect/                # Platform connection page
│   ├── dashboard/              # Main dashboard UI
│   ├── missing-tracks/         # Tracks that couldn't be matched
│   ├── profile/                # User profile
│   ├── settings/               # User settings
│   ├── sync/                   # Sync workflow pages
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── assets/
│   └── screenshots/            # Images used in README/demo
├── components/
│   ├── ui/                     # Reusable UI primitives (ShadCN)
│   ├── sync/                   # Sync-specific components
│   ├── hero-section.tsx
│   ├── how-it-works-section.tsx
│   ├── why-choose-section.tsx
│   └── ...                     # Dialogs, cards, dashboards, etc.
├── hooks/                      # Custom React hooks (data + state logic)
├── lib/
│   └── utils.ts                # Shared utility helpers
├── utils/
│   └── api.ts                  # API interaction layer
├── public/                     # Static public assets
├── components.json             # ShadCN UI config
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```


## 🛠 Installation & Development

Prerequisites - Ensure you have Node.js (>= 18) installed on your system

Clone the project
```bash
git clone https://github.com/x15sr71/Syncit-Client.git
cd Syncit-Client
```
Install Dependencies
```
npm install 
```
Run the Development Server
```
npm run dev
```
Build for Production
```
npm run build && npm run start
```
    
## 💡 About SyncIt
SyncIt is a next-generation music synchronization platform designed to seamlessly sync playlists and liked songs across multiple streaming services, including Spotify and YouTube Music. It also enables playlist migration, allowing users to transfer their curated collections between platforms effortlessly.

The SyncIt backend, built with Express.js, acts as the powerhouse of the application—handling user authentication, API requests, data processing, and synchronization tasks with efficiency and scalability.

The SyncIt Client (this repository) serves as the primary user interface, providing an intuitive and modern experience for managing synced music.

🚀 Stay tuned for updates as we continue enhancing SyncIt!!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
If you'd like to contribute, feel free to fork the repo and open a pull request.  
You can also open an issue to suggest improvements, report bugs, or propose new features.

Together, let’s make SyncIt even better! 🚀🎵

