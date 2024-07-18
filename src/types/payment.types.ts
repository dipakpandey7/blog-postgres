export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    client_secret: string;
  }
  
  export interface PaymentConfirmation {
    id: string;
    amount: number;
    currency: string;
    status: string;
  }