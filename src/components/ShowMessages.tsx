import { SelectMessages } from "@/db/schema";

export default function ShowMessages({ messageList }:
  { messageList: SelectMessages[] }) {
  return (
    <div>
      {messageList.map((message: SelectMessages) =>
        <div key={message.id}>
          <p className="text-xs">{message.name}</p>
          <p> {message.message}</p>
        </div>
      )}
    </div>)
} 
