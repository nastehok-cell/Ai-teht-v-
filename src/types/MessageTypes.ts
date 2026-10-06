type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};


type ChatCompletionResponse = {
  choices: {
    message: {
      role: string;
      content: string | null;
    };
  }[];
};
export {MessageResponse, ErrorResponse, ChatCompletionResponse};
