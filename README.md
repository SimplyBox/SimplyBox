# 🚀 SimplyBox - AI-Powered Smart Inbox for Indonesian SMEs

> **Revolutionizing Communication for Indonesia's 64.2 Million UMKM Businesses**

SimplyBox is an AI-powered smart inbox platform that unifies business communications into one intelligent dashboard, featuring Llama 3.3-70B integration with RAG pipeline for contextual, personalized customer interactions.

---

## 🎯 **Problem We're Solving**

Indonesia's SMEs face overwhelming multi-channel communication challenges:

-   **64.2M UMKM businesses** contribute 61.07% to GDP but struggle with digital transformation
-   Only **13% are fully digitalized**, creating massive productivity gaps
-   Business owners spend **2-4 hours daily** just replying to messages
-   **35% lead loss** due to 2-7 hour response delays
-   **50+ daily messages** across fragmented channels (WhatsApp, Email, etc.)

---

## ✨ **Key Features**

### 🔗 **Unified Inbox** _(Currently Available)_

-   Multi-channel message aggregation (WhatsApp, Email)
-   Real-time message synchronization
-   Message filtering and pinning
-   Auto AI Response with contextual understanding
-   AI-suggested responses (3 options per message)

### 🤖 **AI Assistant Powered by Llama 3.3-70B**

-   **Intent Recognition**: Automatic message classification (lead, complaint, order, info, urgent)
-   **Context-Aware Responses**: RAG pipeline with 5-chat memory system
-   **Multi-language Support**: Optimized for Indonesian business context
-   **80-85% Accuracy** in automatic routing and response generation

### 📁 **Smart Knowledge Base** _(Currently Available)_

-   File upload with categorization, tags, and descriptions
-   **Agentic Chunking**: Adaptive and personalized for each client
-   **Optimized Grouping**: Intelligent data organization
-   Vector database storage with semantic search

### 👥 **Team Collaboration** _(Currently Available)_

-   Seamless team member onboarding
-   Personal login credentials for each member
-   Role-based access control
-   Team invitation system via email

### 🔄 **Coming Soon Features**

-   **Kanban Workflow**: Visual message tracking (To Do → In Progress → Done)
-   **Contact Management**: Comprehensive customer profiles
-   **Advanced Settings**: Customizable automation rules

---

## 🏗️ **Architecture**

### **Frontend**

-   **React** + **TypeScript** for responsive web application
-   Modern UI/UX optimized for Indonesian SME workflows

### **Backend & APIs**

-   **Supabase Edge Functions** for webhooks and business logic
-   **Groq API** for Llama 3.3-70B model inference
-   **Meta OAuth Integration** for real-time WhatsApp webhook processing

### **Database & Storage**

-   **Supabase**: Structured data storage and authentication
-   **Pinecone Vector DB**: RAG implementation with namespace isolation
-   **Supabase Storage**: Secure document management with bucket organization
-   **Ngrok** : for deploying RAG code online

### **AI Pipeline**

```
Message Input → Intent Classification → RAG Retrieval → Response Generation → Human Review
     ↓              (Llama 3.3-70B)      (Pinecone)      (Contextual AI)        (Optional)
 WhatsApp/Email → Business Context → Knowledge Base → Personalized Reply → Customer
```

---

## 🎯 **Target Market**

### **Primary Targets**

1. **Indonesia's UMKM Businesses** (64.2M potential users)
2. **Solopreneurs** seeking automation solutions
3. **Growing Digital Businesses** requiring scalable communication

### **Market Impact**

-   **Immediate (3-12 months)**: Reduce daily communication time from 3 hours to 30 minutes
-   **Medium-term (12-24 months)**: Target 500 active SMEs, expand to basic CRM features
-   **Long-term (2-5 years)**: Market leader for AI communication in Indonesia, regional expansion

---

## 💰 **Pricing Strategy**

| Plan             | Price         | Features                                      |
| ---------------- | ------------- | --------------------------------------------- |
| **Free**         | Rp 0          | One-time trial with limitations               |
| **Starter**      | Rp 399K/month | Essential AI features, 2 team members         |
| **Professional** | Rp 699K/month | Advanced AI, unlimited team, priority support |
| **Enterprise**   | Custom        | Full customization, white-label options       |

_Annual subscriptions available with significant discounts_

---

## 🔒 **Security & Compliance**

### **UU PDP (Personal Data Protection Law) Compliance**

-   **Data Isolation**: Pinecone namespacing prevents cross-company contamination
-   **Encryption**: End-to-end encryption with AES-256 at rest (coming soon)
-   **Access Control**: Role-based access with Multi-Factor Authentication
-   **DPIA**: Data Protection Impact Assessment for AI processing
-   **Breach Notification**: Automated 72-hour notification system

### **AI Ethics**

-   **Bias Mitigation**: Diverse Indonesian training data with monthly auditing
-   **Human Oversight**: Easy escalation to manual handling
-   **Transparency**: Clear AI vs human response indicators

---

## 📊 **Roadmap**

### **Phase 1: Core Platform** ✅

-   [x] Unified Inbox implementation
-   [x] AI-powered response generation
-   [x] RAG knowledge base
-   [x] Team collaboration features
-   [x] File management system

### **Phase 2: Advanced Features** 🚧

-   [ ] Kanban workflow implementation
-   [ ] Contact management system
-   [ ] Advanced settings and automation
-   [ ] Mobile application
-   [ ] E-commerce platform integrations

### **Phase 3: Scale & Expand** 📋

-   [ ] Advanced analytics and reporting
-   [ ] Sentiment analysis integration
-   [ ] Sales prediction features
-   [ ] Regional expansion
-   [ ] White-label solutions

---

## 📞 **Support & Contact**

-   **Documentation**: [https://simplybox.id](https://simplybox.id)
-   **Support Email**: support@simplybox.id
-   **Business Inquiries**: admin@simplybox.id

---

## 🙏 **Acknowledgments**

-   **Meta AI** for Llama 3.3-70B model
-   **Supabase** for backend infrastructure
-   **Pinecone** for vector database solutions
-   **Indonesian SME Community** for valuable feedback and insights

---

<div align="center">

**Made with ❤️ for Indonesia's SME Community**

</div>
