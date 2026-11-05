export interface PlayerDto {
  id: string;
  name: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlayerRequest {
  name: string;
  position: string;
}

export interface UpdatePlayerRequest {
  name?: string;
  position?: string;
}
