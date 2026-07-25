import { Metadata } from 'next';
import ChatTemplate from '@/src/templates/chat/ChatTemplate';

export const metadata: Metadata = {
  title: 'Chat - melo.tv',
  description: 'Connect and chat with strangers who share your passions.',
};

export default async function ChatPage(props: { params: Promise<{ conversationId: string }> }) {
  const params = await props.params;
  return <ChatTemplate conversationId={params.conversationId} />;
}
