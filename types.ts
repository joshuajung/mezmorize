export interface EventResponseDto {
  id: number;
  event_type: string;
  beginn: string;
  bestaetigt: boolean;
  description: string;
  cancel_state: string;
}

export interface EventsResponseDto {
  events: EventResponseDto[];
}
