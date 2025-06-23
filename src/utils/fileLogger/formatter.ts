import { LogFormatter, PersonaConversation } from './types';
import { getModelById } from '../../config/models';

export class ConversationFormatter implements LogFormatter {
  formatConversation(conversation: PersonaConversation): string {
    const date = new Date(conversation.timestamp).toISOString();
    const lastUpdated = new Date(conversation.lastUpdated).toISOString();
    
    let content = `Conversation with ${conversation.personaName}\n`;
    content += `ID: ${conversation.id}\n`;
    content += `Started: ${date}\n`;
    content += `Last Updated: ${lastUpdated}\n\n`;

    // Add model usage history
    if (conversation.modelUsage?.length > 0) {
      content += 'Model Usage:\n';
      conversation.modelUsage.forEach(usage => {
        const model = getModelById(usage.modelId);
        content += `- ${new Date(usage.timestamp).toISOString()}: ${model?.name || usage.modelName}\n`;
      });
      content += '\n';
    }

    content += `${'='.repeat(50)}\n\n`;

    conversation.messages.forEach((msg, index) => {
      const role = msg.role === 'assistant' ? conversation.personaName : 'User';
      content += `[${role}]:\n${msg.content}\n`;
      if (index < conversation.messages.length - 1) {
        content += '\n---\n\n';
      }
    });

    return content;
  }

  formatAllConversations(conversations: PersonaConversation[]): string {
    return conversations
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(conv => this.formatConversation(conv))
      .join('\n\n' + '='.repeat(80) + '\n\n');
  }
}