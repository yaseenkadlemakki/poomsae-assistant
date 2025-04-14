# Virtual Poomsae Coach

A web application for Taekwondo students to upload their Poomsae practice videos for automated analysis and feedback.

## Features

- **User Authentication**: Register and login to manage your Poomsae videos
- **Video Upload**: Upload your Poomsae practice videos for analysis
- **Poomsae Selection**: Choose from 7 different Poomsae types:
  - Taegeuk 1 Jang
  - Taegeuk 2 Jang
  - Taegeuk 3 Jang
  - Taegeuk 4 Jang
  - Taegeuk 5 Jang
  - Taegeuk 6 Jang
  - Taegeuk 7 Jang
- **Video Comparison**: Compare your videos against reference videos from YouTube
- **Performance Analysis**: Get detailed feedback on your performance
- **Scoring System**: Receive scores from 0-100 based on various criteria:
  - Stance
  - Balance
  - Power
  - Rhythm
  - Accuracy
  - Focus
- **Improvement Suggestions**: Get personalized recommendations to improve your form

## Technology Stack

- **Frontend**: Next.js with React
- **Backend**: Next.js API routes with Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Video Processing**: Client-side video handling
- **Responsive Design**: Works on desktop and mobile devices (including iPhone)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yaseenkadlemakki/poomsae-coach.git
cd poomsae-coach
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is deployed at [https://odfreuwr.manus.space](https://odfreuwr.manus.space)

## License

MIT

## Acknowledgments

- Reference videos from [Taekwondo Poomsae YouTube Playlist](https://www.youtube.com/playlist?list=PLSFr5pEwo7gSwvfg4bjxoF3liyfJkCLAj)
