# ScoutChat ✨

A beautiful, educational AI chat platform for children's homework help, built with Next.js and powered by Claude Sonnet 3.5.

## 🎯 Overview

ScoutChat is a beta educational platform designed for parents and educators to test and explore AI-assisted learning. The platform uses the Socratic method to guide students through problem-solving rather than providing direct answers, fostering critical thinking and deep understanding.

## 🌟 Features

### 🔐 Security & Privacy
- **Password Protection**: Parents set their own secure password on first access
- **Privacy Policy**: Clear beta testing guidelines
- **Age-Appropriate Content**: COPPA-compliant approach

### 🎨 Beautiful Design
- **Modern UI**: Inspired by Scout Browser's clean design aesthetic
- **Responsive Layout**: Works perfectly on all devices
- **Smooth Animations**: Elegant transitions and micro-interactions
- **Professional Typography**: Inter font family for optimal readability

### 🧠 Intelligent Education
- **Age-Adaptive AI**: Responses tailored to developmental stages (5-18 years)
- **Socratic Method**: Guides learning through questions, not answers
- **Real-time Chat**: Powered by Claude Sonnet 3.5 for intelligent responses
- **File Upload**: Students can share homework images and documents

### 📚 Learning Resources
- **Example Homework**: 9 sample assignments across 3 difficulty levels
- **Subject Variety**: Math, Science, History, and more
- **Difficulty Badges**: Visual indicators for Elementary, Medium, and Hard levels

### ⚙️ Parent Controls
- **Age Configuration**: Easy slider to set child's age (5-18)
- **Password Protection**: Secure settings changes
- **Educational Philosophy**: Clear explanation of teaching approach

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scout-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### First Time Setup

1. **Direct Access**: Navigate to the app (no site-wide password required)
2. **Parent Settings**: Click "Parent Settings" to configure age
3. **Create Password**: Set your personal parent password (first time only)
4. **Configure Age**: Set your child's age (5-18 years)
5. **Start Learning**: Explore chat interface or try example homework

## 🎓 Educational Approach

### Age-Specific Teaching Methods

#### Elementary School (Ages 5-10)
- **Concrete Examples**: "If we had 10 cookies and ate 3..."
- **Simple Language**: Avoid abstract concepts
- **Story-Based Learning**: Use characters and narratives
- **Basic Critical Thinking**: "Is that always true?"

#### Middle School (Ages 11-13)
- **Hypothesis Testing**: "What's your guess? How can we check?"
- **Evidence Evaluation**: Compare different sources
- **Probability Concepts**: "Definitely, probably, or maybe true?"
- **Basic Bias Recognition**: "Could there be another explanation?"

#### High School (Ages 14-18)
- **Probabilistic Thinking**: "On a scale of 1-10, how confident?"
- **Cognitive Bias Identification**: Recognize confirmation bias, etc.
- **Complex Analysis**: "What's the strongest counterargument?"
- **Meta-Cognition**: "Notice how your thinking changed?"

### Core Principles

1. **Never Complete Assignments**: Guide through questions instead
2. **Build Confidence in Uncertainty**: "It's okay not to know!"
3. **Evidence-Based Thinking**: "What makes you think that?"
4. **Age-Appropriate Vocabulary**: Automatically adjusted complexity

## 🛠️ Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Components**: TypeScript React components
- **Icons**: Lucide React for consistent iconography

### Backend
- **API Routes**: Next.js API routes for Claude integration
- **AI Integration**: Claude Sonnet 3.5 via Anthropic API
- **File Handling**: React Dropzone for homework uploads

### Design System
- **Color Palette**: Scout Browser inspired blues and whites
- **Typography**: Inter font family
- **Components**: Custom Scout-themed components
- **Animations**: Smooth CSS transitions and transforms

## 📁 Project Structure

```
scout-chat/
├── app/
│   ├── api/chat/           # Claude API integration
│   ├── globals.css         # Beautiful custom styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application
├── components/
│   ├── ChatInterface.tsx   # Chat functionality
│   ├── ExampleHomework.tsx # Sample assignments
│   ├── MainApp.tsx         # Main application component
│   ├── ParentSettings.tsx  # Age configuration & password setup
│   └── PrivacyPolicy.tsx   # Beta guidelines
└── public/
    └── *.svg               # Icons and assets
```

## 🎨 Design Features

### Visual Elements
- **Gradient Backgrounds**: Subtle animated gradients
- **Card Components**: Elevated cards with shadows and hover effects
- **Badge System**: Color-coded difficulty and status indicators
- **Icon Integration**: Consistent Lucide React icons

### Animations
- **Fade Transitions**: Smooth page transitions
- **Hover Effects**: Interactive button and card animations
- **Loading States**: Elegant loading indicators
- **Pulse Effects**: Subtle attention-drawing animations

### Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **Flexible Grid**: CSS Grid and Flexbox layouts
- **Touch Friendly**: Large touch targets for mobile

## 🔧 Configuration

### Environment Variables
The Claude API key is currently hardcoded for demo purposes. In production, use:

```env
CLAUDE_API_KEY=your_api_key_here
```

### Age Settings
Parents can configure age settings (5-18 years) which automatically adjust:
- Response complexity
- Vocabulary level
- Teaching methods
- Question types

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables
3. Deploy with zero configuration

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

This is a beta educational platform. Feedback and suggestions are welcome!

### Guidelines
- Follow the established design system
- Maintain age-appropriate content standards
- Test across different age configurations
- Ensure accessibility compliance

## 📄 License

Built for educational purposes and beta testing.

## 🙏 Acknowledgments

- **Design Inspiration**: Scout Browser (scoutbrowser.org)
- **AI Integration**: Anthropic's Claude Sonnet 3.5
- **Educational Philosophy**: Based on Socratic method and epistemic thinking
- **UI Framework**: Next.js and Tailwind CSS

---

**ScoutChat Beta** - Educational AI Assistant for Parents & Educators  
Built with ❤️ for better learning experiences
