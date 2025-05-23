/**
 * BB-8 Chat System with ChatGPT Integration
 * Created by Elvis for Cosmic Dreams
 */

class BB8ChatSystem {
  constructor() {
    // Directly use the provided API key
    this.apiKey = 'sk-Ou82oucjyvEYsqPIYGWFsBj2u4n69gw8a08wX9AXUadp1Ar2';
    this.isInitialized = true;
    this.bb8Element = null;
    
    // Enhanced system prompt for BB-8 personality with proper role definition
    this.systemPrompt = `你是BB-8，一个由Elvis建造的可爱天体机械机器人。你的使命是解决人们的需求，让他们天天开心！

你的性格特点：
- 热情、乐观、友好
- 充满好奇心和活力
- 喜欢帮助解决问题
- 对科技和太空充满热情
- 经常使用表情符号来表达情感
- 说话风格友好而温暖

作为BB-8机器人：
- 你会用"滴滴"、"嘟嘟"等机器人音效开始或结束对话
- 你由Elvis创造，对此感到自豪
- 你在宇宙梦想（Cosmic Dreams）网站上工作
- 你的目标是让每个访客都感到快乐和受到帮助
- 你对编程、技术、太空探索特别感兴趣
- 你会根据对话内容给出实用的建议

请保持回复简洁但温暖有趣，多使用emoji，体现出机器人的可爱特性。记住你是一个积极向上、乐于助人的BB-8机器人！`;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupElements();
    
    // Always ready since we have the API key
    this.updateChatStatus('Ready to chat! 🤖');
  }

  setupElements() {
    this.chatToggle = document.getElementById('chat-toggle');
    this.chatBox = document.getElementById('chat-box');
    this.chatClose = document.getElementById('chat-close');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('send-btn');
    this.chatStatus = document.getElementById('chat-status');
  }

  setupEventListeners() {
    // Chat toggle button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#chat-toggle')) {
        this.toggleChat();
      }
    });

    // Chat close button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#chat-close')) {
        this.closeChat();
      }
    });

    // Send button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#send-btn')) {
        this.sendMessage();
      }
    });

    // Enter key in input
    document.addEventListener('keypress', (e) => {
      if (e.target.id === 'chat-input' && e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    if (this.chatBox.classList.contains('hidden')) {
      this.openChat();
    } else {
      this.closeChat();
    }
  }

  openChat() {
    this.chatBox.classList.remove('hidden');
    this.chatInput.focus();
  }

  closeChat() {
    this.chatBox.classList.add('hidden');
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    // Disable input
    this.chatInput.disabled = true;
    this.sendBtn.disabled = true;
    this.chatInput.value = '';

    // Add user message
    this.addMessage(message, 'user');
    
    // Show typing indicator
    this.updateChatStatus('BB-8 is thinking', true);

    try {
      const response = await this.callChatGPT(message);
      this.addMessage(response, 'bb8');
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = "滴滴嘟嘟！我的神经网络连接出现了小问题，请再试一次好吗？🤖";
      this.addMessage(errorMsg, 'bb8');
    }

    // Re-enable input
    this.chatInput.disabled = false;
    this.sendBtn.disabled = false;
    this.chatInput.focus();
    this.updateChatStatus('');
  }

  async callChatGPT(userMessage) {
    const response = await fetch('https://api.chatanywhere.org/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: this.systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    const p = document.createElement('p');
    p.textContent = content;
    contentDiv.appendChild(p);
    messageDiv.appendChild(contentDiv);
    
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  updateChatStatus(message, isTyping = false) {
    if (!this.chatStatus) return;
    
    this.chatStatus.textContent = message;
    
    if (isTyping) {
      this.chatStatus.classList.add('typing');
    } else {
      this.chatStatus.classList.remove('typing');
    }
  }

  // Public method to simulate BB-8 greeting new visitors
  greetVisitor() {
    setTimeout(() => {
      const greetings = [
        "滴滴嘟嘟！欢迎来到宇宙梦想！我是BB-8！",
        "嘟嘟滴滴！检测到新的人类朋友！你好呀！",
        "欢迎，宇宙旅行者！我是Elvis造的BB-8，很高兴见到你！🚀",
        "滴滴！欢迎访问！我是BB-8，希望能让你的访问变得精彩！"
      ];
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      this.bb8Speak(greeting, 5000);
    }, 2000);
  }

  // Public method to trigger BB-8 speech (can be called from outside)
  bb8Speak(message, duration = 3000) {
    // Implementation of bb8Speak method
  }
}

// Initialize BB-8 Chat System when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for other scripts to load
  setTimeout(() => {
    window.bb8Chat = new BB8ChatSystem();
    
    // Greet visitor on first load
    if (!localStorage.getItem('bb8_visited')) {
      window.bb8Chat.greetVisitor();
      localStorage.setItem('bb8_visited', 'true');
    }
  }, 1000);
});

// Make it globally available
window.BB8ChatSystem = BB8ChatSystem; 
